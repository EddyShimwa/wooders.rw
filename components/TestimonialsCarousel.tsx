'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types/testimonial'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  isLoading?: boolean
}

export function TestimonialsCarousel({ testimonials, isLoading = false }: TestimonialsCarouselProps) {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 max-w-7xl mx-auto items-center py-12 px-6 md:px-12 animate-pulse">
        {/* Left: Timeline Skeleton */}
        <div className="relative w-full md:w-1/3 xl:w-1/4 ml-4 md:ml-12">
          <div className="absolute left-[24px] top-[56px] bottom-[56px] w-[100px] pointer-events-none stroke-muted -translate-x-full -z-10">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
              <path d="M100,0 Q-20,50 100,100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="relative z-10 space-y-12 py-8">
            {[...Array(3)].map((_, idx) => {
              const progress = idx / 2;
              const curveOffset = -240 * progress * (1 - progress);
              return (
                <div key={idx} style={{ transform: `translateX(${curveOffset}px)` }} className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-full border-2 border-transparent bg-muted shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Featured Testimonial Skeleton */}
        <div className="w-full md:w-2/3 xl:w-3/4 min-h-[300px] flex items-center relative">
          <Quote className="absolute -top-8 -left-8 h-24 w-24 text-muted/20 -z-10 rotate-180" />
          <div className="flex flex-col lg:flex-row gap-12 items-center w-full">
            <div className="space-y-8 flex-1 w-full">
              <div className="space-y-4">
                <div className="h-8 md:h-12 w-full bg-muted rounded-lg" />
                <div className="h-8 md:h-12 w-5/6 bg-muted rounded-lg" />
                <div className="h-8 md:h-12 w-4/6 bg-muted rounded-lg" />
              </div>
              <div className="pt-8 border-t border-muted/20 flex items-center justify-between">
                <div className="space-y-2">
                   <div className="h-4 w-32 bg-muted rounded" />
                   <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-10 w-28 bg-muted rounded-full" />
              </div>
            </div>
            <div className="relative w-full max-w-[300px] aspect-square rounded-2xl bg-muted shrink-0" />
          </div>
        </div>
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-24 px-6 text-center space-y-6">
        <div className="bg-muted/30 p-6 rounded-full">
          <Quote className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-brand font-medium text-wood-dark">No reviews yet</h3>
          <p className="text-muted-foreground text-sm">We are actively gathering beautiful feedback from our customers. Check back soon for their stories!</p>
        </div>
      </div>
    )
  }

  const activeTestimonial = testimonials[activeIndex]

  const n = testimonials.length;
  let visibleIndices: number[] = [];
  if (n <= 4) {
    visibleIndices = Array.from({ length: n }, (_, i) => i);
  } else {
    visibleIndices = [
      (activeIndex - 1 + n) % n,
      activeIndex,
      (activeIndex + 1) % n,
      (activeIndex + 2) % n
    ];
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 max-w-7xl mx-auto items-center py-12 px-6 md:px-12">
      {/* Left: Timeline */}
      <div className="relative w-full md:w-1/3 xl:w-1/4 ml-4 md:ml-12">
        {/* Curved Timeline SVG Background */}
        <div className="absolute left-[24px] top-[56px] bottom-[56px] w-[100px] pointer-events-none stroke-[#6B4423] -translate-x-full -z-10">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
            <path d="M100,0 Q-20,50 100,100" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className="relative z-10 space-y-12 py-8">
          {visibleIndices.map((actualIdx, visualIdx) => {
            const testimonial = testimonials[actualIdx];
            const isActive = actualIdx === activeIndex;
            const progress = visibleIndices.length > 1 ? visualIdx / (visibleIndices.length - 1) : 0.5;
            const curveOffset = -240 * progress * (1 - progress);

            return (
              <div
                key={testimonial._id || testimonial.id || actualIdx}
                onClick={() => setActiveIndex(actualIdx)}
                style={{ transform: `translateX(${curveOffset}px)` }}
                className="flex items-center gap-6 cursor-pointer group transition-all duration-300 will-change-transform"
              >
                <div
                  className={`relative shrink-0 rounded-full transition-all duration-500 overflow-visible bg-background ${
                    isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                  }`}
                >
                  <Avatar className={`h-12 w-12 border-2 transition-all duration-300 shadow-sm relative z-10 ${
                    isActive ? 'border-green-600 shadow-lg shadow-green-600/20 opacity-100' : 'border-transparent opacity-40 group-hover:opacity-75'
                  }`}>
                    {testimonial.photo && (
                      <div className="absolute inset-0 z-0">
                         <Image 
                           src={testimonial.photo} 
                           alt={testimonial.name} 
                           fill 
                           className="object-cover rounded-full" 
                           sizes="48px"
                         />
                      </div>
                    )}
                    <AvatarFallback className="bg-wood-dark text-white font-normal text-sm">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute -inset-1.5 rounded-full border border-green-600/40 -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                
                <div className={`flex flex-col transform transition-all duration-300 group-hover:translate-x-2 ${
                  isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-75'
                }`}>
                  <span className="font-normal text-sm tracking-wide text-wood-dark">
                    {testimonial.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="flex gap-0.5">
                      <Star className="h-3 w-3 fill-green-600 text-green-600" />
                      <span className="text-xs font-normal text-green-600/80">{(testimonial.rating || 5).toFixed(1)}</span>
                     </div>
                     <span className="text-[10px] text-wood-dark/50 font-normal">
                       {new Date(testimonial.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                     </span>
                  </div>
                  {testimonial.product && (
                    <span className="text-[10px] font-normal text-wood-dark/40 mt-1 truncate max-w-[120px] block">
                      {testimonial.product} 
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Featured Testimonial */}
      <div className="w-full md:w-2/3 xl:w-3/4 min-h-[300px] flex items-center relative">
        <Quote className="absolute top-12 -left-8 h-18 w-18 text-wood-light/90 -z-10 rotate-180" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col lg:flex-row gap-12 items-center w-full"
          >
            <div className="space-y-2 flex-1">
              <p className="font-brand italic text-xl md:text-2xl lg:text-3xl text-wood-dark leading-tight tracking-tight">
                &ldquo;{activeTestimonial.feedback}&rdquo;
              </p>
              
              <div className="pt-2 border-t border-wood-light/20 flex items-center justify-between">
                <div>
                   <span className="block font-normal text-sm tracking-[0.2em] uppercase text-wood-dark">
                     {activeTestimonial.name}
                   </span>
                   {activeTestimonial.product && (
                     <span className="block text-[10px] font-normal tracking-[0.2em] uppercase text-wood-dark/40 mt-1">
                       Purchased: {activeTestimonial.product}
                     </span>
                   )}
                </div>
                <div className="flex gap-1 bg-wood-light/5 px-4 py-2 rounded-full border border-wood-light/10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        (activeTestimonial.rating || 5) > i
                          ? 'fill-green-600 text-green-600'
                          : 'text-wood-dark/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {activeTestimonial.photo && (
              <div className="flex flex-col items-center justify-center gap-4 shrink-0 mt-6 lg:mt-0">
                <div className="relative w-full min-w-[200px] md:min-w-[250px] max-w-[300px] aspect-square rounded-2xl overflow-hidden shadow-xl group">
                  <Image
                    src={activeTestimonial.photo}
                    alt={`Product from ${activeTestimonial.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 300px, (max-width: 1024px) 250px, 300px"
                  />
                </div>
                {activeTestimonial.product && (
                   <span className="text-xs font-normal tracking-[0.2em] uppercase text-wood-dark/60 text-center">
                     {activeTestimonial.product}
                   </span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
