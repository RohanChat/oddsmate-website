"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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
const SCROLL_PX_PER_FEATURE = 160
const TOUCH_PX_PER_FEATURE = 80
const TRANSITION_MS = 550

export function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [prevFeature, setPrevFeature] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollAccumulator = useRef(0)
  const isLockedRef = useRef(false)
  const isTransitioningRef = useRef(false)
  const currentFeatureRef = useRef(0)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return
    isLockedRef.current = true
    setIsLocked(true)
    scrollAccumulator.current = 0

    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect && Math.abs(rect.top) > 2) {
      window.scrollTo({ top: window.scrollY + rect.top, behavior: "auto" })
    }
    document.body.style.overflow = "hidden"
  }, [])

  const unlockScroll = useCallback((dir?: number) => {
    if (!isLockedRef.current) return
    isLockedRef.current = false
    setIsLocked(false)
    scrollAccumulator.current = 0
    document.body.style.overflow = ""

    // Nudge past the features section so the waitlist is reachable
    if (dir === 1 && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionBottom = window.scrollY + rect.bottom
      requestAnimationFrame(() => {
        window.scrollTo({ top: sectionBottom, behavior: "smooth" })
      })
    }
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
      }, TRANSITION_MS)
    },
    []
  )

  useEffect(() => {
    function shouldLock(rect: DOMRect, movingDown: boolean) {
      return (
        movingDown &&
        rect.top <= 60 &&
        rect.top > -60 &&
        rect.bottom > window.innerHeight * 0.5
      )
    }

    function handleWheel(e: WheelEvent) {
      if (!isLockedRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (rect && shouldLock(rect, e.deltaY > 0)) {
          e.preventDefault()
          lockScroll()
          return
        }
        return
      }

      e.preventDefault()
      if (isTransitioningRef.current) return

      scrollAccumulator.current += e.deltaY

      if (Math.abs(scrollAccumulator.current) >= SCROLL_PX_PER_FEATURE) {
        const dir = scrollAccumulator.current > 0 ? 1 : -1
        const nextFeature = currentFeatureRef.current + dir

        if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
          goToFeature(nextFeature, dir)
        } else {
          unlockScroll(dir)
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
        if (rect && shouldLock(rect, deltaY > 0)) {
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

      if (Math.abs(scrollAccumulator.current) >= TOUCH_PX_PER_FEATURE) {
        const dir = scrollAccumulator.current > 0 ? 1 : -1
        const nextFeature = currentFeatureRef.current + dir

        if (nextFeature >= 0 && nextFeature < NUM_FEATURES) {
          goToFeature(nextFeature, dir)
        } else {
          unlockScroll(dir)
        }
      }
    }

    function handleTouchEnd() {
      touchActive = false
      scrollAccumulator.current = 0
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!isLockedRef.current) return
      if (isTransitioningRef.current) return

      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        const next = currentFeatureRef.current + 1
        if (next < NUM_FEATURES) {
          goToFeature(next, 1)
        } else {
          unlockScroll(1)
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = currentFeatureRef.current - 1
        if (prev >= 0) {
          goToFeature(prev, -1)
        } else {
          unlockScroll(-1)
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
        className={cn(
          "flex items-center gap-[60px] py-10",
          "min-h-screen",
          "max-md:flex-col max-md:gap-3 max-md:py-4 max-md:min-h-[100dvh] max-md:justify-center"
        )}
      >
        {/* Text Stack */}
        <div className={cn(
          "relative flex-1 h-[400px]",
          "max-md:h-auto max-md:w-full max-md:flex-none max-md:min-h-[180px]"
        )}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute top-0 left-0 w-full transition-all pointer-events-none",
                "max-md:relative max-md:top-auto max-md:left-auto",
                idx === currentFeature
                  ? "opacity-100 pointer-events-auto"
                  : cn("opacity-0", !isMobile && "absolute"),
                isMobile && idx !== currentFeature && "hidden"
              )}
              style={{
                transitionDuration: `${TRANSITION_MS}ms`,
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                transform:
                  idx === currentFeature
                    ? "translateY(0)"
                    : idx === prevFeature && direction > 0
                      ? "translateY(-30px)"
                      : "translateY(30px)",
              }}
            >
              <div className="text-[1.1rem] text-primary tracking-[2.5px] uppercase mb-4 max-md:text-[0.9rem] max-md:mb-2 max-md:tracking-[2px]">
                <span className="font-black">{feature.number.split(" / ")[0]} /</span>{" "}
                <span className="font-semibold">{feature.number.split(" / ")[1]}</span>
              </div>
              <h2 className="text-[clamp(2.2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-1.5px] font-bold text-foreground mb-4 whitespace-pre-line max-md:text-[1.6rem] max-md:mb-2 max-md:leading-[1.1]">
                {feature.title}
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
      </section>

      {/* Scroll Progress Dots */}
      <div
        className={cn(
          "fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[100] transition-opacity duration-300",
          "max-md:right-3 max-md:gap-2",
          isLocked
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {[0, 1, 2, 3].map((idx) => (
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
