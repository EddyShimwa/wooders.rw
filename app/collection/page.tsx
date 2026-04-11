'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { Product, PaginatedResponse } from '@/types/product'
import { Category } from '@/types/category'
import { Search, X, Play } from 'lucide-react'
import { LoadingLogo } from '@/components/ui/LoadingLogo'
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton'
import { HandSawIcon } from '@/components/icons/WoodworkingIcons'
import dynamic from 'next/dynamic'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

const fetchProducts = async ({ 
  page = 1, 
  categoryId, 
  query = '',
  limit = 12 
}: { 
  page?: number, 
  categoryId?: string, 
  query?: string,
  limit?: number 
}): Promise<PaginatedResponse<Product>> => {
  const skip = (page - 1) * limit
  const categoryQuery = categoryId && categoryId !== 'All' ? `&categoryId=${categoryId}` : ''
  const searchParam = query ? `&query=${encodeURIComponent(query)}` : ''
  const response = await fetch(`/api/products?limit=${limit}&skip=${skip}${categoryQuery}${searchParam}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load products')
  }
  return data as PaginatedResponse<Product>
}

export default function Collection() {
  const queryClient = useQueryClient()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 24

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput)
      setPage(1) // Reset to first page on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const selectedCategoryId = useMemo(() => {
    if (activeCategory === 'All') return undefined
    return categoriesData.find(c => c.name === activeCategory)?.id
  }, [activeCategory, categoriesData])

  // Reset page when category changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const {
    data: productsResponse,
    isLoading,
    isPlaceholderData
  } = useQuery({
    queryKey: ['products', selectedCategoryId, page, debouncedQuery],
    queryFn: () => fetchProducts({ 
      page, 
      categoryId: selectedCategoryId, 
      query: debouncedQuery,
      limit: ITEMS_PER_PAGE 
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep old data while fetching new page
  })

  const products = productsResponse?.items || []
  const totalItems = productsResponse?.total || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const prefetchPage = (pageToPrefetch: number) => {
    if (pageToPrefetch < 1 || pageToPrefetch > totalPages) return
    queryClient.prefetchQuery({
      queryKey: ['products', selectedCategoryId, pageToPrefetch, debouncedQuery],
      queryFn: () => fetchProducts({ 
        page: pageToPrefetch, 
        categoryId: selectedCategoryId, 
        query: debouncedQuery,
        limit: ITEMS_PER_PAGE 
      }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  const categoryNames = useMemo(() => {
    const names = categoriesData.map((c) => c.name)
    return ['All', ...names]
  }, [categoriesData])

  const wishlistSet = useMemo(() => new Set(wishlist), [wishlist])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    )
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)} 
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Logic for ellipsis
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1} className="cursor-pointer">1</PaginationLink>
        </PaginationItem>
      )

      if (page > 3) {
        pages.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>)
      }

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) {
        if (i === 1 || i === totalPages) continue
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)} 
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (page < totalPages - 2) {
        pages.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>)
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={page === totalPages} className="cursor-pointer">{totalPages}</PaginationLink>
        </PaginationItem>
      )
    }
    return pages
  }

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
              <p className="text-wood-light font-normal tracking-[0.3em] uppercase text-[9px] mb-4">Full Collection</p>
              <h1 className="text-2xl md:text-4xl font-normal tracking-tighter leading-[0.85] mb-6 text-wood-dark">
                The <span className="text-wood-medium/40 font-brand">Collection</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed font-normal">
                Browse our full range of handcrafted wood products. Filter by category or search by product name.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-6 w-full md:w-auto items-end"
            >
              <div className="relative group w-full md:w-64 border-b border-wood-dark/20 pb-1.5">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-wood-dark/50 group-focus-within:text-wood-dark transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-7 pr-7 py-1.5 bg-transparent focus:outline-none font-medium tracking-wide text-wood-dark text-sm placeholder:text-wood-dark/30"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-wood-dark/50 hover:text-wood-dark"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Minimal Categories */}
              <div className="flex gap-5 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar w-full md:justify-end">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`whitespace-nowrap text-[9px] font-normal tracking-[0.2em] uppercase transition-all duration-500 relative py-1 ${
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
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 pt-12 transition-opacity duration-300",
            (isLoading && products.length === 0) || isPlaceholderData ? "opacity-50" : "opacity-100"
          )}>
            {isLoading && products.length === 0 ? (
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={wishlistSet.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onProductClick={setSelectedProduct}
                />
              ))
            )}
          </div>

          {/* Proper Pagination UI */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(page - 1)}
                      onMouseEnter={() => prefetchPage(page - 1)}
                      className={cn(
                        "cursor-pointer",
                        page === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                  
                  {renderPageNumbers()}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(page + 1)}
                      onMouseEnter={() => prefetchPage(page + 1)}
                      className={cn(
                        "cursor-pointer",
                        page === totalPages && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {isLoading && products.length === 0 && (
            <div className="flex justify-center py-20">
              <LoadingLogo text="Gathering our collection..." />
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-40"
            >
              <HandSawIcon className="h-12 w-12 mx-auto mb-6 text-wood-dark/20" />
              <h3 className="text-3xl font-normal tracking-tighter mb-4 text-wood-dark">No Products Found</h3>
              <p className="text-wood-dark/50 mb-10 max-w-sm mx-auto font-normal">We couldn&apos;t find products matching your filters. Try a different keyword or category.</p>
              <button
                onClick={() => { setSearchInput(''); handleCategoryChange('All') }}
                className="text-[10px] font-normal tracking-[0.2em] uppercase border-b border-wood-dark pb-1 hover:text-wood-light hover:border-wood-light transition-colors"
              >
                Reset Filters
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
        allProducts={products}
        onNavigate={setSelectedProduct}
      />
    </div>
  )
}
