"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function updateNav() {
      const hero = document.getElementById("heroSection")
      if (!hero) return
      const heroBottom = hero.getBoundingClientRect().bottom
      setScrolled(heroBottom < 120)
    }

    window.addEventListener("scroll", updateNav, { passive: true })
    updateNav()
    return () => window.removeEventListener("scroll", updateNav)
  }, [])

  function scrollToWaitlist() {
    document.body.classList.remove("scroll-locked")
    setTimeout(() => {
      document
        .getElementById("waitlistSection")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] flex items-center transition-all duration-500",
        scrolled
          ? "justify-between py-4 px-10 max-md:px-5 max-md:py-3 border-b border-foreground/[0.06]"
          : "justify-center py-8 px-10 max-md:py-5 max-md:px-5"
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        ...(scrolled
          ? {
              background: "rgba(10,10,10,0.8)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }
          : {}),
      }}
    >
      {/* Logo text */}
      <div
        className={cn(
          "font-bold tracking-[-0.02em] transition-all duration-500 text-foreground/85",
          scrolled ? "text-lg" : "text-2xl"
        )}
      >
        ODDS/MATE
      </div>

      {/* CTA button */}
      <button
        onClick={scrollToWaitlist}
        className={cn(
          "font-sans text-[0.78rem] font-semibold text-primary border-none bg-transparent cursor-pointer tracking-[0.03em] uppercase transition-all duration-300 hover:text-foreground",
          scrolled
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-2.5 pointer-events-none absolute right-10 max-md:right-5"
        )}
      >
        Get Access
      </button>
    </nav>
  )
}
