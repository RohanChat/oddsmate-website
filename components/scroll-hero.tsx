"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Image from "next/image"

/* ── curve generators ── */
function genCurve(
  startY: number,
  shapeFn: (t: number) => number,
  noiseAmt: number,
  seed: number,
  N: number
): [number, number][] {
  const pts: [number, number][] = []
  let y = startY
  let s = seed
  function r() {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const target = shapeFn(t)
    const n1 = (r() - 0.5) * noiseAmt
    const n2 = (r() - 0.5) * noiseAmt * 0.6
    const sharp = r() < 0.04 ? (r() - 0.5) * noiseAmt * 2.5 : 0
    const pull = (target - y) * 0.05
    y += n1 + n2 + sharp + pull
    y = Math.max(0.03, Math.min(0.97, y))
    pts.push([t, y])
  }
  return pts
}

function shapeA(t: number) {
  if (t < 0.1) return 0.44
  if (t < 0.18) return 0.48
  if (t < 0.25) return 0.4
  if (t < 0.32) return 0.5
  if (t < 0.38) return 0.42
  if (t < 0.46) return 0.36
  if (t < 0.54) return 0.55
  if (t < 0.6) return 0.65
  if (t < 0.66) return 0.72
  if (t < 0.72) return 0.8
  if (t < 0.8) return 0.87
  if (t < 0.88) return 0.92
  return 0.94
}
function shapeB(t: number) {
  if (t < 0.08) return 0.38
  if (t < 0.14) return 0.42
  if (t < 0.2) return 0.5
  if (t < 0.26) return 0.44
  if (t < 0.32) return 0.38
  if (t < 0.38) return 0.42
  if (t < 0.46) return 0.35
  if (t < 0.54) return 0.3
  if (t < 0.62) return 0.25
  if (t < 0.7) return 0.22
  if (t < 0.78) return 0.18
  if (t < 0.86) return 0.15
  return 0.12
}

/* ── constants ── */
const GW = 2400
const GH = 400
const PAD = 15
const CP_X = 0.46

/* Number of virtual "screens" of scroll */
const NUM_PHASES = 9

const WORDS_RAW: { t?: string; br?: boolean; big?: boolean; white?: boolean; transparent?: boolean }[] = [
  { t: "Prediction" },
  { t: "markets" },
  { t: "are" },
  { t: "rigged" },
  { t: "against" },
  { t: "us." },
  { t: "We're " },
  { t: "fighting " },
  { t: "insiders," },
  { t: "whales," },
  { t: "and" },
  { t: "constantly" },
  { t: "changing" },
  { t: "information..." },
  { t: "we're" },
  { t: "almost" },
  { t: "doomed" },
  { t: "to" },
  { t: "lose." },
  { br: true },
  { t: "Until", big: true, white: true, transparent: true },
  { t: "now.", big: true, white: true, transparent: true },
]

interface MsgDef {
  phase: "pre" | "sticky"
  type: "user" | "typing" | "ai" | "ai-data"
  text?: string
  label?: string
  rows?: { l: string; v: string; c: string }[]
  preAt?: number
  at?: number
  collapseInSticky?: number
}

const MSGS: MsgDef[] = [
  {
    phase: "pre",
    type: "user",
    text: "Best odds on Lakers making the playoffs? Advise.",
    preAt: 0.35,
  },
  { phase: "pre", type: "typing", preAt: 0.55, collapseInSticky: 0.18 },
  {
    phase: "sticky",
    type: "ai",
    label: "ODDS/MATE",
    text: "Lakers playoffs at historic lows. Sharps are loading YES:",
    at: 0.18,
  },
  {
    phase: "sticky",
    type: "ai-data",
    label: "LIVE ANALYSIS",
    rows: [
      { l: "Best Price", v: "22\u00A2 (Polymarket)", c: "green" },
      { l: "Sharp Money", v: "68% buying YES", c: "green" },
      { l: "Historical", v: "31% make playoffs from here", c: "white" },
    ],
    text: "4.5:1 on a 3:1 historical shot. I\u2019d buy.",
    at: 0.52,
  },
]

