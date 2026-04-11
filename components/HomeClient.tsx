'use client'

import { useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Testimonial } from '@/types/testimonial'
import { Hero } from '@/types/hero'
import { getGeneralInquiryLink } from '@/lib/whatsapp'
import { Play, Mail, Phone, MapPin, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  WoodenLogIcon,
  HandPlaneIcon,
  DropOilIcon,
  HandSawIcon,
  JointerIcon,
  DrillIcon,
} from '@/components/icons/WoodworkingIcons'

const TestimonialModal = dynamic(
  () => import('@/components/TestimonialModal').then((mod) => mod.TestimonialModal),
  { ssr: false }
)

const TestimonialsCarousel = dynamic(
  () => import('@/components/TestimonialsCarousel').then((mod) => mod.TestimonialsCarousel),
  {
    ssr: false,
    loading: () => null,
  }
)

const ProductLightbox = dynamic(
  () => import('@/components/ProductLightbox').then((mod) => mod.ProductLightbox),
  { ssr: false }
)

interface HomeClientProps {
  initialCategories: Category[];
  initialHero: Hero | null;
  initialTestimonials: Testimonial[];
}

export default function HomeClient({ initialCategories, initialHero, initialTestimonials }: HomeClientProps) {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])

  const allProducts = useMemo(() => initialCategories.flatMap((c) => c.products || []), [initialCategories])
  const featuredProducts = useMemo(() => allProducts.slice(0, 12), [allProducts])

  const wishlistSet = useMemo(() => new Set(wishlist), [wishlist])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    )
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="relative h-full w-full"
          >
            <Image
              src={`${initialHero?.images?.[0] || '/images/wooders_hero.png'}?t=${new Date().getDate()}`}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          
          {/* Dynamic Overlays */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-10 pt-20 flex flex-col items-start min-h-screen justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3,
                },
              },
            }}
            className="max-w-4xl w-full text-left space-y-10"
          >
            {/* Top Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="flex justify-start"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-wood-light animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-black text-white tracking-[0.3em] uppercase">
                  Made In Rwanda
                </span>
              </div>
            </motion.div>

            {/* Main Title with Creative Typography */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-black text-white leading-[0.85] tracking-tighter">
                {initialHero?.title ? (
                  <>
                    {initialHero.title.split(' ').slice(0, -1).join(' ')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-wood-light via-wood-medium to-wood-light font-serif italic font-normal lowercase tracking-normal">
                      {initialHero.title.split(' ').pop()}
                    </span>
                  </>
                ) : (
                  <>
                    Timeless Wood <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-wood-light via-wood-medium to-wood-light font-serif italic font-normal lowercase tracking-normal">
                      Artistry
                    </span>
                  </>
                )}
              </h1>
            </motion.div>

            {/* Subtitle with better measure */}
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 1, delay: 0.8 } }
              }}
              className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl font-medium leading-relaxed"
            >
              {initialHero?.subtitle ?? "Handcrafted wooden furniture and decor, blending traditional Rwandan mastery with contemporary design."}
            </motion.p>

            {/* Sophisticated Actions */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1 } }
              }}
              className="flex flex-col sm:flex-row items-center justify-start gap-8 pt-4"
            >
              <button
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative px-10 py-5 bg-white text-wood-dark font-black text-xs tracking-[0.3em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-wood-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="collection" className="relative py-24 lg:py-32 joinery-joint content-auto-section">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl"
            >
              <p className="text-wood-light font-black tracking-[0.3em] uppercase text-[9px] mb-4">
                Featured Pieces
              </p>
              <h2 className="text-2xl mr-2 flex md:text-4xl font-black tracking-tighter leading-[0.85] mb-6">
                Featured <br />
                <span className="text-wood-medium/20 font-serif">
                  Collection
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                Explore a curated set of our handcrafted wood products. Built
                for homes, offices, and hospitality spaces in Rwanda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex justify-start md:justify-end w-full md:w-auto"
            >
              <Link
                href="/collection"
                className="group flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase text-wood-dark border-b border-wood-dark/20 hover:border-wood-dark pb-2 transition-all duration-500"
              >
                View Full Collection
                <div className="h-6 w-6 rounded-full border border-wood-dark/20 flex items-center justify-center group-hover:bg-wood-dark group-hover:text-white transition-all duration-500">
                  <Play className="h-2 w-2" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 pt-4">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  isInWishlist={wishlistSet.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onProductClick={setSelectedProduct}
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-background border border-wood-dark/10 hover:border-wood-dark/30 hover:shadow-2xl hover:shadow-wood-dark/5 transition-all duration-700 text-xs font-black tracking-[0.2em] uppercase text-wood-dark"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-12 lg:py-12 overflow-hidden bg-background content-auto-section">
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <p className="text-wood-light font-black tracking-[0.4em] uppercase text-[9px] mb-6">
              Who We Are
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[0.85] text-wood-dark max-w-4xl">
              Handcrafted <br />
              <span className="text-wood-medium/20 font-serif">Excellence</span>
            </h2>
            <p className="mt-6 text-lg text-wood-dark/60 leading-relaxed font-medium max-w-2xl">
              Wooders is a premium woodworking studio dedicated to creating high-quality, 
              durable wooden furniture and decor. Our mission is to blend traditional 
              craftsmanship with modern design for homes and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20 text-center">
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <WoodenLogIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">The Vision</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">To be Rwanda&apos;s leading name in bespoke wooden furniture, known for uncompromising quality.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <HandSawIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">Local Mastery</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">Our artisans bring years of experience and a deep passion for woodwork to every piece.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <HandPlaneIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">Sustainable Heritage</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">We respect our natural resources by using sustainably sourced timber for long-lasting value.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <JointerIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">Modern Utility</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">Designs that look beautiful while serving the practical needs of contemporary Rwandan living.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <DrillIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">Made in Rwanda</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">Proudly contributing to the local economy and showcasing Rwandan craftsmanship to the world.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-1 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <DropOilIcon className="w-7 h-7" />
              </div>
              <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-wood-dark">Your Custom Space</h4>
              <p className="text-[13px] text-wood-dark/60 font-medium leading-relaxed">We work closely with clients to create bespoke pieces that perfectly fit their unique vision.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-12 lg:py-18 bg-[#faf9f6] relative overflow-hidden content-auto-section">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 max-w-7xl mx-auto text-center md:text-left">
            <div className='flex '>
              <h2 className="text-xl md:text-2xl mr-2 font-black tracking-tighter leading-none text-wood-dark">Our trusted</h2>
              <h2 className="text-xl md:text-2xl font-black tracking-tighter leading-none text-wood-dark">Clients</h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setIsTestimonialModalOpen(true)} className="rounded-2xl px-6 py-3 bg-wood-dark text-white font-bold text-sm tracking-widest uppercase shadow-xl shadow-wood-dark/10 hover:bg-wood-medium transition-all duration-300 h-auto">
                Share a Review
              </Button>
            </motion.div>
          </div>

          <TestimonialsCarousel testimonials={initialTestimonials} isLoading={false} />
        </div>
      </section>

      <section id="contact-cta" className="py-12  lg:py-32 bg-background border-t border-wood-light/5 relative overflow-hidden content-auto-section">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wood-light/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <p className="text-wood-light font-black tracking-[0.4em] uppercase text-[9px]">
                  Get in Touch
                </p>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[0.85] text-wood-dark">
                  Ready to Transform <br />
                  Your <span className="text-wood-medium/20 font-serif">Space?</span>
                </h2>
                <p className="text-lg text-wood-dark/60 leading-relaxed font-medium max-w-xl">
                  Whether it&apos;s a custom dining table or a full office fit-out, 
                  we&apos;re here to bring your vision to life with Rwandan excellence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <a href="mailto:woodersrwanda@gmail.com">
                  <Button variant="outline" className="h-8 px-10 rounded-2xl border-wood-dark/10 text-wood-dark font-bold text-base tracking-widest uppercase hover:bg-wood-light/5 transition-all duration-500 w-full sm:w-auto">
                    Email Inquiry
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <div className="p-8 rounded-3xl bg-wood-light/5 border border-wood-light/10 space-y-4 group hover:bg-wood-light/10 transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-wood-medium shadow-sm group-hover:scale-110 transition-all duration-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-wood-dark/40 mb-1">Visit Us</h4>
                  <p className="text-sm font-bold text-wood-dark leading-tight">Kigali, Rwanda</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-wood-light/5 border border-wood-light/10 space-y-4 group hover:bg-wood-light/10 transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-wood-medium shadow-sm group-hover:scale-110 transition-all duration-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-wood-dark/40 mb-1">Email Us</h4>
                  <p className="text-sm font-bold text-wood-dark leading-tight">woodersrwanda@gmail.com</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-wood-light/5 border border-wood-light/10 space-y-4 group hover:bg-wood-light/10 transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-wood-medium shadow-sm group-hover:scale-110 transition-all duration-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-wood-dark/40 mb-1">Call Us</h4>
                  <p className="text-sm font-bold text-wood-dark leading-tight">+250 780 609 878</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-wood-dark border border-wood-dark space-y-4 group hover:bg-wood-medium transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-all duration-500">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">Follow Us</h4>
                  <p className="text-sm font-bold text-white leading-tight">@wooders_rw</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductLightbox product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} allProducts={allProducts} onNavigate={setSelectedProduct} />
      <TestimonialModal isOpen={isTestimonialModalOpen} onClose={() => setIsTestimonialModalOpen(false)} />
    </div>
  )
}
