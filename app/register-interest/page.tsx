import { BackgroundEffects } from "@/components/background-effects"
import { WaitlistSection } from "@/components/waitlist-section"
import { RegisterInterestNav } from "@/components/register-interest-nav"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Early Access Waitlist.",
  description: "A conversational AI platform built for prediction markets. Real-time odds, insider-level intelligence.",
  openGraph: {
    title: "Early Access Waitlist.",
    description: "A conversational AI platform built for prediction markets. Real-time odds, insider-level intelligence.",
    url: "https://oddsmate.ai/register-interest",
    siteName: "ODDS/MATE",
    images: [
      {
        url: "https://oddsmate.ai/og-register-interest.png",
        width: 1200,
        height: 630,
        alt: "Early Access to ODDS/MATE",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Early Access Waitlist.",
    description: "A conversational AI platform built for prediction markets. Real-time odds, insider-level intelligence.",
    images: ["https://oddsmate.ai/og-register-interest.png"],
  },
}

export default function RegisterInterestPage() {
  return (
    <>
      <BackgroundEffects />
      <RegisterInterestNav />

      <div className="relative z-[1] flex min-h-screen flex-col items-center justify-center w-full max-w-[1200px] mx-auto px-10 max-md:px-5 pt-16">
        <WaitlistSection />

        <footer className="py-10 flex justify-center text-[0.8rem] text-muted-foreground">
          <div>&copy; 2026 ODDSMATE Inc. All rights reserved.</div>
        </footer>
      </div>
    </>
  )
}