/* ── helpers ── */
function toPath(pts: [number, number][], count: number) {
  if (count < 2) return ""
  let d = ""
  for (let i = 0; i < count && i < pts.length; i++) {
    const x = pts[i][0] * GW
    const y = GH - PAD - pts[i][1] * (GH - PAD * 2)
    d += i === 0 ? `M${x},${y}` : `L${x},${y}`
  }
  return d
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

/* ── component ── */
export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const graphLayerRef = useRef<HTMLDivElement>(null)
  const introLayerRef = useRef<HTMLDivElement>(null)
  const msgAreaRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const lineARef = useRef<SVGPathElement>(null)
  const lineBRef = useRef<SVGPathElement>(null)
  const areaPRef = useRef<SVGPathElement>(null)
  const dotGRef = useRef<SVGGElement>(null)
  const tickerYesRef = useRef<HTMLDivElement>(null)
  const tickerNoRef = useRef<HTMLDivElement>(null)
  const graphSvgRef = useRef<SVGSVGElement>(null)

  const wordRefs = useRef<HTMLSpanElement[]>([])
  const msgElRefs = useRef<HTMLDivElement[]>([])

  const curveARef = useRef(genCurve(0.44, shapeA, 0.025, 42, 1200))
  const curveBRef = useRef(genCurve(0.38, shapeB, 0.02, 137, 1200))

  const [isMobile, setIsMobile] = useState(false)

  const update = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const vh = window.innerHeight
    const containerH = container.offsetHeight
    const scrolled = -rect.top
    const scrollableRange = containerH - vh

    if (scrolled < 0 || scrolled > scrollableRange) return

    /* master progress 0..1 */
    const progress = clamp01(scrolled / scrollableRange)

    /*
     * Phase mapping (using progress 0..1 across NUM_PHASES screens):
     * 0.000 - 0.175  => Text reveal (phases 0-1.4)
     * 0.175 - 0.225  => Hold text
     * 0.225 - 0.500  => Graph pre + messages appear (phases 1.8-4)
     * 0.500 - 0.700  => Sticky messages + graph continues (phases 4-5.6)
     * 0.700 - 0.850  => Graph post (phases 5.6-6.8)
     * 0.850 - 1.000  => Intro layer (phases 6.8-8)
     */

    /* ─── TEXT REVEAL ─── */
    const textProgress = clamp01(progress / 0.175)
    const words = wordRefs.current
    for (let i = 0; i < words.length; i++) {
      if (!words[i]) continue
      const pos = i / words.length
      words[i].classList.remove("sh-on", "sh-on-white")
      if (pos < textProgress) {
        const meta = WORDS_RAW.filter((w) => !w.br)[i]
        words[i].classList.add(meta?.white ? "sh-on-white" : "sh-on")
      }
    }

    /* scroll cue fade */
    if (scrollCueRef.current)
      scrollCueRef.current.style.opacity = String(clamp01(1 - textProgress * 4))

    /* ─── TEXT → GRAPH CROSSFADE ─── */
    const gFade = clamp01((progress - 0.18) / 0.08)
    if (textLayerRef.current) {
      textLayerRef.current.style.opacity = String(clamp01(1 - gFade * 2.5))
      textLayerRef.current.style.transform = `translateY(${-clamp01(gFade) * 40}px)`
      textLayerRef.current.style.pointerEvents = gFade > 0.3 ? "none" : "auto"
    }
    if (graphLayerRef.current)
      graphLayerRef.current.style.opacity = String(clamp01(gFade * 2))

    /* ─── GRAPH DRAW ─── */
    let draw = 0
    if (progress < 0.225) draw = 0
    else if (progress < 0.5)
      draw = ((progress - 0.225) / 0.275) * CP_X
    else if (progress < 0.7) draw = CP_X
    else if (progress < 0.85)
      draw = CP_X + ((progress - 0.7) / 0.15) * (1 - CP_X)
    else draw = 1
    draw = clamp01(draw)

    const curveA = curveARef.current
    const curveB = curveBRef.current
    const visA = Math.floor(curveA.length * draw)
    const visB = Math.floor(curveB.length * draw * 0.95)

    lineARef.current?.setAttribute("d", toPath(curveA, visA))
    lineBRef.current?.setAttribute("d", toPath(curveB, visB))

    if (visA > 1) {
      const last = curveA[visA - 1]
      areaPRef.current?.setAttribute(
        "d",
        toPath(curveA, visA) +
        `L${last[0] * GW},${GH - PAD}L${curveA[0][0] * GW},${GH - PAD}Z`
      )
    } else {
      areaPRef.current?.setAttribute("d", "")
    }

    /* ─── DOT + TICKERS ─── */
    if (visA > 0 && draw > 0.003) {
      const ptA = curveA[visA - 1]
      const cx = ptA[0] * GW
      const cy = GH - PAD - ptA[1] * (GH - PAD * 2)
      if (dotGRef.current) {
        dotGRef.current.innerHTML = `<circle cx="${cx}" cy="${cy}" r="18" fill="url(#sh-dG)"/>
          <circle cx="${cx}" cy="${cy}" r="2.5" fill="#9c84a3"/>
          <circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="#9c84a3" stroke-width=".6" stroke-opacity=".25"/>`
      }

      const svgEl = graphSvgRef.current
      const wrapEl = svgEl?.closest("[data-graph-wrap]") as HTMLElement | null
      if (svgEl && wrapEl) {
        const svgRect = svgEl.getBoundingClientRect()
        const wrapRect = wrapEl.getBoundingClientRect()
        const scaleX = svgRect.width / GW
        const scaleY = svgRect.height / GH
        const offTop = svgRect.top - wrapRect.top

        const yL = ptA[0] * GW * scaleX + 12
        const yT = offTop + (GH - PAD - ptA[1] * (GH - PAD * 2)) * scaleY - 10
        if (tickerYesRef.current) {
          tickerYesRef.current.style.left = yL + "px"
          tickerYesRef.current.style.top = yT + "px"
          tickerYesRef.current.classList.add("sh-ticker-visible")
          tickerYesRef.current.textContent = "YES " + (ptA[1] * 100).toFixed(0) + "\u00A2"
        }
        if (visB > 0 && tickerNoRef.current) {
          const ptB = curveB[visB - 1]
          const nL = ptB[0] * GW * scaleX + 12
          const nT = offTop + (GH - PAD - ptB[1] * (GH - PAD * 2)) * scaleY - 10
          tickerNoRef.current.style.left = nL + "px"
          tickerNoRef.current.style.top = nT + "px"
          tickerNoRef.current.classList.add("sh-ticker-visible")
          tickerNoRef.current.textContent = "NO " + (ptB[1] * 100).toFixed(0) + "\u00A2"
        }
      }
    } else {
      if (dotGRef.current) dotGRef.current.innerHTML = ""
      tickerYesRef.current?.classList.remove("sh-ticker-visible")
      tickerNoRef.current?.classList.remove("sh-ticker-visible")
    }

    /* ─── MESSAGES ─── */
    const preProg = clamp01((progress - 0.225) / 0.275) // graph pre range
    const sp = clamp01((progress - 0.5) / 0.2)          // sticky range
    const msgsActive = progress >= 0.28 && progress < 0.88
    if (msgAreaRef.current) msgAreaRef.current.style.opacity = msgsActive ? "1" : "0"

    const msgEls = msgElRefs.current
    MSGS.forEach((m, i) => {
      const el = msgEls[i]
      if (!el) return
      if (m.phase === "pre") {
        if (preProg >= (m.preAt ?? 0) && progress < 0.7) {
          if (m.collapseInSticky !== undefined && sp >= m.collapseInSticky) {
            el.classList.remove("sh-msg-show")
            el.classList.add("sh-msg-collapse")
          } else {
            el.classList.add("sh-msg-show")
            el.classList.remove("sh-msg-collapse")
          }
        } else if (progress >= 0.7) {
          if (m.type === "typing") {
            el.classList.remove("sh-msg-show")
            el.classList.add("sh-msg-collapse")
          } else {
            el.classList.add("sh-msg-show")
            el.classList.remove("sh-msg-collapse")
          }
        } else {
          el.classList.remove("sh-msg-show")
          el.classList.remove("sh-msg-collapse")
        }
      } else if (m.phase === "sticky") {
        if (sp >= (m.at ?? 0)) {
          el.classList.add("sh-msg-show")
          el.classList.remove("sh-msg-collapse")
        } else {
          el.classList.remove("sh-msg-show")
        }
      }
    })

    /* ─── INTRO LAYER ─── */
    /* Fade in: 0.82 → 0.90, hold: 0.90 → 0.96, fade out: 0.96 → 1.0 */
    const introIn = clamp01((progress - 0.82) / 0.08)
    const introOut = clamp01((progress - 0.98) / 0.05)
    const introOpacity = introIn * (1 - introOut)
    const introScale = 1 - introOut * 0.08
    const introBlur = introOut * 12

    if (introLayerRef.current) {
      introLayerRef.current.style.opacity = String(introOpacity)
      introLayerRef.current.style.transform = `translateY(${(1 - introIn) * 60}px) scale(${introScale})`
      introLayerRef.current.style.filter = introBlur > 0 ? `blur(${introBlur}px)` : "none"
    }
    if (introIn > 0 && msgAreaRef.current)
      msgAreaRef.current.style.opacity = String(clamp01(1 - introIn * 1.5))
  }, [])

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()

    let ticking = false
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          ticking = false
          update()
        })
      }
    }
    function onResize() {
      checkMobile()
      update()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [update])

  /* build word elements */
  const wordElements: React.ReactNode[] = []
  let wordIdx = 0
  WORDS_RAW.forEach((w, i) => {
    if (w.br) {
      wordElements.push(<div key={`br-${i}`} className="sh-hw-break" />)
      return
    }
    const idx = wordIdx++
    wordElements.push(
      <span
        key={`w-${i}`}
        ref={(el) => {
          if (el) wordRefs.current[idx] = el
        }}
        className={`sh-hw${w.big ? " sh-hw-big" : ""}${w.transparent ? " sh-hw-transparent" : ""}`}
      >
        {w.t}
      </span>
    )
  })

  /* build message elements */
  const msgElements = MSGS.map((m, i) => {
    if (m.type === "user") {
      return (
        <div
          key={i}
          ref={(el) => {
            if (el) msgElRefs.current[i] = el
          }}
          className="sh-msg sh-msg-user"
        >
          <div className="sh-msg-card">
            <div className="sh-m-text">{m.text}</div>
          </div>
        </div>
      )
    }
    if (m.type === "typing") {
      return (
        <div
          key={i}
          ref={(el) => {
            if (el) msgElRefs.current[i] = el
          }}
          className="sh-msg sh-msg-typing"
        >
          <div className="sh-msg-card">
            <div className="sh-typing-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )
    }
    if (m.type === "ai") {
      return (
        <div
          key={i}
          ref={(el) => {
            if (el) msgElRefs.current[i] = el
          }}
          className="sh-msg sh-msg-ai"
        >
          <div className="sh-msg-card">
            {m.label && <div className="sh-m-label">{m.label}</div>}
            <div className="sh-m-text">{m.text}</div>
          </div>
        </div>
      )
    }
    if (m.type === "ai-data") {
      return (
        <div
          key={i}
          ref={(el) => {
            if (el) msgElRefs.current[i] = el
          }}
          className="sh-msg sh-msg-ai"
        >
          <div className="sh-msg-card">
            <div className="sh-m-label">{m.label}</div>
            <div className="sh-m-data">
              {m.rows?.map((r, ri) => (
                <div key={ri} className="sh-m-row">
                  <span className="sh-label-bold">{r.l}</span>
                  <span className={`sh-val ${r.c === "green" ? "sh-val-green" : "sh-val-white"}`}>
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
            {m.text && (
              <div className="sh-m-verdict">
                {m.text}
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  })

  return (
    <div
      ref={containerRef}
      style={{ height: `${NUM_PHASES * 100}vh` }}
    >
      {/* Sticky pinned viewport - same pattern as FeaturesSection */}
      <section className="sticky top-0 h-screen overflow-hidden">
        {/* Glow orb */}
        <div className="sh-glow-orb" />

        {/* Text layer */}
        <div ref={textLayerRef} className="sh-text-layer">
          <div className="sh-hero-text">{wordElements}</div>
          <div ref={scrollCueRef} className="sh-scroll-cue">
            <span>Scroll to explore</span>
            <div className="sh-cue-bar" />
          </div>
        </div>

        {/* Graph layer */}
        <div ref={graphLayerRef} className="sh-graph-layer" style={{ opacity: 0 }}>
          <div data-graph-wrap className="sh-graph-wrap">
            <svg
              ref={graphSvgRef}
              className="sh-graph-svg"
              viewBox={`0 0 ${GW} ${GH}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sh-gA" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#9c84a3" stopOpacity=".12" />
                  <stop offset="30%" stopColor="#9c84a3" stopOpacity=".6" />
                  <stop offset="100%" stopColor="#9c84a3" stopOpacity=".8" />
                </linearGradient>
                <linearGradient id="sh-gB" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#d9d7d7" stopOpacity=".05" />
                  <stop offset="30%" stopColor="#d9d7d7" stopOpacity=".18" />
                  <stop offset="100%" stopColor="#d9d7d7" stopOpacity=".28" />
                </linearGradient>
                <linearGradient id="sh-aF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9c84a3" stopOpacity=".04" />
                  <stop offset="100%" stopColor="#9c84a3" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="sh-dG">
                  <stop offset="0%" stopColor="#9c84a3" stopOpacity=".55" />
                  <stop offset="30%" stopColor="#9c84a3" stopOpacity=".06" />
                  <stop offset="100%" stopColor="#9c84a3" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path ref={areaPRef} fill="url(#sh-aF)" />
              <path
                ref={lineBRef}
                fill="none"
                stroke="url(#sh-gB)"
                strokeWidth={isMobile ? 2.2 : 1.2}
              />
              <path
                ref={lineARef}
                fill="none"
                stroke="url(#sh-gA)"
                strokeWidth={isMobile ? 3 : 1.8}
              />
              <g ref={dotGRef} />
            </svg>
            <div ref={tickerYesRef} className="sh-ticker sh-ticker-yes">
              YES
            </div>
            <div ref={tickerNoRef} className="sh-ticker sh-ticker-no">
              NO
            </div>
          </div>
        </div>

        {/* Message area */}
        <div ref={msgAreaRef} className="sh-msg-area" style={{ opacity: 0 }}>
          {msgElements}
        </div>

        {/* Intro layer */}
        <div
          ref={introLayerRef}
          className="sh-intro-layer"
          style={{ opacity: 0 }}
        >
          <div className="sh-intro-blur" />
          <div className="sh-intro-content">
            <div className="sh-intro-label">Introducing</div>
            <div className="sh-intro-logo">
              <Image
                src="/images/oddsmate-hero-logo.png"
                alt="ODDS/MATE"
                width={800}
                height={200}
                priority
                className="w-full h-auto max-w-[clamp(240px,45vw,520px)] object-contain"
                style={{ filter: "brightness(1.3) contrast(1.1)" }}
              />
            </div>
            <div className="sh-intro-sub">
              A conversational AI built for prediction markets. Real-time
              odds. Insider-level intelligence.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
