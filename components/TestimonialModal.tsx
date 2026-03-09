'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TestimonialForm } from '@/components/TestimonialForm'

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TestimonialModal({ isOpen, onClose }: TestimonialModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-[hsl(var(--wood-light))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--wood-dark))] text-xl">Share Your Feedback</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We would love to hear about your experience with our products. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm onSuccess={onClose} isModal={true} />
      </DialogContent>
    </Dialog>
  )
}
