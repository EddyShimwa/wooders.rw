'use client'

import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { motion } from "framer-motion";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onOrder: (product: Product) => void;
}

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  isInWishlist,
  onToggleWishlist,
  onOrder,
}: ProductDetailsModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {product.category}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-foreground leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Price
                </h3>
                <p className="text-4xl font-bold text-primary">${product.price}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-6">
              <Button
                onClick={() => onOrder(product)}
                className="w-full bg-gradient-wood hover:opacity-90 transition-smooth"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Now
              </Button>

              <Button
                onClick={() => onToggleWishlist(product.id)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isInWishlist ? "fill-primary text-primary" : ""
                  }`}
                />
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
