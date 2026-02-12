"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { PhoneMockup } from "./phone-mockup"

const features = [
  {
    number: "01 / Ask",
    title: "Every market.\nOne text.",
    description:
      "Just ask your mate what you want. Best odds across every exchange, in seconds.",
  },
  {
    number: "02 / Alerts",
    title: "Tapped in.",
    description:
      "Whale trades, insider bets, volume spikes — pushed to your lock screen before it's priced in.",
  },
  {
    number: "03 / Analysis",
    title: "Your pocket\nquant.",
    description:
      "Your mate pulls the data, spots the patterns, and gives you the analysis that matters.",
  },
  {
    number: "04 / Execute",
    title: "Trade from\nyour texts.",
    description:
      "From signal to settlement without leaving your messages.",
    badge: "Coming Soon",
  },
]

const NUM_FEATURES = 4

export function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const containerHeight = el.offsetHeight
      const viewportHeight = window.innerHeight

      // How far we've scrolled into the container (0 = top edge at viewport top, containerHeight - viewportHeight = bottom)
      const scrolled = -rect.top
      const scrollableRange = containerHeight - viewportHeight

      if (scrolled < 0 || scrolled > scrollableRange) {
        setIsInView(false)
        return
      }

      setIsInView(true)

      // Map scroll position to feature index
      const progress = scrolled / scrollableRange
      const featureIndex = Math.min(
        NUM_FEATURES - 1,
        Math.floor(progress * NUM_FEATURES)
      )
      setCurrentFeature(featureIndex)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll() // initial check
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: `${NUM_FEATURES * 100}vh` }}
    >
      <section
        className={cn(
          "sticky top-0 h-screen flex items-center gap-[60px] py-10",
          "max-md:flex-col max-md:gap-3 max-md:py-4 max-md:justify-center"
        )}
      >
        {/* Text Stack */}
        <div className={cn(
          "relative flex-1 h-[400px]",
          "max-md:h-auto max-md:w-full max-md:flex-none max-md:min-h-[180px] max-md:mt-4"
        )}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute top-0 left-0 w-full transition-all duration-[450ms] pointer-events-none",
                idx === currentFeature
                  ? "opacity-100 pointer-events-auto translate-y-0"
                  : idx < currentFeature
                    ? "opacity-0 -translate-y-[30px]"
                    : "opacity-0 translate-y-[30px]"
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="text-[1.1rem] text-primary tracking-[2.5px] uppercase mb-4 max-md:text-[0.9rem] max-md:mb-2 max-md:tracking-[2px]">
                <span className="font-black">{feature.number.split(" / ")[0]} /</span>{" "}
                <span className="font-semibold">{feature.number.split(" / ")[1]}</span>
              </div>
              <h2 className="text-[clamp(2.2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-1.5px] font-bold text-foreground mb-4 max-md:text-[1.6rem] max-md:mb-2 max-md:leading-[1.1]">
                {feature.title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br className="max-md:hidden" />}
                    {i < arr.length - 1 && <span className="md:hidden"> </span>}
                  </span>
                ))}
              </h2>
              <p className="text-[1.05rem] leading-relaxed text-muted-foreground font-normal max-w-[440px] max-md:text-[0.85rem] max-md:leading-normal">
                {feature.description}
              </p>
              {feature.badge && (
                <span className="inline-block text-[0.7rem] text-primary border border-primary/30 px-3.5 py-1 rounded-full mt-3 font-semibold uppercase tracking-[1px] max-md:text-[0.6rem] max-md:mt-2">
                  {feature.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Phone */}
        <div className="flex-1 max-md:order-first max-md:w-full max-md:flex-none">
          <PhoneMockup activeScreen={currentFeature} />
        </div>

        {/* Scroll Progress Dots */}
        <div
          className={cn(
            "fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[100] transition-opacity duration-300",
            "max-md:right-3 max-md:gap-2",
            isInView
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentFeature
                  ? "bg-primary shadow-[0_0_10px_rgba(156,132,163,0.5)] scale-[1.4]"
                  : "bg-primary/20"
              )}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
