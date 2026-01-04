'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/Header'
import { OrderModal } from '@/components/OrderModal'
import { OrderTrackingModal } from '@/components/OrderTrackingModal'
import { WishlistModal } from '@/components/WishlistModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, ArrowLeft, ShoppingCart, Package, Shield, Truck } from 'lucide-react'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import Image from 'next/image'
import { motion } from 'framer-motion'

const WISHLIST_STORAGE_KEY = 'wooders_wishlist'

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories')
  const data = await response.json()

  if (!response.ok || !data?.categories) {
    throw new Error(data?.message || 'Failed to load categories')
  }

  return data.categories as Category[]
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [wishlist, setWishlist] = useState<string[]>([])
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

  const { data: categoriesData = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
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
    setIsOrderModalOpen(true)
  }

  const allProducts = categoriesData.flatMap((c) => c.products || [])
  const product = allProducts.find((p) => p.id === productId)
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id))

  if (isCategoriesLoading) {
    return (
      <div className="min-h-screen">
        <Header
          onOrderTrackingClick={() => setIsTrackingModalOpen(true)}
          onWishlistClick={() => setIsWishlistModalOpen(true)}
          wishlistCount={wishlist.length}
        />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-10 w-24 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-14 flex-1" />
                  <Skeleton className="h-14 w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen py-24">
        <Header
          onOrderTrackingClick={() => setIsTrackingModalOpen(true)}
          onWishlistClick={() => setIsWishlistModalOpen(true)}
          wishlistCount={wishlist.length}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        onOrderTrackingClick={() => setIsTrackingModalOpen(true)}
        onWishlistClick={() => setIsWishlistModalOpen(true)}
        wishlistCount={wishlist.length}
      />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-lg"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  {product.category}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{product.name}</h1>
                <div className="text-4xl font-bold">
                  RWF {product.price?.toLocaleString()}
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y">
                <div className="text-center space-y-2">
                  <Package className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Handcrafted</p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Quality Assured</p>
                </div>
                <div className="text-center space-y-2">
                  <Truck className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Fast Delivery</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => handleOrder(product)}
                  className="flex-1 h-14 text-base"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toggleWishlist(product.id)}
                  className="h-14 px-6"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
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