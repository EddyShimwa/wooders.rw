'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Category } from "@/types/category"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryModalProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
  wishlist: string[]
  onToggleWishlist: (productId: string) => void
  onOrder: (product: Product) => void
}

export const CategoryModal = ({
  category,
  isOpen,
  onClose,
  wishlist,
  onToggleWishlist,
  onOrder,
}: CategoryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const products = category?.products || []

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentIndex(0)
      onClose()
    }
  }

  if (!category || products.length === 0) return null

  const currentProduct = products[currentIndex]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold">{category.name}</DialogTitle>
          <p className="text-muted-foreground">
            {currentIndex + 1} of {products.length} products
          </p>
        </DialogHeader>

        <div className="relative px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-border shadow-medium">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <motion.img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleWishlist(currentProduct.id)}
                      className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          wishlist.includes(currentProduct.id)
                            ? "fill-primary text-primary"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl font-bold">
                          {currentProduct.name}
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                          {currentProduct.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-0">
                        <div className="text-4xl font-bold text-primary mb-6">
                          ${currentProduct.price}
                        </div>
                      </CardContent>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => {
                        onOrder(currentProduct)
                        onClose()
                      }}
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Order Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {products.length > 1 && (
            <div className="flex justify-between items-center mt-6 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {products.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={handleNext}
                className="flex-1"
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
