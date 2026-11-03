import { BottomNav } from "@/components/organisms/BottomNav";
import { BenchmarkSection } from "@/components/organisms/BenchmarkSection";
import { ClosingSection } from "@/components/organisms/ClosingSection";
import { EntrySection } from "@/components/organisms/EntrySection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { FlowPin } from "@/components/organisms/FlowPin";
import { HeroStory } from "@/components/organisms/HeroStory";
import { ImpactSection } from "@/components/organisms/ImpactSection";
import { Loader } from "@/components/organisms/Loader";
import { Motion } from "@/components/organisms/Motion";
import { ProblemSection } from "@/components/organisms/ProblemSection";
import { RolesSection } from "@/components/organisms/RolesSection";
import { ScoringSection } from "@/components/organisms/ScoringSection";
import { INTRO_SCRIPT } from "@/lib/intro";
import landing from "@/styles/landing.module.css";

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <Loader />
      <Motion>
        <main id="content" className={landing.main}>
          <HeroStory />
          <ProblemSection />
          <RolesSection />
          <ScoringSection />
          <section
            id="alur"
            className={landing.inkFlow}
            data-theme-section="dark"
          >
            <FlowPin />
          </section>
          <ImpactSection />
          <EntrySection />
          <BenchmarkSection />
          <FaqSection />
          <ClosingSection />
        </main>
        <BottomNav />
      </Motion>
    </>
  );
}
