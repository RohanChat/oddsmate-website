"use client"

import { TypingAnimation } from "./typing-animation"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen flex flex-col justify-between pt-[28vh] pb-[6vh] max-md:pt-[30vh] max-md:pb-[5vh]"
    >
      {/* Top area: typing animation grows to fill space */}
      <div className="flex-1 flex flex-col justify-center">
        <TypingAnimation />
      </div>

      {/* Bottom anchored: copy text + CTA */}
      <div className="flex flex-col items-start gap-8 max-md:gap-6">
        <div className="max-w-[600px]">
          <p className="text-[1.3rem] leading-relaxed text-muted-foreground font-normal max-md:text-[1.1rem]">
            Your AI mate to help you start winning in prediction markets.
          </p>
        </div>

        <div className="flex justify-center items-center w-full">
          <button
            onClick={onCtaClick}
            className="font-sans text-base font-semibold text-foreground bg-secondary border-2 border-primary/30 px-12 py-4 rounded-full cursor-pointer tracking-[0.02em] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-primary hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(156,132,163,0.4)] max-md:px-10 max-md:py-3.5 max-md:text-[0.9rem]"
          >
            Get Access
          </button>
        </div>
      </div>
    </section>
  )
}
