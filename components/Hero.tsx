import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CategoryCard } from "./CategoryCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Category } from "@/types/category";
import type { Hero as HeroType } from "@/types/hero";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  hero?: HeroType | null;
}

export const Hero = ({ categories, onCategoryClick, hero }: HeroProps) => {
  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroImage = hero?.images?.[0] || '/images/hero-bg.jpg';

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative h-screen flex items-center justify-center">
        {/* Single Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={hero?.title ?? 'Handcrafted wooden furniture'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                {hero?.title ?? 'Crafted with Nature'}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 sm:pt-6">
                <Button 
                  size="lg" 
                  onClick={scrollToCategories}
                  className="bg-[hsl(var(--cream))] text-[hsl(var(--charcoal))] hover:bg-[hsl(var(--wood-light))] hover:text-[hsl(var(--charcoal))] transition-all duration-300 text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14 shadow-lg"
                >
                  Explore Collection
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-[hsl(var(--cream))] text-[hsl(var(--cream))] hover:bg-[hsl(var(--cream))]/20 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg px-8 sm:px-10 h-12 sm:h-14"
                  asChild
                >
                  <a href="/about">Learn More</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={scrollToCategories}
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce"
          aria-label="Scroll to categories"
        >
          <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10" />
        </motion.button>
      </div>

      <div id="categories" className="container mx-auto px-4 lg:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted wooden pieces for every space
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={onCategoryClick}
              index={index}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p className="text-lg">No categories available yet. Check back soon!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
