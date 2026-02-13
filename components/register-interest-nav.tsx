"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function RegisterInterestNav() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const openPopup = useCallback(() => {
    window.dispatchEvent(new CustomEvent("oddsmate:open-popup"))
  }, [])

  const logoSrc = isMobile
    ? "/images/oddsmate-icon.png"
    : "/images/oddsmate-logo.png"
  const logoWidth = isMobile ? 48 : 180
  const logoHeight = isMobile ? 48 : 40

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between"
      style={{
        padding: "10px clamp(16px, 4vw, 40px)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px) saturate(1.4)",
        WebkitBackdropFilter: "blur(40px) saturate(1.4)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <Link href="/" className="flex-shrink-0">
        <Image
          src={logoSrc}
          alt="ODDS/MATE - Go Home"
          width={420}
          height={230}
          priority
          className="object-contain"
          style={{
            width: `${logoWidth}px`,
            height: `${logoHeight}px`,
            filter: "brightness(0.92)",
          }}
        />
      </Link>

      <button
        onClick={openPopup}
        className={cn(
          "font-sans tracking-[0.06em] uppercase cursor-pointer rounded-full border font-bold whitespace-nowrap",
          "bg-primary/20 border-primary/50 text-foreground hover:bg-primary/30 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(156,132,163,0.35)] transition-all duration-300",
          isMobile
            ? "text-[0.65rem] px-3.5 py-1.5"
            : "text-[0.85rem] px-7 py-2.5"
        )}
      >
        Get Access
      </button>
    </nav>
  )
}
