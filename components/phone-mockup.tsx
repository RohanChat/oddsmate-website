"use client"

import { ChevronLeft, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

const screens = [
  {
    inputText: "Search any market...",
    messages: [
      { type: "user", text: "What are the odds on Lakers winning tonight?" },
      { type: "ai", text: "Checking 6 books..." },
      {
        type: "data",
        header: "Best Lines -- Lakers ML",
        rows: [
          { label: "FanDuel", value: "-145", variant: "up" as const },
          { label: "DraftKings", value: "-150", variant: "neutral" as const },
          { label: "BetMGM", value: "-148", variant: "neutral" as const },
          { label: "Caesars", value: "-152", variant: "neutral" as const },
        ],
      },
      {
        type: "ai",
        text: "FanDuel has the best line. Want me to set an alert if it moves?",
      },
    ],
  },
  {
    inputText: "Add to watchlist...",
    messages: [
      {
        type: "ai",
        text: 'ALERT: $250k just hit YES on "Fed cuts rates in March"',
      },
      { type: "ai", text: "Line moved from 62% to 68% in 3 minutes" },
      {
        type: "data",
        header: "Volume Spike Detected",
        rows: [
          { label: "Last Hour Volume", value: "340%", variant: "up" as const },
          { label: "Avg Position Size", value: "$48k", variant: "up" as const },
          { label: "Sentiment Shift", value: "Bullish", variant: "up" as const },
        ],
      },
      {
        type: "ai",
        text: "This looks like informed flow. Your watchlist position is up 12%.",
      },
    ],
  },
  {
    inputText: "Execute trade for 500 USDC...",
    messages: [
      { type: "user", text: "Execute the arb we discussed" },
      { type: "ai", text: "Executing cross-exchange arbitrage..." },
      {
        type: "data",
        header: "Trade Executed",
        rows: [
          {
            label: "Polymarket (YES)",
            value: "500 USDC @ 48c",
            variant: "neutral" as const,
          },
          {
            label: "Kalshi (NO)",
            value: "500 USDC @ 54c",
            variant: "neutral" as const,
          },
          {
            label: "Profit Locked",
            value: "+$12.00",
            variant: "up" as const,
            highlight: true,
          },
        ],
      },
      {
        type: "ai",
        text: "Trade confirmed. Positions synced to your portfolio.",
      },
    ],
  },
]

interface PhoneMockupProps {
  activeScreen: number
}

export function PhoneMockup({ activeScreen }: PhoneMockupProps) {
  return (
    <div className="flex justify-center items-center relative">
      <div
        className="w-[360px] h-[660px] flex flex-col overflow-hidden relative max-md:w-[220px] max-md:h-[380px]"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "36px",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Phone Header */}
        <div
          className="grid items-center text-[0.78rem] max-md:text-[0.55rem] min-h-[48px] max-md:min-h-[32px]"
          style={{
            gridTemplateColumns: "40px 1fr 40px",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center text-primary">
            <ChevronLeft className="w-[18px] h-[18px] max-md:w-[12px] max-md:h-[12px] text-primary" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <div className="font-bold text-[#eee] text-[0.82rem] max-md:text-[0.6rem] tracking-[-0.02em]">
              ODDS/MATE
            </div>
            <div className="text-[0.62rem] max-md:text-[0.42rem] text-foreground/35 mt-0.5 flex items-center justify-center gap-1">
              <span
                className="w-[5px] h-[5px] max-md:w-[3px] max-md:h-[3px] rounded-full inline-block"
                style={{
                  background: "#27ae60",
                  boxShadow: "0 0 6px #27ae60",
                }}
              />
              online
            </div>
          </div>
          <div className="w-10 max-md:w-5" />
        </div>

        {/* Phone Body */}
        <div className="flex-1 relative overflow-hidden">
          {screens.map((screen, screenIdx) => (
            <div
              key={screenIdx}
              className={cn(
                "absolute inset-0 p-[18px] max-md:p-[8px] flex flex-col gap-3.5 max-md:gap-1.5 text-[0.82rem] max-md:text-[0.55rem] overflow-y-auto no-scrollbar transition-all duration-500",
                screenIdx === activeScreen
                  ? "opacity-100 translate-x-0"
                  : screenIdx < activeScreen
                    ? "opacity-0 -translate-x-[50px]"
                    : "opacity-0 translate-x-[50px]"
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {screen.messages.map((msg, msgIdx) => {
                if (msg.type === "user") {
                  return (
                    <div
                      key={msgIdx}
                      className="self-end max-w-[88%] px-4 py-3 max-md:px-2.5 max-md:py-1.5 rounded-2xl max-md:rounded-xl leading-relaxed max-md:leading-snug"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "#eee",
                        borderBottomRightRadius: "4px",
                      }}
                    >
                      {msg.text}
                    </div>
                  )
                }
                if (msg.type === "ai") {
                  return (
                    <div
                      key={msgIdx}
                      className="self-start max-w-[88%] px-4 py-3 max-md:px-2.5 max-md:py-1.5 rounded-2xl max-md:rounded-xl leading-relaxed max-md:leading-snug text-foreground"
                      style={{
                        background: "hsl(var(--accent))",
                        borderBottomLeftRadius: "4px",
                      }}
                    >
                      {msg.text}
                    </div>
                  )
                }
                if (msg.type === "data" && "header" in msg) {
                  return (
                    <div
                      key={msgIdx}
                      className="self-start w-full overflow-hidden rounded-2xl max-md:rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(156,132,163,0.2)",
                        borderBottomLeftRadius: "4px",
                      }}
                    >
                      <div
                        className="px-3.5 py-2 max-md:px-2 max-md:py-1 text-[0.68rem] max-md:text-[0.45rem] text-primary font-bold uppercase tracking-[1px]"
                        style={{
                          background: "rgba(156,132,163,0.1)",
                          borderBottom: "1px solid rgba(156,132,163,0.1)",
                        }}
                      >
                        {msg.header}
                      </div>
                      {msg.rows?.map(
                        (
                          row: {
                            label: string
                            value: string
                            variant: "up" | "neutral"
                            highlight?: boolean
                          },
                          rowIdx: number
                        ) => (
                          <div
                            key={rowIdx}
                            className={cn(
                              "flex justify-between px-3.5 py-2.5 max-md:px-2 max-md:py-1 text-[0.78rem] max-md:text-[0.5rem]",
                              row.highlight && "bg-[rgba(39,174,96,0.08)]"
                            )}
                            style={{
                              borderBottom:
                                rowIdx < (msg.rows?.length ?? 0) - 1
                                  ? "1px solid rgba(255,255,255,0.04)"
                                  : "none",
                            }}
                          >
                            <span
                              className={cn(
                                row.highlight
                                  ? "font-semibold text-[#2ecc71]"
                                  : "text-[#ddd]"
                              )}
                            >
                              {row.label}
                            </span>
                            <span
                              className={cn(
                                row.variant === "up"
                                  ? "text-[#27ae60] font-semibold"
                                  : "text-foreground/50"
                              )}
                            >
                              {row.value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}
        </div>

        {/* Phone Input */}
        <div
          className="flex gap-2.5 max-md:gap-1.5 items-center"
          style={{
            padding: "14px 16px",
            background: "rgba(255,255,255,0.04)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="flex-1 h-9 max-md:h-6 rounded-full flex items-center pl-3.5 max-md:pl-2 text-[0.72rem] max-md:text-[0.45rem] text-foreground/30"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {screens[activeScreen]?.inputText ?? "Type a message..."}
          </div>
          <div className="w-9 h-9 max-md:w-6 max-md:h-6 rounded-full flex items-center justify-center text-foreground flex-shrink-0 bg-accent">
            <ArrowUp className="w-3.5 h-3.5 max-md:w-2.5 max-md:h-2.5" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
