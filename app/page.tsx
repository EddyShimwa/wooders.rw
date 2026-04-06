'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Testimonial } from '@/types/testimonial'
import { getApprovedTestimonials } from '@/lib/api/testimonialService'
import { getGeneralInquiryLink } from '@/lib/whatsapp'
import { MessageSquare, ChevronDown, Package, Shield, Truck, Search, X, Leaf, Play, SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  WoodenLogIcon,
  HandPlaneIcon,
  DropOilIcon,
  ChiselIcon,
  HandSawIcon,
  WoodRouterIcon,
  JointerIcon,
  DrillIcon,
} from '@/components/icons/WoodworkingIcons'

const HERO_GALLERY_ROWS = 12
const HERO_GALLERY_COLS = 12

const TestimonialModal = dynamic(
  () => import('@/components/TestimonialModal').then((mod) => mod.TestimonialModal),
  { ssr: false }
)

const TestimonialsCarousel = dynamic(
  () => import('@/components/TestimonialsCarousel').then((mod) => mod.TestimonialsCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`testimonial-loading-${i}`} className="h-64 rounded-[2.5rem] bg-muted/50 animate-pulse" />
        ))}
      </div>
    ),
  }
)

const ProductLightbox = dynamic(
  () => import('@/components/ProductLightbox').then((mod) => mod.ProductLightbox),
  { ssr: false }
)

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories')
  const data = await response.json()
  if (!response.ok || !data?.categories) {
    throw new Error(data?.message || 'Failed to load categories')
  }
  return data.categories as Category[]
}

const fetchHero = async () => {
  const response = await fetch('/api/hero')
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load hero content')
  }
  return data.hero
}

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return getApprovedTestimonials()
}

