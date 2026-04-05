'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import { Testimonial } from '@/types/testimonial'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Star, Quote, X, ImageIcon, Calendar } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  isLoading?: boolean
}

const TestimonialCard = memo(({ 
  testimonial, 
  index, 
  onSelect 
}: { 
  testimonial: Testimonial, 
  index: number, 
  onSelect: (t: Testimonial) => void 
}) => {
  const isLarge = useMemo(() => !!(testimonial.feedback.length > 150 || testimonial.photo), [testimonial.feedback.length, testimonial.photo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: Math.min(index * 0.1, 0.5), 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -10 }}
      onClick={() => testimonial.photo && onSelect(testimonial)}
      className={`relative group cursor-pointer ${
        isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
      } rounded-[3rem] bg-background/60 backdrop-blur-md border border-border/40 p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:sculpted transition-all duration-700 ease-out`}
    >
      {/* Decorative wood grain background (simulated) */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-wood-light/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-wood-light/10 transition-colors duration-700" />
      
      <div className="relative z-10 space-y-8">
        {/* Header: Stars & Name */}
        <div className="flex items-start justify-between">
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  testimonial.rating > i
                    ? 'fill-wood-light text-wood-light drop-shadow-[0_0_8px_rgba(var(--wood-light-rgb),0.2)]'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <Quote className="h-10 w-10 text-wood-light/10 group-hover:text-wood-light/20 transition-colors duration-700" />
        </div>

        {/* Feedback */}
        <p className={`font-serif italic text-wood-dark leading-relaxed tracking-tight ${
          isLarge ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          &ldquo;{testimonial.feedback}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-5 pt-6 border-t border-wood-light/5">
          <Avatar className="h-14 w-14 border-2 border-wood-light/10 group-hover:border-wood-light/30 transition-all duration-700 sculpted">
            <AvatarFallback className="bg-wood-light/5 text-wood-dark font-black text-sm tracking-tighter">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-[0.2em] uppercase text-wood-dark">{testimonial.name}</span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-wood-medium/40 mt-1">Verified Collector</span>
          </div>
        </div>
      </div>

      {/* Product Image Preview if exists */}
      {testimonial.photo && (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
          <Image
            src={testimonial.photo}
            alt=""
            fill
            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
          />
        </div>
      )}

      {testimonial.photo && (
        <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <div className="bg-wood-light text-white p-2.5 rounded-xl shadow-xl">
             <ImageIcon className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  )
})

TestimonialCard.displayName = 'TestimonialCard';

export function TestimonialsCarousel({ testimonials, isLoading = false }: TestimonialsCarouselProps) {
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<Testimonial | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-[2.5rem] bg-muted/50 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) return null

  return (
    <>
      <div className="w-full">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 auto-rows-min">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard 
              key={testimonial._id || testimonial.id} 
              testimonial={testimonial} 
              index={idx}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Photo Viewer */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-wood-dark/95 backdrop-blur-2xl"
              onClick={() => setSelected(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-6xl grid lg:grid-cols-5 gap-0 bg-background rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Area */}
              <div className="lg:col-span-3 relative aspect-square lg:aspect-auto bg-muted">
                {selected.photo && (
                  <Image
                    src={selected.photo}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="60vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                   <p className="text-sm font-bold tracking-[0.2em] uppercase opacity-70 mb-2">Customer Shared Image</p>
                   <p className="text-3xl font-black tracking-tighter">Verified Wooders Excellence</p>
                </div>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${selected.rating > i ? 'fill-wood-light text-wood-light' : 'text-border'}`} />
                      ))}
                    </div>
                    <button onClick={() => setSelected(null)} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <Quote className="h-12 w-12 text-wood-light" />
                    <p className="font-serif italic text-2xl md:text-3xl text-wood-dark leading-tight">
                      &ldquo;{selected.feedback}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-12 border-t border-border flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-wood-light/20">
                    <AvatarFallback className="text-xl bg-wood-light/10 text-wood-dark font-black">
                      {selected.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-black tracking-widest uppercase text-wood-dark">{selected.name}</p>
                    <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-wood-medium/60 mt-1">
                       <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />Collector since 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
