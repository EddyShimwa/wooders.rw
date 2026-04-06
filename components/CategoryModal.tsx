'use client'

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Category } from "@/types/category"
import { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { getProductOrderLink } from "@/lib/whatsapp"

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
}: CategoryModalProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    if (!category?.products) return []
    if (!searchQuery.trim()) return category.products

    return category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [category?.products, searchQuery])

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
              placeholder="Search in this category..."
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
                    className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute left-0 right-0 bottom-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-semibold text-white line-clamp-2">{product.name}</p>
                      <a
                        href={getProductOrderLink(product.name, category.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-md text-xs font-semibold transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-current">
                          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                        </svg>
                        Order on WhatsApp
                      </a>
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
                  <p className="text-sm mt-2">Try another keyword</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
