"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function FloatingNav() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function updateNav() {
      const hero = document.getElementById("heroSection")
      if (!hero) return
      const heroRect = hero.getBoundingClientRect()
      const heroHeight = hero.offsetHeight
      // 0 = at top, 1 = hero scrolled past
      const progress = Math.min(
        1,
        Math.max(0, -heroRect.top / (heroHeight * 0.4))
      )
      setScrollProgress(progress)
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateNav)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateNav()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrolled = scrollProgress > 0.3

  function scrollToWaitlist() {
    document.body.style.overflow = ""
    setTimeout(() => {
      document
        .getElementById("waitlistSection")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  // Interpolate logo size: starts at 280px wide, shrinks to 120px
  const isMobileish = typeof window !== "undefined" && window.innerWidth < 768
  const startWidth = isMobileish ? 200 : 280
  const endWidth = isMobileish ? 100 : 120
  const logoWidth = startWidth - scrollProgress * (startWidth - endWidth)
  const logoHeight = logoWidth * 0.22 // maintain aspect ratio

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] flex items-center transition-colors duration-500",
        scrolled
          ? "justify-between border-b border-foreground/[0.06]"
          : "justify-center"
      )}
      style={{
        padding: scrolled
          ? "12px clamp(20px, 5vw, 40px)"
          : `${32 - scrollProgress * 20}px clamp(20px, 5vw, 40px)`,
        transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        ...(scrolled
          ? {
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }
          : {}),
      }}
    >
      {/* Logo image */}
      <div
        className="transition-none flex-shrink-0"
        style={{
          width: `${logoWidth}px`,
          height: `${logoHeight}px`,
        }}
      >
        <Image
          src="/images/oddsmate-logo.png"
          alt="ODDS/MATE"
          width={280}
          height={62}
          priority
          className="w-full h-full object-contain"
          style={{ filter: "brightness(0.9)" }}
        />
      </div>

      {/* CTA button */}
      <button
        onClick={scrollToWaitlist}
        className={cn(
          "font-sans text-[0.85rem] font-bold tracking-[0.05em] uppercase cursor-pointer transition-all duration-300 rounded-full border",
          scrolled
            ? "opacity-100 translate-x-0 pointer-events-auto px-6 py-2.5 bg-primary/20 border-primary/40 text-foreground hover:bg-primary/30 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(156,132,163,0.3)]"
            : "opacity-0 translate-x-2.5 pointer-events-none absolute right-10 max-md:right-5 px-6 py-2.5 bg-transparent border-transparent text-foreground"
        )}
      >
        Get Access
      </button>
    </nav>
  )
}
