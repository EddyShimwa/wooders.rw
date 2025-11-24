'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Category } from "@/types/category"
import { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"


interface CategoryModalProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
  onOrder: (product: Product) => void
}

export const CategoryModal = ({
  category,
  isOpen,
  onClose,
  onOrder,
}: CategoryModalProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    if (!category?.products) return []
    if (!searchQuery.trim()) return category.products

    return category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [category?.products, searchQuery])

  const handleProductClick = (product: Product) => {
    onClose()
    router.push(`/products/${product.id}`)
  }

  if (!category || !category.products || category.products.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold">{category.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div 
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    whileHover={{ y: -4 }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute left-0 right-0 bottom-0 px-3 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-semibold text-white line-clamp-2">{product.name}</p>
                      {product.price && (
                        <p className="text-xs text-white/90 mt-1">RWF {product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No products found</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Try adjusting your search</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
