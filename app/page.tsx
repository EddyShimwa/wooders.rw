'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { OrderTrackingModal } from '@/components/OrderTrackingModal'
import { WishlistModal } from '@/components/WishlistModal'
import { CategoryModal } from '@/components/CategoryModal'
import { TestimonialModal } from '@/components/TestimonialModal'
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Testimonial } from '@/types/testimonial'
import { getApprovedTestimonials } from '@/lib/api/testimonialService'
import { MessageSquare } from 'lucide-react'

const WISHLIST_STORAGE_KEY = 'wooders_wishlist'

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
  const router = useRouter()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false)

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY)

      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist))
      }
    } catch (error) {
      console.warn('Failed to read wishlist from localStorage', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    } catch (error) {
      console.warn('Failed to persist wishlist to localStorage', error)
    }
  }, [wishlist])

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`)
  }

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  const allProducts = useMemo(() => categoriesData.flatMap((c) => c.products || []), [categoriesData])
  const wishlistProducts = useMemo(
    () => allProducts.filter((product) => wishlist.includes(product.id)),
    [allProducts, wishlist]
  )

  return (
    <div className="min-h-screen">
      <Header
        onOrderTrackingClick={() => setIsTrackingModalOpen(true)}
        onWishlistClick={() => setIsWishlistModalOpen(true)}
        wishlistCount={wishlist.length}
      />

      <Hero
        categories={categoriesData}
        onCategoryClick={handleCategoryClick}
        hero={heroData}
      />

      {testimonialsData && testimonialsData.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hear from our satisfied customers about their experience with us.
              </p>
            </motion.div>

            <TestimonialsCarousel
              testimonials={testimonialsData}
              isLoading={testimonialsLoading}
            />

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center pt-6"
            >
              <Button
                onClick={() => setIsTestimonialModalOpen(true)}
                size="lg"
                className="px-8"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Share Your Feedback
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Floating Feedback Button - shown if no testimonials to highlight CTA */}
      {(!testimonialsData || testimonialsData.length === 0) && (
        <section className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Be the first to share your feedback with us!
          </p>
          <Button onClick={() => setIsTestimonialModalOpen(true)} size="lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            Submit Your Testimonial
          </Button>
        </section>
      )}

      <CategoryModal
        category={selectedCategory}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onOrder={handleProductClick}
      />

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemove={toggleWishlist}
        onOrder={handleProductClick}
      />

      <TestimonialModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
      />
    </div>
  )
}
