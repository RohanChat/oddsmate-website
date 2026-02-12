"use client"

import { TypingAnimation } from "./typing-animation"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen flex flex-col justify-center py-[6vh] pb-[8vh]"
    >
      <TypingAnimation />

      <div className="mt-[6vh] max-w-[600px]">
        <p className="text-[1.3rem] leading-relaxed text-muted-foreground font-normal">
          Your AI mate to help you start winning in prediction markets.
        </p>
      </div>

      <div className="flex justify-center items-center gap-5 mt-12">
        <button
          onClick={onCtaClick}
          className="font-sans text-base font-semibold text-foreground bg-secondary border-2 border-primary/30 px-12 py-4 rounded-full cursor-pointer tracking-[0.02em] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-primary hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(156,132,163,0.4)]"
        >
          Get Access
        </button>
      </div>
    </section>
  )
}
