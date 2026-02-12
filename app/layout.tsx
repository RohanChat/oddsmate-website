import type { Metadata, Viewport } from 'next'
import { Victor_Mono } from 'next/font/google'

import './globals.css'

const victorMono = Victor_Mono({
  subsets: ['latin'],
  variable: '--font-victor-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ODDS/MATE - Prediction Market Terminal',
  description: 'Your AI mate to help you start winning in prediction markets.',
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
    <html lang="en" className={victorMono.variable}>
      <body className="font-sans antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
