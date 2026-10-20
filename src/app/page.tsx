import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { Capabilities } from "@/components/sections/Capabilities";
import { Footer } from "@/components/sections/Footer";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Marquee items={["Automação com IA", "Software", "Design", "Tráfego"]} />
      <About />
      <ProjectIndex />
      <Marquee items={["Disponível para projetos", "Rio de Janeiro", "Remoto"]} reverse />
      <Capabilities />
      <Footer />
    </main>
  );
}
