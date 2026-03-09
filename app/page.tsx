'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { TestimonialModal } from '@/components/TestimonialModal'
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel'
import { ProductLightbox } from '@/components/ProductLightbox'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Testimonial } from '@/types/testimonial'
import { getApprovedTestimonials } from '@/lib/api/testimonialService'
import { getProductOrderLink, getGeneralInquiryLink } from '@/lib/whatsapp'
import { MessageSquare, ChevronDown, Package, Shield, Truck, Sparkles, SearchIcon, Search, X } from 'lucide-react'
import Image from 'next/image'

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
    staleTime: 1000 * 60 * 5,
  })

  const allProducts = useMemo(() => categoriesData.flatMap((c) => c.products || []), [categoriesData])

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

  const heroImage = heroData?.images?.[0] || '/images/hero-bg.jpg'

  return (
    <div className="min-h-screen">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden]">
        <div className="absolute inset-0 overflow-hidden bg-black))]">
          <div className="absolute -inset-x-[50%] -inset-y-[30%] animate-slide-diagonal">
            <div className="flex flex-col gap-1.5 md:gap-2 rotate-[-15deg] origin-center">
              {allProducts.length > 0
                ? Array.from({ length: 12 }).map((_, rowIdx) => {
                    const rowProducts = [...allProducts, ...allProducts, ...allProducts]
                    return (
                      <div
                        key={`row-${rowIdx}`}
                        className="flex gap-1.5 md:gap-2"
                        style={{ marginLeft: rowIdx % 2 === 0 ? '0' : '-8%' }}
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
                    )
                  })
                : Array.from({ length: 12 }).map((_, rowIdx) => (
                    <div
                      key={`skel-row-${rowIdx}`}
                      className="flex gap-1.5 md:gap-2"
                      style={{ marginLeft: rowIdx % 2 === 0 ? '0' : '-8%' }}
                    >
                      {Array.from({ length: 12 }).map((_, colIdx) => (
                        <div
                          key={`skel-${rowIdx}-${colIdx}`}
                          className="aspect-[3/4] w-[28vw] md:w-[18vw] lg:w-[14vw] flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-neutral-900"
                        >
                          <div
                            className="h-full w-full animate-shimmer bg-gradient-to-r from-neutral-900 via-neutral-700/40 to-neutral-900 bg-[length:200%_100%]"
                            style={{ animationDelay: `${(colIdx % 7) * 120}ms` }}
                          />
                        </div>
                      ))}
                    </div>
                  ))
              }
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
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white tracking-wide">Handcrafted in Rwanda</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] text-white drop-shadow-lg"
            >
              {heroData?.title?.split(' ').map((word: string, i: number) => (
                <span key={i}>
                  {i === Math.floor((heroData?.title?.split(' ').length || 0) / 2) ? (
                    <span className="text-[hsl(var(--wood-light))]">{word} </span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              )) ?? (
                <>
                  Turning Wood{' '}
                  <span className="text-[hsl(var(--wood-medium))]">Into</span>{' '}
                  Home Stories
                </>
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-sm md:max-w-xl mx-auto"
            >
              {heroData?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 pt-2 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative text-sm sm:text-base py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg bg-slate text-amber-50 font-semibold shadow-2xl border border-amber-50 transition-all duration-300"
              >
                <span className="text-[hsl(var(--wood-light))] relative z-10 flex items-center gap-2">
                  <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80" />
                  Explore
                </span>
              </motion.button>
              <a href={getGeneralInquiryLink()} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group text-sm sm:text-base py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 32 32" className="w-4 h-4 sm:w-5 sm:h-5 fill-[#25D366]">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
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
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </motion.button>
      </section>
      <section id="collection" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each piece is handcrafted with care, bringing natural beauty into your space
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-6 sm:mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-full sm:max-w-xs">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 " />
              <input
                type="text"
                placeholder="🔍 Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--wood-light))]/30 focus:border-[hsl(var(--wood-light))] transition-all placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border transition-all ${
                    activeCategory === cat
                      ? 'bg-[hsl(var(--wood-light))] text-white border-[hsl(var(--wood-light))]'
                      : 'bg-background text-muted-foreground border-border hover:border-[hsl(var(--wood-light))]/40 hover:text-[hsl(var(--wood-light))]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ 
                  delay: Math.min(idx * 0.05, 0.3),
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer rounded-xl sm:rounded-2xl bg-muted/50 border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* WhatsApp quick action on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <a
                      href={getProductOrderLink(product.name, product.category)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                      </svg>
                      Order
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                      <Sparkles className="h-2 w-2" />
                      {product.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                      Handmade
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm leading-tight line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <p className="text-xs sm:text-sm font-bold text-[hsl(var(--wood-medium))]">
                    {product.price.toLocaleString()} RWF
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && allProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-base">No products match your search</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                className="mt-3 text-sm text-[hsl(var(--wood-medium))] hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}

          {allProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Package className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Loading Collections</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="relative py-20 lg:py-28 overflow-hidden bg-white">

        <div className="absolute inset-0 overflow-hidden bg-white">
          <div className="absolute -inset-x-[50%] -inset-y-[30%] animate-slide-diagonal">
            <div className="flex flex-col gap-1.5 md:gap-2 rotate-[-15deg] origin-center">
              {allProducts.length > 0 &&
                Array.from({ length: 12 }).map((_, rowIdx) => {
                  const rowProducts = [...allProducts, ...allProducts, ...allProducts]
                  return (
                    <div
                      key={`about-row-${rowIdx}`}
                      className="flex gap-1.5 md:gap-2"
                      style={{ marginLeft: rowIdx % 2 === 0 ? '0' : '-8%' }}
                    >
                      {rowProducts.map((product, colIdx) => (
                        <div
                          key={`about-diag-${rowIdx}-${colIdx}`}
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
                  )
                })
              }
            </div>
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 text-center"
            >
              <div>
                <p className="text-sm tracking-[0.2em] uppercase text-white/60 mb-3 font-medium">Our Story</p>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight text-white">
                  Crafted with Passion,{' '}
                  <span className="text-[hsl(var(--wood-light))]">Built to Last</span>
                </h2>
              </div>
              <p className="text-base text-white/80 leading-relaxed">
                At <span className="font-semibold text-white">Wooders</span>, we transform sustainably sourced wood into beautiful pieces that bring warmth and character to your home. Each creation is a blend of traditional craftsmanship and modern design.
              </p>
              <p className="text-base text-white/80 leading-relaxed">
                From elegant mirrors to functional shelves, every item tells a story of nature, patience, and artistic vision. We celebrate every wood grain and live edge as part of what makes each piece truly one-of-a-kind.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" className="py-14 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-4"
          >
            <div className="flex flex-col text-center space-y-1.5">
              <p className="text-sm tracking-[0.2em] uppercase text-[hsl(var(--wood-light))] font-medium">Testimonials</p>
              <h2 className="text-xl md:text-2xl font-bold">Loved by Our Customers</h2>
            </div>
            <Button
              onClick={() => setIsTestimonialModalOpen(true)}
              variant="outline"
              size="sm"
              className="mx-auto rounded-full px-5 self-start text-[hsl(var(--wood-medium))] border-[hsl(var(--wood-medium))] hover:bg-[hsl(var(--wood-light))]/10 hover:border-[hsl(var(--wood-light))] transition-colors"
            >
              <MessageSquare className="mr-1.5 h-4 w-4" />
              Share Yours
            </Button>
          </motion.div>

          {testimonialsData && testimonialsData.length > 0 && (
            <TestimonialsCarousel
              testimonials={testimonialsData}
              isLoading={testimonialsLoading}
            />
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
