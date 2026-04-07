'use client'

import { memo } from 'react'
import { Heart, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard = memo(({ product, isInWishlist, onToggleWishlist, onProductClick }: ProductCardProps) => {
  return (
    <div
      className="group cursor-pointer relative flex flex-col gap-2"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/5 backdrop-blur-xl hover:bg-white/20 border border-white/10 transition-all duration-500 rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0"
        >
          <Heart className={`h-3.5 w-3.5 transition-all duration-500 ${isInWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-90 group-hover:scale-100">
           <div className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl text-white py-2.5 px-5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20 shadow-2xl">
              Details <ArrowUpRight className="h-3 w-3" />
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black tracking-[0.25em] uppercase text-wood-light/80">{product.category}</span>
          <span className="text-[12px] font-bold text-wood-dark">
            <span className="text-[8px] text-wood-medium/50 mr-0.5">RWF</span>
            {product.price?.toLocaleString()}
          </span>
        </div>
        <div>
          <h3 className="text-sm md:text-base font-black tracking-tight text-wood-dark group-hover:text-wood-light transition-colors duration-500 leading-tight">{product.name}</h3>
          <p className="text-[11px] text-wood-dark/50 mt-1 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
