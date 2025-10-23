'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/Header'
import { OrderModal } from '@/components/OrderModal'
import { OrderTrackingModal } from '@/components/OrderTrackingModal'
import { WishlistModal } from '@/components/WishlistModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import Image from 'next/image'

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

  const { data: categoriesData = [] } = useQuery({
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

  if (!product) {
    return (
      <div className="min-h-screen">
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

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.category}</p>
            </div>

            <div className="text-3xl font-bold text-primary">
              {product.price} RWF
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => handleOrder(product)}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>
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