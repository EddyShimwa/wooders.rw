'use client'

import { useMemo, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Search, X } from 'lucide-react'
import { HandSawIcon } from '@/components/icons/WoodworkingIcons'
import dynamic from 'next/dynamic'

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

export default function Collection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState<string[]>([])

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
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

      <section className="pt-40 pb-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="max-w-xl"
            >
              <p className="text-wood-light font-black tracking-[0.3em] uppercase text-[10px] mb-4">Complete Archives</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8 text-wood-dark">
                The <span className="text-wood-medium/40 font-serif italic">Collection</span>
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                Explore our full catalogue of over 500 handcrafted masterpieces. Filter by collection or search for specific grains and forms.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-8 w-full md:w-auto items-end"
            >
              {/* Minimal Search */}
              <div className="relative group w-full md:w-72 border-b border-wood-dark/20 pb-2">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-wood-dark/50 group-focus-within:text-wood-dark transition-colors" />
                <input
                  type="text"
                  placeholder="Find your grain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-transparent focus:outline-none font-medium tracking-wide text-wood-dark placeholder:text-wood-dark/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-wood-dark/50 hover:text-wood-dark"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Minimal Categories */}
              <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide no-scrollbar w-full md:justify-end">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 relative py-1 ${
                      activeCategory === cat
                        ? 'text-wood-dark'
                        : 'text-wood-dark/40 hover:text-wood-dark/80'
                    }`}
                  >
                    {cat}
                    {activeCategory === cat && (
                      <motion.div 
                        layoutId="activeCategory"
                        className="absolute bottom-0 left-0 right-0 h-px bg-wood-dark"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24 pt-16">
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
              className="text-center py-40"
            >
              <HandSawIcon className="h-12 w-12 mx-auto mb-6 text-wood-dark/20" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 text-wood-dark">No Matches Found</h3>
              <p className="text-wood-dark/50 mb-10 max-w-sm mx-auto font-medium">Your search didn&apos;t yield any results. Try refining your terms.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                className="text-[10px] font-black tracking-[0.2em] uppercase border-b border-wood-dark pb-1 hover:text-wood-light hover:border-wood-light transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
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
    </div>
  )
}
