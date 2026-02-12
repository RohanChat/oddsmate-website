"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { PhoneMockup } from "./phone-mockup"

const features = [
  {
    number: "01 / Search",
    title: "On-demand\npricing",
    description:
      "No more trawling through endless screens. Just ask for the markets and parlays you want — your mate finds the best lines instantly.",
  },
  {
    number: "02 / Alerts",
    title: "Get notified of\nopportunities",
    description:
      "Your mate pings you when there's breaking news on your market, or when significant whale activity or potential insider movement is detected.",
  },
  {
    number: "03 / Execute",
    title: "Execute straight\nfrom chat",
    description:
      "Place trades, manage positions, and track performance without ever leaving your messages.",
    badge: "Coming Soon",
  },
]

const NUM_FEATURES = 3
const SCROLL_THRESHOLD = 120

export function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [prevFeature, setPrevFeature] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollAccumulator = useRef(0)
  const isLockedRef = useRef(false)
  const isTransitioningRef = useRef(false)
  const currentFeatureRef = useRef(0)

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return
    isLockedRef.current = true
    setIsLocked(true)

    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect && Math.abs(rect.top) > 2) {
      window.scrollTo({ top: window.scrollY + rect.top, behavior: "auto" })
    }
    document.body.classList.add("scroll-locked")
  }, [])

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return
    isLockedRef.current = false
    setIsLocked(false)
    document.body.classList.remove("scroll-locked")
  }, [])

  const goToFeature = useCallback(
    (index: number, dir: number) => {
      if (
        index < 0 ||
        index >= NUM_FEATURES ||
        index === currentFeatureRef.current
      )
        return
      if (isTransitioningRef.current) return

      isTransitioningRef.current = true
      setIsTransitioning(true)
      setPrevFeature(currentFeatureRef.current)
      setDirection(dir)
      currentFeatureRef.current = index
      setCurrentFeature(index)

      setTimeout(() => {
        isTransitioningRef.current = false
        setIsTransitioning(false)
        setPrevFeature(null)
        scrollAccumulator.current = 0
      }, 600)
    },
    []
  )

  useEffect(() => {
    function checkShouldLock() {
      if (isLockedRef.current) return
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      if (
        rect.top <= 80 &&
        rect.top >= -20 &&
        rect.bottom > window.innerHeight * 0.5
      ) {
        lockScroll()
      }
    }

    function handleScroll() {
      checkShouldLock()
    }

    function handleWheel(e: WheelEvent) {
      if (isLockedRef.current) {
        e.preventDefault()
        if (isTransitioningRef.current) return

        scrollAccumulator.current += e.deltaY

        if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
          const dir = scrollAccumulator.current > 0 ? 1 : -1
          const nextFeature = currentFeatureRef.current + dir

          if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
            goToFeature(nextFeature, dir)
          } else {
            unlockScroll()
            scrollAccumulator.current = 0
          }
        }
        return
      }

      if (e.deltaY > 0) {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (
          rect &&
          rect.top <= 150 &&
          rect.top > -20 &&
          rect.bottom > window.innerHeight * 0.5
        ) {
          e.preventDefault()
          lockScroll()
        }
      }
    }

    let touchStartY = 0
    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isLockedRef.current) return
      e.preventDefault()
      if (isTransitioningRef.current) return

      const deltaY = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      scrollAccumulator.current += deltaY

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        const dir = scrollAccumulator.current > 0 ? 1 : -1
        const nextFeature = currentFeatureRef.current + dir
        if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
          goToFeature(nextFeature, dir)
        } else {
          unlockScroll()
          scrollAccumulator.current = 0
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [lockScroll, unlockScroll, goToFeature])

  return (
    <>
      <section
        ref={sectionRef}
        id="featuresSection"
        className="min-h-screen grid items-center gap-[60px] max-md:grid-cols-1 max-md:gap-[30px] max-md:py-10"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Text Stack */}
        <div className="relative h-[360px] max-md:h-[300px]">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute top-0 left-0 w-full transition-all duration-500 pointer-events-none",
                idx === currentFeature && "opacity-100 pointer-events-auto",
                idx !== currentFeature && "opacity-0"
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                transform:
                  idx === currentFeature
                    ? "translateY(0)"
                    : idx === prevFeature && direction > 0
                      ? "translateY(-30px)"
                      : "translateY(30px)",
              }}
            >
              <div className="text-[0.8rem] text-primary font-bold tracking-[2px] uppercase mb-4">
                {feature.number}
              </div>
              <h2 className="text-[clamp(2.2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-1.5px] font-semibold text-foreground mb-5 whitespace-pre-line">
                {feature.title}
              </h2>
              <p className="text-[1.05rem] leading-relaxed text-muted-foreground font-normal max-w-[440px]">
                {feature.description}
              </p>
              {feature.badge && (
                <span className="inline-block text-[0.7rem] text-primary border border-primary/30 px-3.5 py-1 rounded-full mt-4 font-semibold uppercase tracking-[1px]">
                  {feature.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Phone */}
        <div className="max-md:order-first">
          <PhoneMockup activeScreen={currentFeature} />
        </div>
      </section>

      {/* Scroll Progress Dots */}
      <div
        className={cn(
          "fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[100] transition-opacity duration-300 max-md:hidden",
          isLocked ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx !== currentFeature && !isTransitioning) {
                goToFeature(idx, idx > currentFeature ? 1 : -1)
              }
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
              idx === currentFeature
                ? "bg-primary shadow-[0_0_10px_rgba(156,132,163,0.5)] scale-[1.4]"
                : "bg-primary/20"
            )}
            aria-label={`Go to feature ${idx + 1}`}
          />
        ))}
      </div>
    </>
  )
}
