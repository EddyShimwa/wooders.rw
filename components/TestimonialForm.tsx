'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { submitTestimonial, fileToBase64 } from '@/lib/api/testimonialService'
import { Loader2, Upload, Star, X } from 'lucide-react'
import { motion } from 'framer-motion'

const MAX_FEEDBACK_LENGTH = 500

const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional().or(z.literal('')),
  email: z.string().email({ message: 'Please enter a valid email' }).optional().or(z.literal('')),
  rating: z.number().min(1, { message: 'Please select a rating' }).max(5),
  feedback: z.string()
    .min(10, { message: 'Feedback must be at least 10 characters' })
    .max(MAX_FEEDBACK_LENGTH, { message: `Feedback must not exceed ${MAX_FEEDBACK_LENGTH} characters` }),
  photo: z.instanceof(File).optional(),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

interface TestimonialFormProps {
  onSuccess?: () => void
  isModal?: boolean
}

export function TestimonialForm({ onSuccess, isModal = false }: TestimonialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 0,
      feedback: '',
      photo: undefined,
    },
  })

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true)
    try {
      let photoBase64: string | undefined

      if (values.photo) {
        photoBase64 = await fileToBase64(values.photo)
      }

      await submitTestimonial({
        name: values.name || 'Anonymous Collector',
        email: values.email || '',
        rating: values.rating,
        feedback: values.feedback,
        photo: photoBase64,
      })

      toast.success('Thank you! Your story has been shared.')
      form.reset()
      setPhotoPreview(null)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit'
      toast.error('Submission failed', { description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      form.setValue('photo', file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black tracking-widest uppercase text-wood-medium/60">Your Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter name (or leave anonymous)" 
                    {...field} 
                    disabled={isSubmitting} 
                    className="rounded-xl border-border/50 focus:border-wood-light focus:ring-wood-light/10 h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black tracking-widest uppercase text-wood-medium/60">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-xl border-border/50 focus:border-wood-light focus:ring-wood-light/10 h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-[10px] font-black tracking-widest uppercase text-wood-medium/60 text-center block">Rate Your Experience</FormLabel>
              <FormControl>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="transition-all hover:scale-125 group active:scale-90"
                    >
                      <Star
                        className={`h-8 w-8 transition-all duration-300 ${
                          star <= (hoveredStar || field.value)
                            ? 'fill-wood-light text-wood-light filter drop-shadow-[0_0_8px_rgba(var(--wood-light-rgb),0.3)]'
                            : 'text-border group-hover:text-wood-light/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black tracking-widest uppercase text-wood-medium/60">Your Story</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Describe the craftsmanship, the feeling in your space..."
                    rows={6}
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-2xl border-border/50 focus:border-wood-light focus:ring-wood-light/10 p-5 font-serif italic text-lg leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground/40 tracking-widest uppercase">
                    {field.value?.length || 0} / {MAX_FEEDBACK_LENGTH}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={() => (
            <FormItem>
              <FormLabel className="text-[10px] font-black tracking-widest uppercase text-wood-medium/60">Share a Masterpiece (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isSubmitting}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 cursor-pointer group-hover:bg-muted/30 group-hover:border-wood-light/30 transition-all duration-500"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-wood-light transition-colors" />
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-wood-dark">Click to upload product photo</span>
                    </label>
                  </div>
                  {photoPreview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
                    >
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => { setPhotoPreview(null); form.setValue('photo', undefined) }}
                        className="absolute top-4 right-4 h-10 w-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-16 rounded-2xl bg-wood-dark hover:bg-wood-medium text-white font-black tracking-[0.2em] uppercase shadow-2xl shadow-wood-dark/20 transition-all duration-500 hover:scale-[1.02] active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            'Publish Your Story'
          )}
        </Button>
      </form>
    </Form>
  )
}
