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
      className="h-full cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <Card className="h-full flex flex-col overflow-hidden border-border shadow-soft hover:shadow-medium transition-smooth">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
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

        {/* <CardHeader>
          <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-2xl font-bold text-primary">RWF{product.price}</p>
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        </CardContent> */}
      </Card>
    </motion.div>
  );
};
