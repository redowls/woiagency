#!/usr/bin/env python3
"""Pull Instagram insights for the WOI account into data/insights.json.

The site is static (Vercel builds from git), so the numbers on it are only
as fresh as this file. Run it from cron:

    python3 scripts/sync_insights.py --commit --rebuild

  --commit   commit + push data/insights.json when the numbers changed,
             which makes Vercel redeploy with the new figures
  --rebuild  rebuild + restart the local woiagency.service afterwards so
             the VPS copy on :8080 matches

The access token never enters the repo: it lives in an env file outside it
(WOI_IG_ENV, default /root/.woi-insights.env) as IG_TOKEN=... and is
refreshed here once a week — Meta's long-lived tokens expire after 60 days,
and a refresh only works on a token that is at least a day old.

Stdlib only, on purpose: the VPS cron has no virtualenv.
"""

from __future__ import annotations

import argparse
import json
import os
import pwd
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

API = "https://graph.instagram.com/v23.0"
REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "data" / "insights.json"
ENV_PATH = Path(os.environ.get("WOI_IG_ENV", "/root/.woi-insights.env"))
REFRESH_AFTER = timedelta(days=7)
HISTORY_DAYS = 30  # the API serves account series 30 days back per call
MEDIA_METRICS = "views,reach,likes,comments,shares,saved"
CAPTION_CHARS = 80
SERVICE_USER = "woiagency"


def log(msg: str) -> None:
    print(f"[{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ')}] {msg}", flush=True)


# ---------------------------------------------------------------- env file

def read_env() -> dict[str, str]:
    env: dict[str, str] = {}
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    if "IG_TOKEN" not in env:
        sys.exit(f"{ENV_PATH}: no IG_TOKEN")
    return env


def write_env(env: dict[str, str]) -> None:
    tmp = ENV_PATH.with_suffix(".tmp")
    tmp.write_text("".join(f"{k}={v}\n" for k, v in env.items()))
    os.chmod(tmp, 0o600)
    os.replace(tmp, ENV_PATH)


# ---------------------------------------------------------------- API

class ApiError(Exception):
    pass


def get(token: str, path: str, **params) -> dict:
    params["access_token"] = token
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        try:
            err = json.load(e)["error"]
        except Exception:  # noqa: BLE001 — body wasn't Meta's error shape
            raise ApiError(f"HTTP {e.code} on {path}") from e
        raise ApiError(f"{err.get('message')} (code {err.get('code')}) on {path}") from e


def maybe_refresh_token(env: dict[str, str]) -> str:
    """Rotate the long-lived token weekly; failure is not fatal."""
    stamp = env.get("IG_TOKEN_REFRESHED_AT")
    if stamp:
        last = datetime.fromisoformat(stamp)
        if datetime.now(timezone.utc) - last < REFRESH_AFTER:
            return env["IG_TOKEN"]
    try:
        r = get(env["IG_TOKEN"], "refresh_access_token", grant_type="ig_refresh_token")
    except ApiError as e:
        log(f"token refresh skipped: {e}")
        if not stamp:
            # first run on a fresh token: remember today so we retry in a week
            env["IG_TOKEN_REFRESHED_AT"] = datetime.now(timezone.utc).isoformat()
            write_env(env)
        return env["IG_TOKEN"]
    env["IG_TOKEN"] = r["access_token"]
    env["IG_TOKEN_REFRESHED_AT"] = datetime.now(timezone.utc).isoformat()
    write_env(env)
    log(f"token refreshed, valid {r.get('expires_in', 0) // 86400} days")
    return env["IG_TOKEN"]


def fetch_media(token: str) -> list[dict]:
    fields = "id,media_type,media_product_type,timestamp,permalink,caption,like_count,comments_count"
    out: list[dict] = []
    page = get(token, "me/media", fields=fields, limit=100)
    while True:
        out.extend(page.get("data", []))
        nxt = page.get("paging", {}).get("next")
        if not nxt:
            return out
        with urllib.request.urlopen(nxt, timeout=30) as r:
            page = json.load(r)


def fetch_media_insights(token: str, media_id: str) -> dict[str, int]:
    try:
        r = get(token, f"{media_id}/insights", metric=MEDIA_METRICS)
    except ApiError as e:
        log(f"insights unavailable for {media_id}: {e}")
        return {}
    vals: dict[str, int] = {}
    for item in r.get("data", []):
        if "values" in item:
            vals[item["name"]] = item["values"][0].get("value", 0)
        else:
            vals[item["name"]] = item.get("total_value", {}).get("value", 0)
    return vals


def fetch_daily(token: str, user_id: str) -> dict[str, dict[str, int]]:
    """{date: {followerDelta, reach}} for the last HISTORY_DAYS days."""
    now = int(time.time())
    since = now - (HISTORY_DAYS - 1) * 86400
    days: dict[str, dict[str, int]] = {}
    for metric, key in (("follower_count", "followerDelta"), ("reach", "reach")):
        r = get(token, f"{user_id}/insights", metric=metric, period="day", since=since, until=now)
        for v in r["data"][0].get("values", []):
            day = v["end_time"][:10]
            days.setdefault(day, {})[key] = v.get("value", 0)
    return days


# ---------------------------------------------------------------- shaping

def shortcode(permalink: str) -> str:
    # https://www.instagram.com/reel/DdBbDFIBIap/ -> DdBbDFIBIap
    parts = [p for p in urllib.parse.urlparse(permalink).path.split("/") if p]
    return parts[-1] if parts else ""


def kind(m: dict) -> str:
    if m.get("media_product_type") == "REELS" or m.get("media_type") == "VIDEO":
        return "REEL"
    return "CAROUSEL" if m.get("media_type") == "CAROUSEL_ALBUM" else "IMAGE"


