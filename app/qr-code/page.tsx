'use client'

import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function QRCodePage() {

  const router = useRouter()

  // if (adminQuery.isLoading) {
  //   return <div className="container mx-auto py-12">Checking credentials...</div>
  // }

  // if (adminQuery.isError) {
  //   return null
  // }

  const testimonialUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/testimonials`

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-xl">
        <Card className="overflow-hidden border-2 shadow-2xl backdrop-blur-sm bg-card/95 transition-all duration-300 hover:shadow-3xl">
          <div className="p-3 sm:p-4 pb-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()} 
              className="hover:scale-105 transition-transform duration-200 text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Go Back Home
            </Button>
          </div>
          
          <CardHeader className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6 pb-3 sm:pb-4 pt-1 sm:pt-2">
            <div className="flex justify-center mb-1">
              <Image
                src="/images/logo.png"
                alt="Wooders Logo"
                width={160}
                height={80}
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tell Us Your Story!
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground">
              How was your experience? We would love to hear from you!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6 p-4 sm:p-6 pt-2 sm:pt-4">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75 group-hover:opacity-100"></div>
              <div className="relative">
                <QRCodeGenerator url={testimonialUrl} size={220} />
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2 sm:space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1.5">Direct Link:</p>
                <code className="text-xs bg-muted/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg block break-all hover:bg-muted transition-colors duration-200 border border-border/50">
                  {testimonialUrl}
                </code>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    navigator.clipboard.writeText(testimonialUrl)
                  }}
                >
                  📋 Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs transition-all duration-200 hover:scale-105"
                  onClick={() => window.open(testimonialUrl, '_blank')}
                >
                  🔗 Open Link
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground max-w-sm leading-relaxed">
              Anyone who scans this code will be able to submit their testimonial directly
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
