import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { NavChrome, NavRail } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Shell } from "@/components/Shell";
import { WorkExperience } from "@/components/WorkExperience";

export default function Page() {
  return (
    <Shell rail={<NavRail />} chrome={<NavChrome />}>
      <main>
        <Hero />
        <WorkExperience />
        <Projects />
        <Contact />
      </main>
    </Shell>
  );
}
