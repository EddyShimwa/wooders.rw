'use client'

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard = ({ product, isInWishlist, onToggleWishlist, onProductClick }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full cursor-pointer group"
      onClick={() => onProductClick(product)}
    >
      <Card className="h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700"}`}
            />
          </Button>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pt-0">
          <p className="text-xl font-bold">RWF {product.price?.toLocaleString()}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
