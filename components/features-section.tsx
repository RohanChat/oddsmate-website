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
const WHEEL_THRESHOLD = 120
const TOUCH_THRESHOLD = 30
const TRANSITION_MS = 500

export function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [prevFeature, setPrevFeature] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const accum = useRef(0)
  const locked = useRef(false)
  const transitioning = useRef(false)
  const feat = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // --- Lock / Unlock ---
  const lock = useCallback((startFeature: number) => {
    if (locked.current) return
    locked.current = true
    setIsLocked(true)
    accum.current = 0

    feat.current = startFeature
    setCurrentFeature(startFeature)

    // Snap section to top
    const el = sectionRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      if (Math.abs(rect.top) > 2) {
        window.scrollTo({ top: window.scrollY + rect.top, behavior: "auto" })
      }
    }
    document.body.style.overflow = "hidden"
  }, [])

  const unlock = useCallback((dir: number) => {
    if (!locked.current) return
    locked.current = false
    setIsLocked(false)
    accum.current = 0
    document.body.style.overflow = ""

    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    if (dir > 0) {
      // Past last feature going down -> scroll past section
      window.scrollTo({ top: window.scrollY + rect.bottom + 1, behavior: "smooth" })
    } else {
      // Past first feature going up -> scroll above section
      window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 100), behavior: "smooth" })
    }
  }, [])

  // --- Step to a feature ---
  const step = useCallback((index: number, dir: number) => {
    if (index < 0 || index >= NUM_FEATURES || transitioning.current) return

    transitioning.current = true
    setPrevFeature(feat.current)
    setDirection(dir)
    feat.current = index
    setCurrentFeature(index)
    accum.current = 0

    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      transitioning.current = false
      setPrevFeature(null)
      accum.current = 0
    }, TRANSITION_MS)
  }, [])

  // --- Is section in the lock zone? ---
  const inZone = useCallback(() => {
    const el = sectionRef.current
    if (!el) return false
    const rect = el.getBoundingClientRect()
    // Section top is near the viewport top and section fills most of the screen
    return rect.top < 200 && rect.top > -200 && rect.bottom > window.innerHeight * 0.4
  }, [])

  // --- Process a scroll delta (works for both wheel and touch) ---
  const processDelta = useCallback((delta: number, threshold: number) => {
    const scrollingDown = delta > 0

    if (!locked.current) {
      if (!inZone()) return false
      // Section is in view -> lock it
      // If scrolling down, start at feature 0. If scrolling up, start at last feature.
      lock(scrollingDown ? 0 : NUM_FEATURES - 1)
      return true
    }

    // Locked: accumulate
    if (transitioning.current) return true

    accum.current += delta

    if (Math.abs(accum.current) >= threshold) {
      const dir = accum.current > 0 ? 1 : -1
      const next = feat.current + dir

      if (next >= 0 && next < NUM_FEATURES) {
        step(next, dir)
      } else {
        unlock(dir)
      }
    }

    return true // consumed
  }, [inZone, lock, unlock, step])

  // --- Event listeners ---
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const consumed = processDelta(e.deltaY, WHEEL_THRESHOLD)
      if (consumed) e.preventDefault()
    }

    let touchStartY = 0
    let touchPrevY = 0

    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY
      touchPrevY = touchStartY
      // If locked, prevent default right away
      if (locked.current) e.preventDefault()
    }

    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY
      const inc = touchPrevY - y
      touchPrevY = y

      if (!locked.current) {
        // Use total delta to decide direction for lock
        const totalDelta = touchStartY - y
        if (Math.abs(totalDelta) > 5) {
          const consumed = processDelta(totalDelta > 0 ? TOUCH_THRESHOLD + 1 : -(TOUCH_THRESHOLD + 1), TOUCH_THRESHOLD)
          if (consumed) {
            e.preventDefault()
            accum.current = 0 // reset after initial lock
          }
        }
        return
      }

      e.preventDefault()
      if (transitioning.current) return

      accum.current += inc

      if (Math.abs(accum.current) >= TOUCH_THRESHOLD) {
        const dir = accum.current > 0 ? 1 : -1
        const next = feat.current + dir

        if (next >= 0 && next < NUM_FEATURES) {
          step(next, dir)
        } else {
          unlock(dir)
        }
      }
    }

    function onTouchEnd() {
      accum.current = 0
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!locked.current || transitioning.current) return

      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        const next = feat.current + 1
        if (next < NUM_FEATURES) step(next, 1)
        else unlock(1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = feat.current - 1
        if (prev >= 0) step(prev, -1)
        else unlock(-1)
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: false })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("keydown", onKeyDown)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [processDelta, step, unlock])

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = "" }
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
          "max-md:h-auto max-md:w-full max-md:flex-none max-md:min-h-[180px] max-md:mt-4"
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
              if (idx !== currentFeature && !transitioning.current) {
                step(idx, idx > currentFeature ? 1 : -1)
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
