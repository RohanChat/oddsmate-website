"use client"

import { BackgroundEffects } from "@/components/background-effects"
import { FloatingNav } from "@/components/floating-nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { WaitlistSection } from "@/components/waitlist-section"

function openViralLoopsPopup() {
  // Try clicking the Viral Loops popup widget to open it
  const popup = document.querySelector(
    'form-widget[mode="popup"]'
  ) as HTMLElement | null
  if (popup) {
    popup.click()
  }
  // Also fallback: scroll to waitlist embed
  document.body.style.overflow = ""
  setTimeout(() => {
    document
      .getElementById("waitlistSection")
      ?.scrollIntoView({ behavior: "smooth" })
  }, 50)
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

      {/* Viral Loops Popup - always in DOM for Get Access buttons */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<form-widget mode="popup" ucid="ArwbyWM6Vu8sn8nmtKOoxV1swp4"></form-widget>`,
        }}
      />
    </>
  )
}
