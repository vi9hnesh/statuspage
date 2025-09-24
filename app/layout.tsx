import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Status Pages',
  },
  description: 'Real-time status monitoring and system performance tracking. Stay informed about service availability and incidents.',
  generator: 'Warrn Status Pages',
  keywords: ['status page', 'uptime monitoring', 'system status', 'service health'],
  authors: [{ name: 'Warrn', url: 'https://warrn.io' }],
  creator: 'Warrn',
  publisher: 'Warrn',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Warrn Status Pages',
  },
  twitter: {
    card: 'summary',
    creator: '@warrn',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn
      }}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en">
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
