import { BackgroundEffects } from "@/components/background-effects"
import { WaitlistSection } from "@/components/waitlist-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register Interest - ODDS/MATE",
  description:
    "Join the ODDS/MATE early access waitlist for a chance to win $1K.",
}

export default function RegisterInterestPage() {
  return (
    <>
      <BackgroundEffects />

      <div className="relative z-[1] flex min-h-screen flex-col items-center justify-center w-full max-w-[1200px] mx-auto px-10 max-md:px-5">
        <WaitlistSection />

        <footer className="py-10 flex justify-center text-[0.8rem] text-muted-foreground">
          <div>&copy; 2026 ODDSMATE Inc. All rights reserved.</div>
        </footer>
      </div>
    </>
  )
}
