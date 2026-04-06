'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Package, Shield, Truck } from 'lucide-react'
import { Category } from '@/types/category'
import { getProductOrderLink } from '@/lib/whatsapp'
import Image from 'next/image'
import { motion } from 'framer-motion'

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

  const { data: categoriesData = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })

  const allProducts = categoriesData.flatMap((c) => c.products || [])
  const product = allProducts.find((p) => p.id === productId)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-6">
            <Skeleton className="h-10 w-24 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to collection
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
                {product.price && (
                  <p className="text-2xl font-bold text-primary">RWF {product.price.toLocaleString()}</p>
                )}
              </div>

              {product.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 py-6 border-y">
                <div className="text-center space-y-2">
                  <Package className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Made by hand</p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Quality checked</p>
                </div>
                <div className="text-center space-y-2">
                  <Truck className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Delivery available</p>
                </div>
              </div>

              <a
                href={getProductOrderLink(product.name, product.category)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-semibold text-lg transition-colors shadow-md"
              >
                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                </svg>
                Order via WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
