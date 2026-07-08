import { ArchitectureSection } from "@/components/system/ArchitectureSection";
import { CapabilityGrid } from "@/components/system/CapabilityGrid";
import { CTASection } from "@/components/system/CTASection";
import { HeroSection } from "@/components/system/HeroSection";
import { MotionProvider } from "@/components/system/MotionProvider";
import { SystemOverview } from "@/components/system/SystemOverview";

export function SystemPageContent() {
  return (
    <MotionProvider>
      <HeroSection />
      <SystemOverview />
      <CapabilityGrid />
      <ArchitectureSection />
      <CTASection />
    </MotionProvider>
  );
}
