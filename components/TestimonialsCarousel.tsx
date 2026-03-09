'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types/testimonial'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Star, Quote, X, ImageIcon } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { AnimatePresence, motion } from 'framer-motion'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  isLoading?: boolean
}

export function TestimonialsCarousel({ testimonials, isLoading = false }: TestimonialsCarouselProps) {
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<Testimonial | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center text-sm text-muted-foreground">Loading testimonials...</div>
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) return null

  return (
    <>
      <div className="w-full">
        <Carousel
          opts={{ align: 'center', loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial._id || testimonial.id}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 my-4"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-full p-6 sm:p-8 rounded-3xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Avatar + Name + Role */}
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-10 w-10 mb-4 ring-4 ring-[hsl(var(--wood-light))]/20">
                      <AvatarFallback className="text-xl bg-[hsl(var(--wood-light))]/20 text-[hsl(var(--wood-dark))] font-bold">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground">{testimonial.name}</h3>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-4 ${
                          i < (testimonial.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-xs sm:text-base leading-relaxed text-foreground/80 text-center line-clamp-4 mb-5">
                    &ldquo;{testimonial.feedback}&rdquo;
                  </p>

                  {/* View Image Button */}
                  {testimonial.photo && (
                    <button
                      onClick={() => setSelected(testimonial)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[hsl(var(--wood-light))]/10 hover:bg-[hsl(var(--wood-light))]/20 text-[hsl(var(--wood-dark))] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <ImageIcon className="h-4 w-4" />
                      View Product Photo
                    </button>
                  )}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {testimonials.length > 1 && (
            <>
              <CarouselPrevious className="-left-12 h-10 w-10 hidden sm:flex" />
              <CarouselNext className="-right-12 h-10 w-10 hidden sm:flex" />
            </>
          )}
        </Carousel>
      </div>

      {/* Expanded testimonial modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Photo */}
              {selected.photo && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={selected.photo}
                    alt={`${selected.name}\u2019s experience`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (selected.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-border'
                      }`}
                    />
                  ))}
                </div>

                {/* Full feedback */}
                <p className="text-sm sm:text-base leading-relaxed text-foreground/85">
                  &ldquo;{selected.feedback}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-[hsl(var(--wood-medium))]/15 text-[hsl(var(--wood-dark))] font-semibold">
                      {selected.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{selected.name}</p>
                    {selected.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
