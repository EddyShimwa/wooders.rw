'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { OrderModal } from '@/components/OrderModal'
import { OrderTrackingModal } from '@/components/OrderTrackingModal'
import { WishlistModal } from '@/components/WishlistModal'
import { CategoryModal } from '@/components/CategoryModal'
import { Product } from '@/types/product'
import { Category } from '@/types/category'

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

export default function Home() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

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

  const handleOrder = (product: Product) => {
    setSelectedProduct(product)
    setIsCategoryModalOpen(false)
    setIsOrderModalOpen(true)
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

      <CategoryModal
        category={selectedCategory}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onOrder={handleOrder}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
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
        onOrder={handleOrder}
      />
    </div>
  )
}
