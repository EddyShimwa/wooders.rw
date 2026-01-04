'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types/testimonial'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback} from '@/components/ui/avatar'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  isLoading?: boolean
}

export function TestimonialsCarousel({ testimonials, isLoading = false }: TestimonialsCarouselProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">Loading testimonials...</div>
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <div className="w-full px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial._id || testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">
                  <div>
                    {testimonial.photo && (
                      <div className="mb-4 -mt-6 -mx-6">
                        <Image
                          src={testimonial.photo}
                          alt={`${testimonial.name}\u2019s experience`}
                          width={800}
                          height={192}
                          className="w-full h-48 object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < (testimonial.rating || 5) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-5">
                      &ldquo;{testimonial.feedback}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {testimonials.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  )
}
