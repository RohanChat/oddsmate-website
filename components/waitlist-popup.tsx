"use client"

import { useEffect, useState, useRef } from "react"

export function WaitlistPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true)
    }
    window.addEventListener("oddsmate:open-popup", handleOpen)
    return () => window.removeEventListener("oddsmate:open-popup", handleOpen)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
    >
      {/* Liquid glass backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(10, 10, 10, 0.7)",
          backdropFilter: "blur(30px) saturate(1.3)",
          WebkitBackdropFilter: "blur(30px) saturate(1.3)",
        }}
      />

      {/* Modal card */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[520px] mx-6 rounded-3xl p-10 max-md:p-5 max-md:mx-4 max-md:max-w-[calc(100vw-32px)] animate-in fade-in zoom-in-95 duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(40px) saturate(1.4)",
          WebkitBackdropFilter: "blur(40px) saturate(1.4)",
          boxShadow:
            "0 8px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="text-center mb-1">
          <h2 className="text-[1.4rem] font-bold tracking-[1px] uppercase text-primary max-md:text-[1.3rem]">
            Early Access
          </h2>
        </div>

        {/* Viral Loops Embed Form */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<form-widget ucid="ArwbyWM6Vu8sn8nmtKOoxV1swp4"></form-widget>`,
          }}
        />
      </div>
    </div>
  )
}
