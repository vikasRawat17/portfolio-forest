import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Vikas Singh Rawat — Full-Stack Engineer',
  description:
    'Full-stack engineer at Outbox Labs. Building ColdStats, shipping ReachInbox. Available for senior / mid full-stack roles.',
  keywords: [
    'Vikas Singh Rawat', 'Full-stack engineer', 'MERN developer',
    'Next.js engineer', 'ColdStats', 'ReachInbox', 'Outbox Labs',
    'Bangalore developer', 'TypeScript engineer',
  ],
  openGraph: {
    title: 'Vikas Singh Rawat — Full-Stack Engineer',
    description: 'Full-stack engineer at Outbox Labs. Building ColdStats. Open to opportunities.',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
