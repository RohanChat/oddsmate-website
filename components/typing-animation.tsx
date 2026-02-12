"use client"

import { useEffect, useState, useCallback } from "react"

const phrases = [
  "find arbitrage in election markets",
  "scan for NBA parlay discrepancies",
  "analyze Fed Rate implied odds",
  "what is the spread on Trump/Biden?",
]

export function TypingAnimation() {
  const [displayText, setDisplayText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex]

    if (isWaiting) return

    if (isDeleting) {
      setDisplayText((prev) => prev.slice(0, -1))
      if (displayText.length <= 1) {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }
    } else {
      const nextLength = displayText.length + 1
      setDisplayText(currentPhrase.substring(0, nextLength))
      if (nextLength === currentPhrase.length) {
        setIsWaiting(true)
        setTimeout(() => {
          setIsWaiting(false)
          setIsDeleting(true)
        }, 2000)
      }
    }
  }, [displayText, phraseIndex, isDeleting, isWaiting])

  useEffect(() => {
    const speed = isDeleting ? 25 : Math.random() * 45 + 55
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <div
      className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.15] font-medium tracking-[-0.04em] h-[3.45em] max-md:h-[4.6em] flex items-end"
    >
      <div>
        <span className="text-primary/55">{"Hi mate, "}</span>
        <span className="text-foreground">{displayText}</span>
        <span
          className="inline-block w-3 bg-primary rounded-sm opacity-70 animate-blink align-baseline relative top-[0.08em] ml-1"
          style={{ height: "0.85em" }}
        />
      </div>
    </div>
  )
}
