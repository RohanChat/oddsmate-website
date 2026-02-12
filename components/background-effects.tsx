"use client"

import { useEffect, useRef } from "react"

export function BackgroundEffects() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!orbRef.current) return
      orbRef.current.style.background = `radial-gradient(
        600px circle at ${e.clientX}px ${e.clientY}px,
        rgba(156,132,163,0.20) 0%,
        rgba(156,132,163,0.08) 25%,
        rgba(89,45,74,0.04) 50%,
        transparent 70%
      )`
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      {/* Static gradient backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(156,132,163,0.12) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(89,45,74,0.09) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(156,132,163,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Interactive gradient orb that follows cursor */}
      <div
        ref={orbRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{ opacity: 0 }}
        onMouseEnter={() => {
          if (orbRef.current) orbRef.current.style.opacity = "1"
        }}
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156,132,163,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156,132,163,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </>
  )
}
