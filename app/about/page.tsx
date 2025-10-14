'use client'

import { Header } from '@/components/Header'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen">
      <Header
        onOrderTrackingClick={() => {}}
        onWishlistClick={() => {}}
        wishlistCount={0}
      />
      
      <main className="container mx-auto px-4 mt-18 py-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-8xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-left bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            About us
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to <span className="font-semibold text-foreground">Wooders</span>, where craftsmanship meets creativity. 
                We are passionate artisans dedicated to creating beautiful, handcrafted wooden furniture and décor 
                that brings warmth and character to your home.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Each piece we create is thoughtfully designed and meticulously crafted from sustainably sourced wood. 
                From elegant mirrors to functional key hangers, rustic clocks to decorative shelves – every item 
                tells a story of nature, patience, and artistic vision.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our workshop is a place where traditional woodworking techniques meet modern design sensibilities. 
                We believe in the beauty of natural materials and the timeless appeal of handmade crafts. 
                Every wood grain, every live edge, every imperfection is celebrated as part of the unique character 
                that makes each piece one-of-a-kind.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Thank you for supporting handmade, sustainable craftsmanship. When you choose Wooders, 
                you're not just buying furniture – you're bringing home a piece of art, a touch of nature, 
                and a commitment to quality that will last for generations.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src="/images/about-workshop.jpg"
                  alt="Wooders workshop and craftsmanship"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
