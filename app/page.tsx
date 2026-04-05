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
import { MessageSquare, ChevronDown, Package, Shield, Truck, Search, X, Leaf, Play } from 'lucide-react'
import Image from 'next/image'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
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
  const heroShowcaseProducts = useMemo(() => allProducts.slice(0, 6), [allProducts])
  const heroImage = '/images/hero-bg.jpg'

  const categoryNames = useMemo(() => {
    const names = categoriesData.map((c) => c.name)
    return ['All', ...names]
  }, [categoriesData])

  const filteredProducts = useMemo(() => {
    let products = allProducts
    if (activeCategory !== 'All') {
      products = products.filter((p) => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }
    return products
  }, [allProducts, activeCategory, searchQuery])

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
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-ebony">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={heroData?.title || 'Wooders hero background'}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105 opacity-80 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ebony via-ebony/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-ebony/60 via-transparent to-transparent z-10" />
          
          {/* Animated Topographic/Wood Ring SVG Overlay */}
          <div className="absolute inset-0 z-10 opacity-10 pointer-events-none mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)"/>
            </svg>
          </div>
        </div>

        <div className="relative z-30 container mx-auto px-6 pt-20 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="space-y-12 max-w-5xl mx-auto w-full">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
                <Leaf className="h-4 w-4 text-wood-light" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/80">Rwandan Artisanal Studio</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.8] text-white tracking-tighter text-center">
              {heroData?.title?.split(' ').map((word: string, i: number, arr: string[]) => (
                <span key={i} className="inline-block relative z-20">
                  {i === Math.floor(arr.length / 2) ? (
                    <span className="text-wood-light italic font-serif pr-4 relative">
                      {word}
                      <svg className="absolute -bottom-4 left-0 w-full h-8 text-wood-light/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </span>
                  ) : (
                    <span className="pr-4">{word}</span>
                  )}
                </span>
              )) ?? (
                <>
                  Sculpting <span className="text-wood-light italic font-serif relative">
                    Nature
                    <svg className="absolute -bottom-4 left-0 w-full h-8 text-wood-light/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span> Into Art
                </>
              )}
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mt-16 pt-10 border-t border-white/10">
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-lg font-medium text-center md:text-left">
                {heroData?.subtitle ?? 'Experience the intersection of raw nature and meticulous design through our heirloom furniture pieces.'}
              </p>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-wood-light/10 border border-wood-light/30 hover:bg-wood-light/20 transition-all duration-700"
                >
                  <div className="absolute inset-0 rounded-full border border-wood-light animate-ping opacity-20" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-wood-light group-hover:scale-110 transition-transform duration-500">Explore</span>
                </button>
                <button className="group flex items-center gap-4 text-white hover:text-wood-light transition-colors">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-all duration-500">
                    <Play className="h-5 w-5 fill-current ml-1" />
                  </div>
                  <span className="text-xs font-black tracking-[0.2em] uppercase">Watch Film</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLLECTION SECTION ===== */}
      <section id="collection" className="relative py-24 lg:py-32 joinery-joint">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-xl"
            >
              <p className="text-wood-light font-black tracking-[0.3em] uppercase text-[10px] mb-4">Precision Series</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8">Masterpiece <br /><span className="text-wood-medium/20 font-serif italic">Gallery</span></h2>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                Every piece is a dialogue between the artisan and the grain. Discover functional art for the modern sanctuary.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-6 w-full md:w-auto"
            >
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-wood-light transition-colors" />
                <input
                  type="text"
                  placeholder="Find your grain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 pl-12 pr-12 py-5 rounded-[2rem] border-border/40 bg-muted/30 focus:bg-background focus:sculpted transition-all outline-none font-bold tracking-tight text-sm carved"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-500 ${
                      activeCategory === cat
                        ? 'bg-wood-dark text-white border-wood-dark shadow-2xl shadow-wood-dark/20 scale-105'
                        : 'bg-background text-muted-foreground border-border/40 hover:border-wood-light/40 hover:text-wood-dark hover:sculpted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 pt-16">
            {filteredProducts.map((product, i) => (
              <div 
                key={product.id} 
                className={`${i % 3 === 1 ? 'lg:mt-32' : i % 3 === 2 ? 'lg:mt-16' : ''}`}
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

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-40 bg-muted/10 rounded-[4rem] border-2 border-dashed border-border/20"
            >
              <Package className="h-20 w-20 mx-auto mb-8 text-wood-light opacity-10" />
              <h3 className="text-3xl font-black tracking-tighter mb-4">No Matches Found</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium">Your search didn&apos;t yield any results. Try refining your terms or browsing all collections.</p>
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                className="h-14 px-10 rounded-2xl border-wood-light text-wood-light hover:bg-wood-light hover:text-white font-black tracking-widest uppercase"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="relative py-32 lg:py-48 overflow-hidden joinery-joint content-auto-section">
        <div className="absolute inset-0 bg-[#f4f1ea] z-0" />
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-background to-transparent z-10" />
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div className="absolute -inset-6 bg-wood-light/5 rounded-[4rem] rotate-2 group-hover:rotate-1 transition-transform duration-1000" />
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden sculpted shadow-2xl group cursor-pointer">
                <Image
                  src="/images/about-workshop.jpg"
                  alt="The Wooders Workshop"
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl group-hover:bg-white/20 transition-all duration-700 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20" />
                    <Play className="h-8 w-8 text-white ml-1 filter drop-shadow-md" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#faf9f6] p-8 rounded-full shadow-2xl hidden md:flex items-center justify-center rotate-6 group-hover:rotate-0 transition-all duration-1000 border border-border/20 z-10">
                <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-30" viewBox="0 0 100 100">
                  <path id="curve" d="M 50 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
                  <text className="text-[10.5px] font-black tracking-[0.25em] uppercase fill-wood-dark">
                    <textPath href="#curve" startOffset="0%">• watch the masterclass • the art of wood </textPath>
                  </text>
                </svg>
                <div className="h-40 w-40 border border-wood-light/20 rounded-full flex flex-col items-center justify-center text-center bg-white shadow-inner z-10">
                   <p className="text-4xl font-black text-wood-dark tracking-tighter leading-none">100%</p>
                   <p className="text-[9px] font-black tracking-[0.2em] uppercase text-wood-medium mt-2 leading-tight">Handmade<br/>in Rwanda</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <p className="text-wood-light font-black tracking-[0.4em] uppercase text-[10px]">The Wooders Ethos</p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-wood-dark">
                  Legacy <br />
                  <span className="italic font-serif text-wood-medium/60">In Every Cut</span>
                </h2>
              </div>
              
              <div className="space-y-8 text-xl text-wood-dark/70 leading-relaxed font-medium">
                <p>
                  We don&apos;t just build furniture; we curate the natural history of the Rwandan landscape. Every knot, grain, and edge is a testament to the soil it was born from.
                </p>
                <p className="wood-border-l italic font-serif text-wood-dark/90">
                  &ldquo;Our philosophy is simple: listen to the wood. It tells us what it wants to become.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-wood-dark/10">
                <div className="space-y-1">
                  <h4 className="text-3xl font-black text-wood-dark tracking-tighter">Sourced</h4>
                  <p className="text-[10px] text-wood-medium font-black uppercase tracking-[0.2em]">Sustainable Teak</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-black text-wood-dark tracking-tighter">Polished</h4>
                  <p className="text-[10px] text-wood-medium font-black uppercase tracking-[0.2em]">Organic Oils</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" className="py-24 lg:py-40 bg-[#faf9f6] relative overflow-hidden content-auto-section">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wood-light/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <p className="text-wood-light font-bold tracking-[0.2em] uppercase text-sm mb-4">The Wall of Love</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Collector <br /><span className="text-wood-medium/30 font-serif italic text-5xl md:text-7xl">Stories</span></h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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

          {shouldLoadTestimonials && testimonialsData.length === 0 && !testimonialsLoading && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-border">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-wood-light/20" />
              <p className="text-wood-dark/50 font-medium">No stories shared yet. Be the first to tell yours.</p>
            </div>
          )}

          {!shouldLoadTestimonials && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`testimonial-idle-${i}`} className="h-52 rounded-[2rem] bg-white/60 animate-pulse" />
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
  )
}
