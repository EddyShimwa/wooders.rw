'use client'

import { Heart, ShoppingCart, ShieldCheck, Truck, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onOrder: (product: Product) => void;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  isInWishlist,
  onToggleWishlist,
  onOrder,
}: ProductDetailsModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] p-0 overflow-hidden border-none bg-cream dark:bg-charcoal sculpted transition-smooth">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-wood-dark transition-all duration-300 group"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-auto h-full min-h-[500px] bg-muted/10 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-wood-light/10" />
            )}
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-1000 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'} hover:scale-110`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </motion.div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

            {/* Floating Badge */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-8 left-8 z-10"
            >
              <div className="bg-white/90 dark:bg-charcoal/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-wood-light/20 shadow-xl flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse" />
                <span className="text-[10px] font-normal uppercase tracking-[0.2em] text-wood-dark">
                  Artisanal Piece
                </span>
              </div>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="p-10 md:p-14 lg:p-16 flex flex-col justify-between joinery-joint bg-cream dark:bg-charcoal relative">
            <div className="space-y-10">
              <div className="space-y-4">
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <span className="text-[10px] font-normal tracking-[0.4em] uppercase text-wood-light">
                    {product.category}
                  </span>
                </motion.div>
                
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter leading-[0.85] text-wood-dark">
                    {product.name} <br />
                    <span className="text-wood-medium/20 font-serif italic font-normal">Details</span>
                  </h2>
                </motion.div>
                
                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="pt-6 flex items-baseline gap-3"
                >
                  <span className="text-xs font-normal text-wood-light/60 tracking-widest uppercase">Price</span>
                  <span className="text-4xl font-normal tracking-tighter text-wood-dark dark:text-cream">
                    RWF {product.price?.toLocaleString()}
                  </span>
                </motion.div>
              </div>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-wood-light/5 border-l-4 border-wood-light relative overflow-hidden group">
                  <div className="absolute top-4 right-6 text-wood-light/10 font-serif text-6xl select-none">&quot;</div>
                  <h3 className="text-[10px] font-normal tracking-[0.2em] uppercase text-wood-medium/40 mb-3">
                    Artisan&apos;s Perspective
                  </h3>
                  <p className="text-base text-wood-dark/80 dark:text-cream/80 leading-relaxed font-normal italic relative z-10">
                    &quot;{product.description}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 py-6 border-y border-wood-light/10">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Package className="h-5 w-5 text-wood-medium" />
                    <span className="text-[9px] font-normal uppercase tracking-wider text-wood-dark/40">Premium Wood</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <ShieldCheck className="h-5 w-5 text-wood-medium" />
                    <span className="text-[9px] font-normal uppercase tracking-wider text-wood-dark/40">Lifetime Craft</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Truck className="h-5 w-5 text-wood-medium" />
                    <span className="text-[9px] font-normal uppercase tracking-wider text-wood-dark/40">Kigali Delivery</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Section */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-12 space-y-4"
            >
              <Button
                onClick={() => onOrder(product)}
                className="w-full h-16 bg-wood-dark hover:bg-wood-medium text-white font-bold text-base tracking-widest uppercase rounded-2xl shadow-2xl shadow-wood-dark/20 group transition-all duration-500 active:scale-95"
              >
                <ShoppingCart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Place Order on WhatsApp
              </Button>

              <div className="flex gap-4">
                <Button
                  onClick={() => onToggleWishlist(product.id)}
                  variant="outline"
                  className="flex-1 h-16 rounded-2xl border-wood-dark/10 hover:bg-wood-light/5 transition-all duration-500 active:scale-95"
                >
                  <Heart
                    className={`h-5 w-5 mr-2 transition-colors ${
                      isInWishlist ? "fill-destructive text-destructive border-none" : "text-wood-dark/40"
                    }`}
                  />
                  <span className="font-normal text-wood-dark tracking-widest uppercase text-xs">
                    {isInWishlist ? "Saved in Wishlist" : "Save Piece"}
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

