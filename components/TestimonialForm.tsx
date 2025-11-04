'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { submitTestimonial, fileToBase64 } from '@/lib/api/testimonialService'
import { Loader2, Upload, Star } from 'lucide-react'

const MAX_FEEDBACK_LENGTH = 100

const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
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
        name: values.name,
        email: values.email,
        rating: values.rating,
        feedback: values.feedback,
        photo: photoBase64,
      })

      toast.success('Thank you! Your testimonial has been submitted for review.')
      form.reset()
      setPhotoPreview(null)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit testimonial'
      toast.error('Failed to submit testimonial', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      form.setValue('photo', file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} disabled={isSubmitting} />
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
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>We'll use this to contact you if needed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating *</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredStar || field.value)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>How would you rate your experience?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your experience with us. What did you love about our products?"
                    rows={5}
                    {...field}
                    disabled={isSubmitting}
                    maxLength={MAX_FEEDBACK_LENGTH}
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Minimum 10 characters</span>
                    <span>{field.value?.length || 0}/{MAX_FEEDBACK_LENGTH}</span>
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
              <FormLabel>Photo (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {photoPreview && (
                    <div className="relative w-full">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-64 rounded-lg object-cover border-2 border-border"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Share a photo of your experience with our products (Max 5MB)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
        </Button>
      </form>
    </Form>
  )
}
