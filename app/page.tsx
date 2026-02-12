"use client"

import { BackgroundEffects } from "@/components/background-effects"
import { FloatingNav } from "@/components/floating-nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { WaitlistSection } from "@/components/waitlist-section"

function openViralLoopsPopup() {
  const popup = document.querySelector(
    'form-widget[mode="popup"]'
  ) as HTMLElement | null
  if (popup && typeof (popup as any).open === "function") {
    ;(popup as any).open()
  } else {
    // Fallback: scroll to waitlist embed
    document.body.style.overflow = ""
    setTimeout(() => {
      document
        .getElementById("waitlistSection")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }
}

export default function Page() {
  return (
    <>
      <BackgroundEffects />
      <FloatingNav />

      <div className="relative z-[1] w-full max-w-[1200px] mx-auto px-10 max-md:px-5">
        <HeroSection onCtaClick={openViralLoopsPopup} />
        <FeaturesSection />
        <WaitlistSection />

        <footer className="py-10 flex justify-center text-[0.8rem] text-muted-foreground relative z-[1]">
          <div>&copy; 2025 ODDS/MATE INTELLIGENCE</div>
        </footer>
      </div>
    </>
  )
}
