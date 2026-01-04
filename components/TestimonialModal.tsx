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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            We would love to hear about your experience with our products. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm onSuccess={onClose} isModal={true} />
      </DialogContent>
    </Dialog>
  )
}
