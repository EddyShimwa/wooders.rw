'use client'

import { TestimonialForm } from '@/components/TestimonialForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function TestimonialPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
            <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
            <CardDescription>
              We would love to hear about your experience with our products.
              Your feedback helps us improve!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestimonialForm
              onSuccess={() => {
                setTimeout(() => {
                  router.push('/')
                }, 2000)
              }}
            />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Thank you for being a valued customer! 🙏</p>
        </div>
      </div>
    </div>
  )
}
