import { redirect } from "next/navigation";
import { ForApplicantsSection } from "@/components/marketing/ForApplicantsSection";
import { QuoteCarouselSection } from "@/components/marketing/QuoteCarouselSection";
import { LandingHero } from "@/components/marketing/LandingHero";
import { ResumeBuilderFeaturesSection } from "@/components/marketing/ResumeBuilderFeaturesSection";
import { AtsSection } from "@/components/marketing/AtsSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { HowItHelpsSection } from "@/components/marketing/HowItHelpsSection";
import { JobSearchHubSection } from "@/components/marketing/JobSearchHubSection";
import { ResumePickerSection } from "@/components/marketing/ResumePickerSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <LandingHero />
      <ResumeBuilderFeaturesSection />
      <StatsSection />
      <AtsSection />
      <TestimonialsSection />
      <HowItHelpsSection />
      <ResumePickerSection />
      <JobSearchHubSection />
      <ForApplicantsSection />
      <QuoteCarouselSection />
    </>
  );
}
