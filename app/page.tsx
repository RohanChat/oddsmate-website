"use client"

import { BackgroundEffects } from "@/components/background-effects"
import { FloatingNav } from "@/components/floating-nav"
import { HeroSection } from "@/components/hero-section"
import { ScrollHero } from "@/components/scroll-hero"
import { FeaturesSection } from "@/components/features-section"
import { WaitlistSection } from "@/components/waitlist-section"
import { WaitlistPopup } from "@/components/waitlist-popup"

function openPopup() {
  window.dispatchEvent(new CustomEvent("oddsmate:open-popup"))
}

export default function Page() {
  return (
    <>
      <BackgroundEffects />
      <FloatingNav />

      {/* Top hero in constrained container */}
      <div className="relative z-[1] w-full max-w-[1200px] mx-auto px-10 max-md:px-5">
        <HeroSection onCtaClick={openPopup} />
      </div>

      {/* Full-width scroll-locked hero section */}
      <div className="relative z-[2]">
        <ScrollHero />
      </div>

      {/* Features + rest of content in constrained container */}
      <div className="relative z-[1] w-full max-w-[1200px] mx-auto px-10 max-md:px-5">
        <FeaturesSection />
        <WaitlistSection />

        <footer className="py-10 flex justify-center text-[0.8rem] text-muted-foreground relative z-[1]">
          <div>&copy; 2026 ODDSMATE Inc. All rights reserved.</div>
        </footer>
      </div>

      {/* Custom popup overlay with liquid glass */}
      <WaitlistPopup />
    </>
  )
}
