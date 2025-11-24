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

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative h-screen flex items-center justify-center">
  <div className="absolute inset-0 block lg:hidden min-h-screen">
    {hero?.images && hero.images.length > 0 ? (
      <div
        ref={mobileCarouselRef}
        className="flex h-full w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        onScroll={() => handleScroll(mobileCarouselRef)}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 3000)}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {hero.images.map((img: string, idx: number) => (
          <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
            <Image
              src={img}
              alt={`${hero?.title ?? 'hero'}-${idx}`}
              fill
              className="object-cover object-center"
              priority={idx === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>
    ) : (
      <>
        <Image
          src={'/images/hero-bg.jpg'}
          alt={hero?.title ?? 'Handcrafted wooden furniture'}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </>
    )}


    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {hero?.title ?? 'Crafted with Nature'}
          </h1>

          <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
            {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={scrollToCategories}
              className="bg-white text-black hover:bg-white/90 text-base px-8"
            >
              Explore Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-base px-8"
              asChild
            >
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>

    {hero?.images && hero.images.length > 1 && (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
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
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    )}

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={scrollToCategories}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce"
      aria-label="Scroll to categories"
    >
      <ChevronDown className="h-8 w-8" />
    </motion.button>
  </div>

  <div className="absolute inset-0 hidden lg:block">
    {hero?.images && hero.images.length > 0 ? (
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
            <div className="absolute inset-0 bg-black/40" />
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
        <div className="absolute inset-0 bg-black/40" />
      </>
    )}

    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            {hero?.title ?? 'Crafted with Nature'}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            {hero?.subtitle ?? 'Handcrafted wooden furniture and décor that brings warmth and artistry to your space'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={scrollToCategories}
              className="bg-white text-black hover:bg-white/90 text-lg px-10 h-14"
            >
              Explore Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 h-14"
              asChild
            >
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>

    {hero?.images && hero.images.length > 1 && (
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-2">
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
                ? 'w-12 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    )}

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={scrollToCategories}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce"
      aria-label="Scroll to categories"
    >
      <ChevronDown className="h-10 w-10" />
    </motion.button>
  </div>
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
