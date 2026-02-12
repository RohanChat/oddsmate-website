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
const SCROLL_PX_PER_FEATURE = 150

export function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [prevFeature, setPrevFeature] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollAccumulator = useRef(0)
  const isLockedRef = useRef(false)
  const isTransitioningRef = useRef(false)
  const currentFeatureRef = useRef(0)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return
    isLockedRef.current = true
    setIsLocked(true)
    scrollAccumulator.current = 0

    // Snap section to viewport top
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect && Math.abs(rect.top) > 2) {
      window.scrollTo({ top: window.scrollY + rect.top, behavior: "auto" })
    }
    document.body.style.overflow = "hidden"
  }, [])

  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return
    isLockedRef.current = false
    setIsLocked(false)
    scrollAccumulator.current = 0
    document.body.style.overflow = ""
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
      setPrevFeature(currentFeatureRef.current)
      setDirection(dir)
      currentFeatureRef.current = index
      setCurrentFeature(index)
      scrollAccumulator.current = 0

      if (transitionTimer.current) clearTimeout(transitionTimer.current)
      transitionTimer.current = setTimeout(() => {
        isTransitioningRef.current = false
        setPrevFeature(null)
        scrollAccumulator.current = 0
      }, 500)
    },
    []
  )

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (!isLockedRef.current) {
        // Check if we should lock
        const rect = sectionRef.current?.getBoundingClientRect()
        if (
          rect &&
          e.deltaY > 0 &&
          rect.top <= 100 &&
          rect.top > -40 &&
          rect.bottom > window.innerHeight * 0.5
        ) {
          e.preventDefault()
          lockScroll()
          return
        }
        return
      }

      // We're locked
      e.preventDefault()
      if (isTransitioningRef.current) return

      scrollAccumulator.current += e.deltaY

      if (Math.abs(scrollAccumulator.current) >= SCROLL_PX_PER_FEATURE) {
        const dir = scrollAccumulator.current > 0 ? 1 : -1
        const nextFeature = currentFeatureRef.current + dir

        if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
          goToFeature(nextFeature, dir)
        } else {
          unlockScroll()
        }
      }
    }

    let touchStartY = 0
    let touchActive = false

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
      touchActive = true
    }

    function handleTouchMove(e: TouchEvent) {
      if (!touchActive) return

      const currentY = e.touches[0].clientY
      const deltaY = touchStartY - currentY

      if (!isLockedRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (
          rect &&
          deltaY > 0 &&
          rect.top <= 100 &&
          rect.top > -40 &&
          rect.bottom > window.innerHeight * 0.5
        ) {
          e.preventDefault()
          lockScroll()
          touchStartY = currentY
          return
        }
        return
      }

      e.preventDefault()
      if (isTransitioningRef.current) return

      scrollAccumulator.current += deltaY
      touchStartY = currentY

      if (Math.abs(scrollAccumulator.current) >= SCROLL_PX_PER_FEATURE * 0.6) {
        const dir = scrollAccumulator.current > 0 ? 1 : -1
        const nextFeature = currentFeatureRef.current + dir

        if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
          goToFeature(nextFeature, dir)
        } else {
          unlockScroll()
        }
      }
    }

    function handleTouchEnd() {
      touchActive = false
      scrollAccumulator.current = 0
    }

    // Also handle keyboard
    function handleKeyDown(e: KeyboardEvent) {
      if (!isLockedRef.current) return
      if (isTransitioningRef.current) return

      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        const next = currentFeatureRef.current + 1
        if (next < NUM_FEATURES) {
          goToFeature(next, 1)
        } else {
          unlockScroll()
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = currentFeatureRef.current - 1
        if (prev >= 0) {
          goToFeature(prev, -1)
        } else {
          unlockScroll()
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("keydown", handleKeyDown)
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
    }
  }, [lockScroll, unlockScroll, goToFeature])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id="featuresSection"
        className="min-h-screen flex items-center gap-[60px] py-10 max-md:flex-col max-md:gap-4 max-md:py-6 max-md:min-h-[100dvh] max-md:justify-center"
      >
        {/* Text Stack */}
        <div className="relative flex-1 h-[400px] max-md:h-[240px] max-md:w-full max-md:flex-none">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute top-0 left-0 w-full transition-all duration-[500ms] pointer-events-none",
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
              <div className="text-[0.95rem] text-primary font-extrabold tracking-[2.5px] uppercase mb-5">
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
        <div className="flex-1 max-md:order-first max-md:w-full max-md:flex-none">
          <PhoneMockup activeScreen={currentFeature} />
        </div>
      </section>

      {/* Scroll Progress Dots */}
      <div
        className={cn(
          "fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[100] transition-opacity duration-300 max-md:hidden",
          isLocked
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx !== currentFeature && !isTransitioningRef.current) {
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
