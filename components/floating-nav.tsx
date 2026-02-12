"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function FloatingNav() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    function updateNav() {
      const hero = document.getElementById("heroSection")
      if (!hero) return
      const heroRect = hero.getBoundingClientRect()
      const heroHeight = hero.offsetHeight
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
      window.removeEventListener("resize", checkMobile)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrolled = scrollProgress > 0.3
  const isHero = !scrolled

  const openPopup = useCallback(() => {
    window.dispatchEvent(new CustomEvent("oddsmate:open-popup"))
  }, [])

  const heroLogoWidth = isMobile ? 150 : 240
  const scrolledLogoWidth = isMobile ? 48 : 180
  const logoWidth =
    heroLogoWidth - scrollProgress * (heroLogoWidth - scrolledLogoWidth)

  const heroAspect = 0.55
  const scrolledAspect = isMobile ? 1 : 0.22
  const aspect = heroAspect - scrollProgress * (heroAspect - scrolledAspect)
  const logoHeight = logoWidth * aspect

  const heroLogo = "/images/oddsmate-logo-overlay.png"
  const scrolledDesktopLogo = "/images/oddsmate-logo.png"
  const scrolledMobileLogo = "/images/oddsmate-icon.png"

  const currentLogo = isHero
    ? heroLogo
    : isMobile
      ? scrolledMobileLogo
      : scrolledDesktopLogo

  const navPy = scrolled ? 10 : 32 - scrollProgress * 22

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] flex items-center transition-all duration-500",
        scrolled ? "justify-between" : "justify-center"
      )}
      style={{
        padding: `${navPy}px clamp(16px, 4vw, 40px)`,
        transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        ...(scrolled
          ? {
              background: "rgba(217,215,215,0.7)",
              backdropFilter: "blur(40px) saturate(1.4)",
              WebkitBackdropFilter: "blur(40px) saturate(1.4)",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 4px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
            }
          : {}),
      }}
    >
      {/* Logo */}
      <div
        className="flex-shrink-0 transition-all duration-500"
        style={{
          width: `${logoWidth}px`,
          height: `${logoHeight}px`,
          transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Image
          src={currentLogo}
          alt="ODDS/MATE"
          width={420}
          height={230}
          priority
          className="w-full h-full object-contain transition-opacity duration-300"
        />
      </div>

      {/* CTA button */}
      <button
        onClick={openPopup}
        className={cn(
          "font-sans tracking-[0.06em] uppercase cursor-pointer transition-all duration-500 rounded-full border font-bold whitespace-nowrap",
          scrolled
            ? cn(
                "opacity-100 translate-x-0 pointer-events-auto bg-primary/20 border-primary/50 text-foreground hover:bg-primary/30 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(156,132,163,0.25)]",
                isMobile
                  ? "text-[0.65rem] px-3.5 py-1.5"
                  : "text-[0.85rem] px-7 py-2.5"
              )
            : "opacity-0 translate-x-2.5 pointer-events-none absolute right-10 max-md:right-4 text-[0.85rem] px-7 py-2.5 bg-transparent border-transparent text-foreground"
        )}
      >
        Get Access
      </button>
    </nav>
  )
}
