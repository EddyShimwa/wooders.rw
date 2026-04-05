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
      className="group cursor-pointer relative flex flex-col gap-6"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-muted/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-6 right-6 z-10 p-3 bg-white/5 backdrop-blur-xl hover:bg-white/20 border border-white/10 transition-all duration-500 rounded-full opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0"
        >
          <Heart className={`h-4 w-4 transition-all duration-500 ${isInWishlist ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-90 group-hover:scale-100">
           <div className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl text-white py-3 px-6 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-white/20 shadow-2xl">
              View Details <ArrowUpRight className="h-4 w-4" />
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-wood-light">{product.category}</span>
          <span className="text-sm font-bold text-wood-dark">
            <span className="text-[10px] text-wood-medium/50 mr-1">RWF</span>
            {product.price?.toLocaleString()}
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-wood-dark group-hover:text-wood-light transition-colors duration-500">{product.name}</h3>
          <p className="text-sm text-wood-dark/50 mt-2 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
