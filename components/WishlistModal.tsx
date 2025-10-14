'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemove: (productId: string) => void;
  onOrder: (product: Product) => void;
}

export const WishlistModal = ({ isOpen, onClose, wishlistProducts, onRemove, onOrder }: WishlistModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Wishlist</DialogTitle>
          <DialogDescription>
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
          </DialogDescription>
        </DialogHeader>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Your wishlist is empty. Start adding your favorite items!
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 border rounded-lg hover:shadow-soft transition-smooth"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-primary mt-2">
                    ${product.price}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      onOrder(product);
                      onClose();
                    }}
                    className="bg-gradient-wood"
                  >
                    Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemove(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
