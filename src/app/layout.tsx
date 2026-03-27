import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lead Matrix – Stop Losing Leads to Faster Competitors',
  description:
    'The complete AI-powered automation platform for HVAC, plumbing, and electrical contractors. Respond in 60 seconds. Book more jobs. Automatically.',
  metadataBase: new URL('https://leadmatrixllc.us'),
  openGraph: {
    title: 'Lead Matrix – Stop Losing Leads to Faster Competitors',
    description:
      'AI-powered lead capture & booking automation for home service contractors. Respond in 60 seconds, 24/7.',
    url: 'https://leadmatrixllc.us',
    siteName: 'Lead Matrix',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lead Matrix – Stop Losing Leads to Faster Competitors',
    description:
      'AI-powered lead capture & booking automation for home service contractors.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full flex flex-col bg-[#0A0E27] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
