import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CategoryCard } from "./CategoryCard";
import Image from "next/image";
import { Category } from "@/types/category";
import type { Hero as HeroType } from "@/types/hero";

interface HeroProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  hero?: HeroType | null;
}

export const Hero = ({ categories, onCategoryClick, hero }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const desktopCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hero?.images || hero.images.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (!hero?.images) return prev;
        const next = (prev + 1) % hero.images.length;
        if (mobileCarouselRef.current) {
          const slideWidth = mobileCarouselRef.current.offsetWidth;
          mobileCarouselRef.current.scrollTo({
            left: next * slideWidth,
            behavior: 'smooth'
          });
        }
        if (desktopCarouselRef.current) {
          const slideWidth = desktopCarouselRef.current.offsetWidth;
          desktopCarouselRef.current.scrollTo({
            left: next * slideWidth,
            behavior: 'smooth'
          });
        }
        return next;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [hero?.images, isAutoPlaying]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current || !hero?.images) return;
    const slideWidth = ref.current.offsetWidth;
    const scrollLeft = ref.current.scrollLeft;
    const newSlide = Math.round(scrollLeft / slideWidth);
    if (newSlide !== currentSlide && newSlide < hero.images.length) {
      setCurrentSlide(newSlide);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
     <div className="container mx-auto px-4 lg:px-4 pt-16 lg:pt-24 pb-8 lg:pb-12">
  {/* Mobile Layout */}
  <div className="block lg:hidden">
    {/* Background Carousel with improved height */}
    <div className="relative h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
      {hero?.images && hero.images.length > 0 ? (
        <div
          ref={mobileCarouselRef}
          className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          onScroll={() => handleScroll(mobileCarouselRef)}
          onTouchStart={() => setIsAutoPlaying(false)}
          onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 3000)}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {hero.images.map((img: string, idx: number) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
              <Image
                src={img}
                alt={`${hero?.title ?? 'hero'}-${idx}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <Image
            src={'/images/hero-bg.jpg'}
            alt={hero?.title ?? 'Handcrafted wooden furniture'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}

      {/* Content positioned at bottom for better composition */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-display font-bold text-white leading-tight">
            {hero?.title ?? 'Crafted with Nature'}
          </h1>

          <p className="text-base text-white/95 leading-relaxed max-w-md">
            {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-1"
          >
            <p className="text-sm text-white/85 leading-relaxed">
              {hero?.description ?? 'Each piece tells a story of craftsmanship and natural beauty'}
            </p>
          </motion.div>

          {/* Carousel indicators */}
          {hero?.images && hero.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex gap-1.5 pt-4"
            >
              {hero.images.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (mobileCarouselRef.current) {
                      mobileCarouselRef.current.scrollTo({
                        left: idx * mobileCarouselRef.current.offsetWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-1 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>

    {/* Optional CTA section below hero on mobile */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="mt-6 flex flex-col sm:flex-row gap-3"
    >
      <button className="flex-1 bg-foreground text-background py-3.5 px-6 rounded-xl font-medium hover:bg-foreground/90 transition-colors">
        Explore Collection
      </button>
      <button className="flex-1 border-2 border-foreground/20 text-foreground py-3.5 px-6 rounded-xl font-medium hover:border-foreground/40 hover:bg-foreground/5 transition-colors">
        Learn More
      </button>
    </motion.div>
  </div>

  {/* Desktop Layout - Side-by-side */}
  <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
    {/* Left Section - Text */}
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-6"
    >
      <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight">
        {hero?.title ?? 'Crafted with Nature'}
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
        {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="pt-4"
      >
        <p className="text-lg text-muted-foreground leading-relaxed">
          {hero?.description ?? 'Each piece tells a story of craftsmanship and natural beauty'}
        </p>
      </motion.div>
    </motion.div>

    {/* Right Section - Image Carousel */}
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-elegant">
        {hero?.images && hero.images.length > 0 ? (
          <div className="w-full h-full">
            <div
              ref={desktopCarouselRef}
              className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
              onScroll={() => handleScroll(desktopCarouselRef)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {hero.images.map((img: string, idx: number) => (
                <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                  <Image
                    src={img}
                    alt={`${hero?.title ?? 'hero'}-${idx}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>

            {/* Desktop carousel indicators */}
            {hero.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {hero.images.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (desktopCarouselRef.current) {
                        desktopCarouselRef.current.scrollTo({
                          left: idx * desktopCarouselRef.current.offsetWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'w-10 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <Image
              src={'/images/hero-bg.jpg'}
              alt={hero?.title ?? 'Handcrafted wooden furniture'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </>
        )}
      </div>
    </motion.div>
  </div>
</div>

      {/* Categories Grid */}
      <div className="container mx-auto lg:px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground">
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
