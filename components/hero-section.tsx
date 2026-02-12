"use client"

import { TypingAnimation } from "./typing-animation"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen flex flex-col justify-between pt-[26vh] pb-[6vh] max-md:pt-[24vh] max-md:pb-[4vh]"
    >
      {/* Top area: typing animation fills space */}
      <div className="flex-1 flex flex-col justify-center">
        <TypingAnimation />
      </div>

      {/* Bottom: copy + CTA, tighter gap on desktop, centered on mobile */}
      <div className="flex flex-col items-start gap-5 max-md:items-center max-md:gap-5 max-md:text-center">
        <div className="max-w-[600px]">
          <p className="text-[1.3rem] leading-relaxed text-muted-foreground font-normal max-md:text-[1rem]">
            Your AI mate to help you start winning in prediction markets.
          </p>
        </div>

        <button
          onClick={onCtaClick}
          className="font-sans text-base font-semibold text-foreground bg-secondary border-2 border-primary/30 px-12 py-4 rounded-full cursor-pointer tracking-[0.02em] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-primary hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(156,132,163,0.4)] max-md:px-10 max-md:py-3.5 max-md:text-[0.9rem]"
        >
          Get Access
        </button>
      </div>
    </section>
  )
}
