import type { Metadata, Viewport } from 'next'
import { Victor_Mono } from 'next/font/google'

import './globals.css'

const victorMono = Victor_Mono({
  subsets: ['latin'],
  variable: '--font-victor-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ODDS/MATE. The Bloomberg Terminal for Predictions.',
  description: 'A conversational AI for prediction markets and sports betting.',
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
