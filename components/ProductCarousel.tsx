'use client'

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCarousel = ({ products, wishlist, onToggleWishlist, onProductClick }: ProductCarouselProps) => {
  return (
    <div className="container mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <ProductCard
                product={product}
                isInWishlist={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onProductClick={onProductClick}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
