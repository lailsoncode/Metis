import { MetisHeader } from "@/components/metis/MetisHeader";
import { MetisHero } from "@/components/metis/MetisHero";
import { AboutSection } from "@/components/metis/AboutSection";
import { ThemesGallery } from "@/components/metis/ThemesGallery";
import { VideoShowcase } from "@/components/metis/VideoShowcase";
import { ImpactSection } from "@/components/metis/ImpactSection";
import { MetisFooter } from "@/components/metis/MetisFooter";

const MetisHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <MetisHeader />
      <main>
        <MetisHero />
        <AboutSection />
        <ThemesGallery />
        <VideoShowcase />
        <ImpactSection />
      </main>
      <MetisFooter />
    </div>
  );
};

export default MetisHome;
