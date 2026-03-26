"use client"

import { useState } from "react"

export function WaitlistSection() {
  const [agreed, setAgreed] = useState(false)

  return (
    <section
      id="waitlistSection"
      className="py-[100px] px-6 text-center relative z-[1] max-md:py-8 max-md:pt-8 max-md:px-3"
    >
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-1.5px] mb-3 leading-[1.1] max-md:text-[1.5rem] max-md:mb-2 uppercase" style={{ color: '#9c84a3' }}>
          Early Access
        </h2>
        <p className="text-[1.05rem] leading-relaxed text-muted-foreground mb-8 max-md:mb-3 max-md:text-[0.8rem] max-md:leading-normal">
          {"Join the waitlist for a chance to win $1K. Yes, really."}
        </p>

        <div
          className="rounded-2xl p-6 max-md:p-2.5 max-md:rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* Consent checkbox */}
          <label className="flex items-start gap-3 mb-5 text-left cursor-pointer select-none group">
            <div className="relative flex-shrink-0 mt-[2px]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
                aria-label="I agree to receive notifications, texts, and emails from ODDSMATE"
              />
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150"
                style={{
                  background: agreed ? "#9c84a3" : "rgba(255,255,255,0.07)",
                  border: agreed ? "1.5px solid #9c84a3" : "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                {agreed && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[0.82rem] leading-relaxed text-muted-foreground max-md:text-[0.75rem]">
              I agree to receive notifications, texts, and emails from ODDSMATE regarding my waitlist status, product updates, and promotional offers. Message and data rates may apply.
            </span>
          </label>

          {/* Viral Loops Embed Form — wrapped in a container that blocks interaction until agreed */}
          <div className="relative">
            <div
              className="w-full overflow-hidden [&>*]:max-w-full max-md:text-[0.8rem]"
              style={{ maxWidth: "100%" }}
              dangerouslySetInnerHTML={{
                __html: `<form-widget ucid="ArwbyWM6Vu8sn8nmtKOoxV1swp4" style="max-width:100%;width:100%;font-size:inherit;"></form-widget>`,
              }}
            />
            {/* Overlay that blocks the form until the checkbox is checked */}
            {!agreed && (
              <div
                className="absolute inset-0 rounded-lg cursor-not-allowed"
                style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(1px)" }}
                aria-hidden="true"
                title="Please agree to the terms above before submitting"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
