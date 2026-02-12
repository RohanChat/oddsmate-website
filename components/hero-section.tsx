"use client"

import { TypingAnimation } from "./typing-animation"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen flex flex-col pt-[18vh] pb-[8vh] max-md:pt-[20vh] max-md:pb-[5vh]"
    >
      {/* Top area: typing animation */}
      <div className="flex-1 flex flex-col justify-start pt-[4vh] max-md:pt-[2vh] max-md:justify-center">
        <TypingAnimation />
      </div>

      {/* Bottom: copy + CTA, tight below typing, centered everywhere */}
      <div className="flex flex-col items-center text-center gap-4 max-md:gap-4 mt-2">
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
