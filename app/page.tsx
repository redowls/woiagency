import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="woi-page">
      <Nav />
      <Hero />
      <Services />
      <Portfolio />
      <Insights />
      <Contact />
    </div>
  );
}