def build(token: str, previous: dict | None) -> dict:
    me = get(token, "me", fields="user_id,username,followers_count,follows_count,media_count")
    media = []
    for m in fetch_media(token):
        ins = fetch_media_insights(token, m["id"])
        caption = " ".join((m.get("caption") or "").split())
        media.append({
            "id": m["id"],
            "shortcode": shortcode(m["permalink"]),
            "permalink": m["permalink"],
            "type": kind(m),
            "timestamp": m["timestamp"],
            "caption": caption[:CAPTION_CHARS],
            "views": ins.get("views", 0),
            "reach": ins.get("reach", 0),
            "likes": ins.get("likes", m.get("like_count", 0)),
            "comments": ins.get("comments", m.get("comments_count", 0)),
            "saves": ins.get("saved", 0),
            "shares": ins.get("shares", 0),
        })
    media.sort(key=lambda x: x["timestamp"])

    # keep every day we have ever seen; fresh values win for overlapping days
    daily = {d["date"]: {k: v for k, v in d.items() if k != "date"}
             for d in (previous or {}).get("daily", [])}
    for day, vals in fetch_daily(token, me["user_id"]).items():
        daily.setdefault(day, {}).update(vals)
    daily_rows = [{"date": d, **daily[d]} for d in sorted(daily)]

    return {
        "generatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "account": {
            "username": me["username"],
            "followers": me["followers_count"],
            "following": me.get("follows_count", 0),
            "posts": me["media_count"],
        },
        "media": media,
        "daily": daily_rows,
    }


def same_numbers(a: dict | None, b: dict) -> bool:
    if not a:
        return False
    strip = lambda d: {k: v for k, v in d.items() if k != "generatedAt"}  # noqa: E731
    return strip(a) == strip(b)


# ---------------------------------------------------------------- git / deploy

def sh(*cmd: str, check: bool = True) -> str:
    r = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True)
    if check and r.returncode:
        raise RuntimeError(f"{' '.join(cmd)}\n{r.stderr.strip()}")
    return r.stdout.strip()


def chown_to_service_user(*paths: Path) -> None:
    try:
        pw = pwd.getpwnam(SERVICE_USER)
    except KeyError:
        return
    for p in paths:
        for f in [p, *p.rglob("*")] if p.is_dir() else [p]:
            os.chown(f, pw.pw_uid, pw.pw_gid)


def write_file(data: dict) -> None:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    chown_to_service_user(OUT.parent)


def committed_version() -> dict | None:
    """The insights file as of HEAD — what is actually deployed."""
    r = subprocess.run(["git", "show", f"HEAD:{OUT.relative_to(REPO)}"],
                       cwd=REPO, capture_output=True, text=True)
    return json.loads(r.stdout) if r.returncode == 0 and r.stdout else None


def commit_and_push(data: dict) -> bool:
    """Land data/insights.json on origin/main; False if the tree wasn't ours to touch.

    Pull first, on a clean tree, then write: a rebase refuses to run over an
    unstaged file — including the very one we are about to commit.
    """
    rel = str(OUT.relative_to(REPO))
    dirty = [l for l in sh("git", "status", "--porcelain", "--untracked-files=no").splitlines()
             if not l.endswith(rel)]
    if dirty:
        log(f"repo has other uncommitted changes, not committing: {dirty[:3]}")
        return False
    sh("git", "checkout", "--quiet", "--", rel, check=False)  # the fresh copy is in memory
    sh("git", "pull", "--rebase", "--quiet", "origin", "main")
    write_file(data)
    sh("git", "add", rel)
    if sh("git", "diff", "--cached", "--name-only"):
        sh("git", "commit", "--quiet", "-m", f"chore: sync Instagram insights ({data['generatedAt'][:10]})")
        sh("git", "-c", "credential.helper=store", "push", "--quiet", "origin", "main")
        log("pushed — Vercel will redeploy")
    chown_to_service_user(REPO / ".git")
    return True


def rebuild_local() -> None:
    sh("npm", "run", "build")
    chown_to_service_user(REPO / ".next", OUT.parent)
    subprocess.run(["systemctl", "restart", "woiagency.service"], check=False)
    log("local build refreshed")


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--commit", action="store_true", help="commit + push when changed")
    ap.add_argument("--rebuild", action="store_true", help="rebuild + restart the local service")
    args = ap.parse_args()

    env = read_env()
    token = maybe_refresh_token(env)
    previous = json.loads(OUT.read_text()) if OUT.exists() else None

    try:
        data = build(token, previous)
    except ApiError as e:
        log(f"FAILED: {e}")
        return 1

    tv = sum(m["views"] for m in data["media"])
    log(f"{data['account']['username']}: {data['account']['followers']:,} followers, "
        f"{len(data['media'])} posts, {tv:,} views")

    # "changed" means changed against what is deployed — the last commit —
    # not against a working copy a failed run may have left behind
    baseline = committed_version() if args.commit else previous
    if same_numbers(baseline, data):
        log("no change")
        return 0

    status = 0
    try:
        if args.commit and commit_and_push(data):
            pass
        else:
            write_file(data)
            status = 1 if args.commit else 0
    except RuntimeError as e:
        log(f"commit failed: {e}")
        write_file(data)
        status = 1
    log(f"wrote {OUT.relative_to(REPO)}")

    if args.rebuild:
        try:
            rebuild_local()
        except RuntimeError as e:
            log(f"rebuild failed: {e}")
            status = 1
    return status


if __name__ == "__main__":
    sys.exit(main())
