'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/types/category"
import { Package } from "lucide-react"

interface CategoryCardProps {
  category: Category
  onClick: (category: Category) => void
  index: number
}

export const CategoryCard = ({ category, onClick, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="cursor-pointer h-full"
      onClick={() => onClick(category)}
    >
      <Card className="h-full overflow-hidden border-border shadow-soft hover:shadow-elegant transition-smooth group">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {category.image ? (
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
