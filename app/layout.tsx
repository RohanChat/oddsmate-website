import type { Metadata, Viewport } from 'next'
import { Victor_Mono } from 'next/font/google'

import './globals.css'

const victorMono = Victor_Mono({
  subsets: ['latin'],
  variable: '--font-victor-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  // ✅ Chrome/Safari tab title (<title>)
  title: "ODDS/MATE - The Bloomberg Terminal for Prediction Markets.",

  description: "Your AI mate to help you start winning in prediction markets.",

  // ✅ iMessage / WhatsApp / LinkedIn / Slack share title (og:title)
  openGraph: {
    title: "The Bloomberg Terminal for Prediction Markets.",
    description: "Your AI mate to help you start winning in prediction markets.",
    url: "https://oddsmate.ai",
    siteName: "ODDS/MATE",
    images: [
      {
        url: "https://oddsmate.ai/og-default.png",
        width: 1200,
        height: 630,
        alt: "ODDS/MATE",
      },
    ],
    type: "website",
  },

  // ✅ Twitter/X share title (falls back elsewhere sometimes)
  twitter: {
    card: "summary_large_image",
    title: "The Bloomberg Terminal for Prediction Markets.",
    description: "Your AI built for prediction markets.",
    images: ["https://oddsmate.ai/og-default.png"],
  },
}


export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={victorMono.variable} suppressHydrationWarning>
      <head>
        <script
          type="text/javascript"
          src="https://app.viral-loops.com/widgetsV2/core/loader.js"
          data-campaign-id="ArwbyWM6Vu8sn8nmtKOoxV1swp4"
          id="viral-loops-loader"
          async
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
