'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Category } from "@/types/category"
import { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{category.name}</DialogTitle>
          <p className="text-muted-foreground">
            {filteredProducts.length} of {category.products.length} products available
          </p>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="py-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => handleProductClick(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* Name overlay */}
                  <div className="absolute left-0 right-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm font-medium text-white line-clamp-2">{product.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
