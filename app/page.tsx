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
import { MessageSquare, ChevronDown, Package, Shield, Truck, Sparkles } from 'lucide-react'
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

  const heroImage = heroData?.images?.[0] || '/images/hero-bg.jpg'

  return (
    <div className="min-h-screen">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        {/* Diagonal sliding background images — all screens */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-x-[50%] -inset-y-[30%] animate-slide-diagonal">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 rotate-[-15deg] origin-center">
              {[...allProducts, ...allProducts, ...allProducts, ...allProducts].map((product, idx) => (
                <div
                  key={`diag-${idx}`}
                  className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 28vw, 22vw"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Overlaid text content — all screens */}
        <div className="relative z-10 container mx-auto px-5 md:px-8 pt-28 pb-20 flex flex-col items-center text-center min-h-screen justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 md:space-y-8 max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-sm font-medium text-white tracking-wide">Handcrafted in Rwanda</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] text-white drop-shadow-lg">
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
                  Handcrafted{' '}
                  <span className="text-[hsl(var(--wood-light))]">Wooden</span>{' '}
                  Elegance
                </>
              )}
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-sm md:max-w-xl mx-auto">
              {heroData?.subtitle ?? 'Beautiful wooden furniture and decor that brings warmth and artistry to your space.'}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2 justify-center"
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/80 text-[hsl(var(--charcoal))] hover:bg-white text-base py-4 h-13 rounded-full shadow-xl font-semibold"
              >
                Explore Collections
              </Button>
              <a href={getGeneralInquiryLink()} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-primary hover:bg-white/10 backdrop-blur-sm text-base py-4 h-13 rounded-full w-full font-semibold"
                >
                  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#25D366] mr-2">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                  </svg>
                  Chat with Us
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-5 md:gap-6 justify-center pt-3 text-white/70"
            >
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Handmade</span>
              </div>
              <div className="w-px h-3 md:h-4 bg-white/30" />
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Quality</span>
              </div>
              <div className="w-px h-3 md:h-4 bg-white/30" />
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Truck className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </motion.button>
      </section>

      {/* ===== COLLECTION SECTION ===== */}
      <section id="collection" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Collection</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each piece is handcrafted with care, bringing natural beauty into your space
            </p>
          </motion.div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {allProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* WhatsApp quick action on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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
                <div className="mt-3 px-1">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{product.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {allProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Package className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Our collection is coming soon!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-medium">Our Story</p>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Crafted with Passion,{' '}
                  <span className="text-[hsl(var(--wood-medium))]">Built to Last</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At <span className="font-semibold text-foreground">Wooders</span>, we transform sustainably sourced wood into beautiful pieces that bring warmth and character to your home. Each creation is a blend of traditional craftsmanship and modern design.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From elegant mirrors to functional shelves, every item tells a story of nature, patience, and artistic vision. We celebrate every wood grain and live edge as part of what makes each piece truly one-of-a-kind.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-xl bg-background/60">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                  <p className="text-sm font-semibold">Handcrafted</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/60">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                  <p className="text-sm font-semibold">Quality Assured</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/60">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-[hsl(var(--wood-medium))]" />
                  <p className="text-sm font-semibold">Fast Delivery</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                <Image
                  src="/images/about-workshop.jpg"
                  alt="Wooders workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div className="space-y-1.5">
              <p className="text-sm tracking-[0.2em] uppercase text-[hsl(var(--wood-medium))] font-medium">Testimonials</p>
              <h2 className="text-2xl md:text-3xl font-bold">Loved by Our Customers</h2>
            </div>
            <Button
              onClick={() => setIsTestimonialModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-full px-5 self-start sm:self-auto"
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

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Space?
            </h2>
            <p className="text-background/70 text-lg">
              Browse our collection and order your favorite piece directly on WhatsApp. Simple, fast, and personal.
            </p>
            <a
              href={getGeneralInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full font-semibold text-lg transition-colors shadow-lg"
            >
              <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
              </svg>
              Start a Conversation
            </a>
          </motion.div>
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
