import type { Metadata } from 'next'
import { Inter, Sniglet } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from './providers'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sniglet = Sniglet({
  subsets: ['latin'],
  variable: '--font-sniglet',
  display: 'swap',
  weight: ['400', '800'],
})

export const metadata: Metadata = {
  title: 'Wooders Rwanda | Handcrafted Wood Products',
  description: 'Handcrafted wooden furniture and decor made in Rwanda for homes and businesses. Chat with us on WhatsApp to order.',
  icons: {
    icon: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sniglet.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Footer />
              <WhatsAppFloat />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
