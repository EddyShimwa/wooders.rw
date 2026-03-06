'use client'

import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Shield, Truck } from 'lucide-react'
import { getGeneralInquiryLink } from '@/lib/whatsapp'

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-medium">Our Story</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
              About Wooders
            </h1>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Welcome to <span className="font-semibold text-foreground">Wooders</span>, where craftsmanship meets creativity.
                  We are passionate artisans dedicated to creating beautiful, handcrafted wooden furniture and decor
                  that brings warmth and character to your home.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each piece we create is thoughtfully designed and meticulously crafted from sustainably sourced wood.
                  From elegant mirrors to functional key hangers, rustic clocks to decorative shelves &ndash; every item
                  tells a story of nature, patience, and artistic vision.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Thank you for supporting handmade, sustainable craftsmanship. When you choose Wooders,
                  you&apos;re not just buying furniture &ndash; you&apos;re bringing home a piece of art, a touch of nature,
                  and a commitment to quality that will last for generations.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                    <p className="text-sm font-semibold">Handcrafted</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                    <p className="text-sm font-semibold">Quality Assured</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                    <p className="text-sm font-semibold">Fast Delivery</p>
                  </div>
                </div>

                <a
                  href={getGeneralInquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full font-semibold transition-colors mt-4"
                >
                  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                  </svg>
                  Get in Touch
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                  <Image
                    src="/images/about-workshop.jpg"
                    alt="Wooders workshop and craftsmanship"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
