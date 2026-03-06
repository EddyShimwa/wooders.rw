'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types/testimonial'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { Star, Quote, X } from 'lucide-react'
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
          opts={{ align: 'start', loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial._id || testimonial.id}
                className="pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <div
                  className="group relative h-full p-5 rounded-2xl border border-border/60 bg-muted/30 hover:bg-muted/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelected(testimonial)}
                >
                  {/* Quote icon */}
                  <Quote className="h-5 w-5 text-[hsl(var(--wood-light))] mb-3 -scale-x-100" />

                  {/* Photo */}
                  {testimonial.photo && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <Image
                        src={testimonial.photo}
                        alt={`${testimonial.name}\u2019s experience`}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  {/* Feedback */}
                  <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4 mb-4">
                    {testimonial.feedback}
                  </p>

                  {/* Footer: avatar + name + stars */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-[hsl(var(--wood-medium))]/15 text-[hsl(var(--wood-dark))] font-semibold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{testimonial.name}</p>
                        {testimonial.createdAt && (
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(testimonial.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (testimonial.rating || 5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {testimonials.length > 1 && (
            <>
              <CarouselPrevious className="-left-3 h-8 w-8" />
              <CarouselNext className="-right-3 h-8 w-8" />
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
