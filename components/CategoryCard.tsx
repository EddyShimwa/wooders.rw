"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/types/category"
import { Package } from "lucide-react"
import Image from "next/image"

interface CategoryCardProps {
  category: Category
  onClick: (category: Category) => void
  index: number
}

function CategorySlideshow({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    setIdx(0)
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(id)
  }, [images])

  return (
    <div
      className="relative w-full h-full"
      style={{ minHeight: 0 }}
    >
      <div className="relative w-full h-full">
        {images.map((src, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={src} alt={`slide-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              setIdx(i)
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  )
}

export const CategoryCard = ({ category, onClick, index }: CategoryCardProps) => {
  const images = useMemo(() => category.products?.map((p) => p.image) || [], [category.products])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="cursor-pointer h-full"
      onClick={() => onClick(category)}
    >
      <Card className="h-full overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* Slideshow of product images within the category. Falls back to category.image or icon. */}
          {category.products && category.products.length > 0 ? (
            <CategorySlideshow images={images} />
          ) : category.image ? (
            <motion.img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Package className="w-16 h-16 text-primary/40" />
            </div>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
            {category.name}
          </CardTitle>
          {category.description && (
            <CardDescription className="line-clamp-2">
              {category.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">
              {category.productCount || 0} {category.productCount === 1 ? 'product' : 'products'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
