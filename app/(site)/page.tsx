import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { RecentProjects } from "@/components/sections/recent-projects";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <RecentProjects />
      <CTA />
    </>
  );
}