export default function Home() {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [shouldLoadTestimonials, setShouldLoadTestimonials] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (typeof browserWindow.requestIdleCallback === 'function') {
      const idleId = browserWindow.requestIdleCallback(() => setShouldLoadTestimonials(true), { timeout: 2000 })
      return () => browserWindow.cancelIdleCallback?.(idleId)
    }

    const timeoutId = window.setTimeout(() => setShouldLoadTestimonials(true), 1200)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })

  const { data: heroData = null } = useQuery({
    queryKey: ['hero'],
    queryFn: fetchHero,
    staleTime: 1000 * 60 * 5,
  })

  const { data: testimonialsData = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    enabled: shouldLoadTestimonials,
    staleTime: 1000 * 60 * 5,
  })

  const allProducts = useMemo(() => categoriesData.flatMap((c) => c.products || []), [categoriesData])
  const heroGalleryProducts = useMemo(() => allProducts.slice(0, 8), [allProducts])
  const featuredProducts = useMemo(() => allProducts.slice(0, 6), [allProducts])

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

      {/* ===== HERO SECTION ===== */}
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden]">
        <div className="absolute inset-0 overflow-hidden bg-black))]">
          <div className="absolute -inset-x-[50%] -inset-y-[30%] animate-slide-diagonal">
            <div className="flex flex-col gap-1.5 md:gap-2 rotate-[-15deg] origin-center">
              {allProducts.length > 0
                ? Array.from({ length: 12 }).map((_, rowIdx) => {
                    const rowProducts = [
                      ...allProducts,
                      ...allProducts,
                      ...allProducts,
                    ];
                    return (
                      <div
                        key={`row-${rowIdx}`}
                        className="flex gap-1.5 md:gap-2"
                        style={{ marginLeft: rowIdx % 2 === 0 ? "0" : "-8%" }}
                      >
                        {rowProducts.map((product, colIdx) => (
                          <div
                            key={`diag-${rowIdx}-${colIdx}`}
                            className="relative aspect-[3/4] w-[28vw] md:w-[18vw] lg:w-[14vw] flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden"
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 22vw, (max-width: 1024px) 16vw, 12vw"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })
                : Array.from({ length: 12 }).map((_, rowIdx) => (
                    <div
                      key={`skel-row-${rowIdx}`}
                      className="flex gap-1.5 md:gap-2"
                      style={{ marginLeft: rowIdx % 2 === 0 ? "0" : "-8%" }}
                    >
                      {Array.from({ length: 12 }).map((_, colIdx) => (
                        <div
                          key={`skel-${rowIdx}-${colIdx}`}
                          className="aspect-[3/4] w-[28vw] md:w-[18vw] lg:w-[14vw] flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-neutral-900"
                        >
                          <div
                            className="h-full w-full animate-shimmer bg-gradient-to-r from-neutral-900 via-neutral-700/40 to-neutral-900 bg-[length:200%_100%]"
                            style={{
                              animationDelay: `${(colIdx % 7) * 120}ms`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
          {/* Dark overlay for readability */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          />
        </div>

        {/* Overlaid text content — all screens */}
        <div className="relative z-10 container mx-auto px-5 md:px-8 pt-28 pb-20 flex flex-col items-center text-center min-h-screen justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 md:space-y-8 max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
            >
              <span className="text-xs sm:text-sm font-medium text-white tracking-wide">
                Handcrafted in Rwanda
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] text-white drop-shadow-lg"
            >
              {heroData?.title
                ?.split(" ")
                .map((word: string, i: number) => (
                  <span key={i}>
                    {i ===
                    Math.floor(
                      (heroData?.title?.split(" ").length || 0) / 2,
                    ) ? (
                      <span className="text-[hsl(var(--wood-light))]">
                        {word}{" "}
                      </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                )) ?? (
                <>
                  Turning Wood{" "}
                  <span className="text-[hsl(var(--wood-medium))]">Into</span>{" "}
                  Home Stories
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-sm md:max-w-xl mx-auto"
            >
              {heroData?.subtitle ??
                "Handcrafted wooden furniture and décor that brings warmth and artistry to your space."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-3 pt-2 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() =>
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative text-sm sm:text-base py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg bg-slate text-amber-50 font-semibold shadow-2xl border border-amber-50 transition-all duration-300"
              >
                <span className="text-[hsl(var(--wood-light))] relative z-10 flex items-center gap-2">
                  <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80" />
                  Explore
                </span>
              </motion.button>
              <a
                href={getGeneralInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group text-sm sm:text-base py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 32 32"
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-[#25D366]"
                    >
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z" />
                    </svg>
                    Chat
                  </span>
                </motion.button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-5 md:gap-6 justify-center pt-3 text-white/70"
            >
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <span>Wooden</span>
              </div>
              <div className="w-px h-3 md:h-4 bg-white/30" />
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Quality</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: 5 }}
          onClick={() =>
            document
              .getElementById("collection")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </motion.button>
      </section>

      {/* ===== COLLECTION SECTION ===== */}
      <section
        id="collection"
        className="relative py-24 lg:py-32 joinery-joint"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl"
            >
              <p className="text-wood-light font-black tracking-[0.3em] uppercase text-[10px] mb-4">
                Curated Selection
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8">
                Masterpiece <br />
                <span className="text-wood-medium/20 font-serif italic">
                  Gallery
                </span>
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                A selection from our archive of over 500 hand-tooled pieces.
                Every cut is a dialogue between the artisan and the grain.
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
                Explore Full Archives
                <div className="h-6 w-6 rounded-full border border-wood-dark/20 flex items-center justify-center group-hover:bg-wood-dark group-hover:text-white transition-all duration-500">
                  <Play className="h-2 w-2" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24 pt-16">
            {featuredProducts.map((product, i) => (
              <div
                key={product.id}
                className={`${i % 3 === 1 ? "lg:mt-32" : i % 3 === 2 ? "lg:mt-16" : ""}`}
              >
                <ProductCard
                  product={product}
                  isInWishlist={wishlistSet.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onProductClick={setSelectedProduct}
                />
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-background border border-wood-dark/10 hover:border-wood-dark/30 hover:shadow-2xl hover:shadow-wood-dark/5 transition-all duration-700 text-xs font-black tracking-[0.2em] uppercase text-wood-dark"
            >
              View All 500+ Masterpieces
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CRAFTSMANSHIP / DEMO SECTION ===== */}
      <section
        id="about"
        className="relative py-32 lg:py-48 overflow-hidden bg-background"
      >
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col items-center justify-center text-center mb-24">
            <p className="text-wood-light font-black tracking-[0.4em] uppercase text-[10px] mb-6">
              The Wooders Ethos
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.85] text-wood-dark max-w-4xl">
              Witness{" "}
              <span className="italic font-serif text-wood-medium/80">
                The Craft
              </span>
            </h2>
            <p className="mt-8 text-xl text-wood-dark/60 leading-relaxed font-medium max-w-2xl">
              Step into our studio. Watch raw timber transform into heirloom art
              through meticulous Rwandan joinery.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[21/9] md:aspect-[21/9] lg:aspect-[2.5/1] rounded-[2rem] md:rounded-[4rem] overflow-hidden group"
          >
            <Image
              src="/images/about-workshop.jpg"
              alt="Wooders Studio"
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-wood-dark/20 mix-blend-multiply transition-colors duration-1000" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mt-24 text-center">
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <WoodenLogIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Sustainably Sourced
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                Every log is ethically harvested, ensuring the forest thrives
                alongside our craft.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <HandSawIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Precision Cut
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                We respect the grain. Every cut is measured and executed with
                masterful precision.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <HandPlaneIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Hand-Tooled
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                We avoid mass production. Planes, chisels, and patience shape
                our signature edges.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <JointerIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Seamless Joinery
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                Traditional mortise and tenon techniques ensure pieces last for
                generations.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <DrillIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Solid Assembly
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                Reinforced core structures provide unshakeable stability without
                compromising design.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-wood-light/10 border border-wood-light/20 text-wood-medium mb-2 group-hover:scale-110 group-hover:bg-wood-light/20 transition-all duration-500">
                <DropOilIcon className="w-8 h-8" />
              </div>
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-dark">
                Organic Oils
              </h4>
              <p className="text-sm text-wood-dark/60 font-medium">
                Finished with natural blends that let the wood breathe and age
                gracefully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section
        id="testimonials"
        className="py-24 lg:py-40 bg-[#faf9f6] relative overflow-hidden content-auto-section"
      >
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wood-light/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <p className="text-wood-light font-bold tracking-[0.2em] uppercase text-sm mb-4">
                The Wall of Love
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Collector <br />
                <span className="text-wood-medium/30 font-serif italic text-5xl md:text-7xl">
                  Stories
                </span>
              </h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsTestimonialModalOpen(true)}
                className="rounded-2xl px-8 py-6 bg-wood-dark text-white font-bold text-sm tracking-widest uppercase shadow-xl shadow-wood-dark/10 hover:bg-wood-medium transition-all duration-300"
              >
                Share Your Experience
              </Button>
            </motion.div>
          </div>

          {shouldLoadTestimonials && testimonialsData.length > 0 && (
            <TestimonialsCarousel
              testimonials={testimonialsData}
              isLoading={testimonialsLoading}
            />
          )}

          {shouldLoadTestimonials &&
            testimonialsData.length === 0 &&
            !testimonialsLoading && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-border">
                <WoodRouterIcon className="h-12 w-12 mx-auto mb-4 text-wood-light/20" />
                <p className="text-wood-dark/50 font-medium">
                  No stories shared yet. Be the first to tell yours.
                </p>
              </div>
            )}

          {!shouldLoadTestimonials && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`testimonial-idle-${i}`}
                  className="h-52 rounded-[2rem] bg-white/60 animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PRODUCT LIGHTBOX ===== */}
      <ProductLightbox
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        allProducts={allProducts}
        onNavigate={setSelectedProduct}
      />

      <TestimonialModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
      />
    </div>
  );
}
