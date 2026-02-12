"use client"

import { TypingAnimation } from "./typing-animation"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen flex flex-col pt-[24vh] pb-[8vh] max-md:pt-[16vh] max-md:pb-[5vh]"
    >
      {/* Typing animation */}
      <div className="max-md:mt-0">
        <TypingAnimation />
      </div>

      {/* Copy text - left-aligned, tight below typing */}
      <div className="mt-3 max-w-[600px] max-md:mt-2">
        <p className="text-[1.3rem] leading-relaxed text-muted-foreground font-normal text-left max-md:text-[1rem]">
          Your AI mate to help you start winning in prediction markets.
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA button - centered */}
      <div className="flex justify-center">
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
