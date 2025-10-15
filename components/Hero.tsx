'use client'

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CategoryCard } from "./CategoryCard";
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
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="block lg:hidden relative min-h-[70vh]">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-elegant"
          >
            {hero?.images && hero.images.length > 0 ? (
              <div className="w-full h-full">
                <div className="h-full w-full">
                  <div
                    ref={mobileCarouselRef}
                    className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                    onScroll={() => handleScroll(mobileCarouselRef)}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {hero.images.map((img: string, idx: number) => (
                      <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                        <img
                          src={img}
                          alt={`${hero?.title ?? 'hero'}-${idx}`}
                          className="w-full h-full object-cover"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                         <div className="bg-white/10 backdrop-blur-md absolute bottom-0 left-0 right-0 p-2 flex justify-center">
                          <img
                            src="/images/logo.png"
                            alt="Wooders Logo"
                            className="h-10 w-auto opacity-95 drop-shadow-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Carousel Indicators - Hidden */}
                  {/* {hero.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {hero.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentSlide
                              ? 'bg-white scale-125'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )} */}
                </div>
              </div>
            ) : (
              <>
                <img
                  src={'/images/hero-bg.jpg'}
                  alt={hero?.title ?? 'Handcrafted wooden furniture'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
                                  {/* Blur gradient and logo overlay for fallback */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                <div className="bg-white/20 backdrop-blur-md absolute bottom-0 left-0 right-0 p-6 flex justify-center rounded-t-lg">
                  <img
                    src="/images/logo.png"
                    alt="Wooders Logo"
                    className="h-10 w-auto opacity-95 drop-shadow-lg"
                  />
                </div>
              </>
            )}

            {/* Text Overlay for Mobile */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center space-y-4 px-6"
              >
              <h1 className="text-2xl md:text-4xl font-display font-bold text-white drop-shadow-lg">
                {hero?.title ?? 'Crafted with Nature'}
              </h1>

              <p className="text-base md:text-lg text-white/90 drop-shadow-md max-w-lg mx-auto">
                {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
              </p>

              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="pt-2"
                >
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    {hero?.description ?? 'Each piece tells a story of craftsmanship and natural beauty'}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left Section - Text */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
              {hero?.title ?? 'Crafted with Nature'}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
              {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4"
            >
              <p className="text-lg text-muted-foreground">
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
                  <div className="h-full w-full">
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
                          <img
                            src={img}
                            alt={`${hero?.title ?? 'hero'}-${idx}`}
                            className="w-full h-full object-cover"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        {/* Blur gradient and logo overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
                          <div className="bg-white/10 backdrop-blur-md absolute bottom-0 left-0 right-0 p-2 flex justify-center">
                            <img
                              src="/images/logo.png"
                              alt="Wooders Logo"
                              className="h-10 w-auto opacity-95 drop-shadow-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carousel Indicators - Hidden */}
                    {/* {hero.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {hero.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              idx === currentSlide
                                ? 'bg-white scale-125'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )} */}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={'/images/hero-bg.jpg'}
                    alt={hero?.title ?? 'Handcrafted wooden furniture'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-hero" />
                {/* Blur gradient and logo overlay for fallback */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
                  <div className="bg-white/10 backdrop-blur-md absolute bottom-0 left-0 right-0 p-6 flex justify-center">
                    <img
                      src="/images/logo.png"
                      alt="Wooders Logo"
                      className="h-10 w-auto opacity-95 drop-shadow-lg"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 pb-20">
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
