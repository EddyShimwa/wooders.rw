'use client'

import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard = ({ product, isInWishlist, onToggleWishlist, onProductClick }: ProductCardProps) => {
  const toPlainText = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (node.nodeType === 'text') return node.value || ''
    if (Array.isArray(node)) return node.map(toPlainText).join('')
    if (node.content) return node.content.map(toPlainText).join('')
    return ''
  }

  const descriptionText = toPlainText(product.description as any)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <Card className="h-full flex flex-col overflow-hidden border-border shadow-soft hover:shadow-medium transition-smooth">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[50%] object-cover transition-transform duration-500 hover:scale-110"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-smooth"
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>

        <CardHeader>
          <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">{descriptionText}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-2xl font-bold text-primary">${product.price}</p>
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
