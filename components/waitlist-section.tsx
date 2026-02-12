"use client"

export function WaitlistSection() {
  return (
    <section
      id="waitlistSection"
      className="py-[120px] px-10 text-center relative z-[1] max-md:py-16 max-md:px-4"
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
        <p className="text-[1.05rem] leading-relaxed text-muted-foreground mb-12 max-md:mb-8 max-md:text-[0.95rem]">
          Join the waitlist for priority access to your personal prediction
          market AI mate.
        </p>

        <div
          className="rounded-3xl p-10 max-md:p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* Viral Loops Embed Form - always visible */}
          <div
            dangerouslySetInnerHTML={{
              __html: `<form-widget ucid="ArwbyWM6Vu8sn8nmtKOoxV1swp4"></form-widget>`,
            }}
          />
        </div>
      </div>


    </section>
  )
}
