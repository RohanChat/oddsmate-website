"use client"

export function WaitlistSection() {
  return (
    <section
      id="waitlistSection"
      className="py-[100px] px-6 text-center relative z-[1] max-md:py-8 max-md:pt-16 max-md:px-3"
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
          {/* Viral Loops Embed Form - always visible, constrained */}
          <div
            className="w-full overflow-hidden [&>*]:max-w-full max-md:text-[0.8rem]"
            style={{ maxWidth: "100%" }}
            dangerouslySetInnerHTML={{
              __html: `<form-widget ucid="ArwbyWM6Vu8sn8nmtKOoxV1swp4" style="max-width:100%;width:100%;font-size:inherit;"></form-widget>`,
            }}
          />
        </div>
      </div>


    </section>
  )
}
