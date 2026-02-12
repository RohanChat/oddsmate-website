"use client"

import { useState } from "react"

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section
      id="waitlistSection"
      className="py-[120px] px-10 text-center relative z-[1] max-md:py-20 max-md:px-5"
    >
      <div className="max-w-[600px] mx-auto">
        <div className="text-[0.75rem] font-bold tracking-[2px] uppercase text-primary mb-4">
          Early Access
        </div>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-1.5px] text-foreground mb-4 leading-[1.1]">
          {"Get your edge"}
          <br />
          {"before everyone else"}
        </h2>
        <p className="text-[1.05rem] leading-relaxed text-muted-foreground mb-12">
          Join the waitlist for priority access to your personal prediction
          market AI mate.
        </p>

        <div
          className="rounded-3xl p-10 max-md:p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {submitted ? (
            <div className="py-8">
              <div className="text-2xl font-semibold text-foreground mb-3">
                {"You're on the list"}
              </div>
              <p className="text-muted-foreground text-sm">
                {"We'll be in touch when it's your turn."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-12 rounded-full px-6 text-sm font-sans text-foreground placeholder:text-foreground/30 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                type="submit"
                className="w-full h-12 rounded-full text-sm font-semibold font-sans text-foreground bg-accent border border-primary/30 cursor-pointer transition-all duration-300 hover:bg-primary hover:border-primary hover:shadow-[0_8px_30px_rgba(156,132,163,0.4)]"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
