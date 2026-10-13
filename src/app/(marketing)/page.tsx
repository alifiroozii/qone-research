import React from "react";
import { HeroSection } from "@/components/marketing/hero-section";
import { ServicesSection, StepsSection } from "@/components/marketing/home-sections";
import { FeaturesSection, FaqSection } from "@/components/marketing/home-cta-sections";
import { CtaSection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StepsSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
