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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-none bg-background rounded-[3rem] p-10 shadow-2xl">
        <DialogHeader className="space-y-4 mb-8">
          <DialogTitle className="text-wood-dark text-4xl font-black tracking-tighter leading-none">
            Become Part of <br /><span className="text-wood-medium/40 font-serif italic text-3xl">The Story</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg font-medium leading-relaxed">
            Your feedback is the heart of our craft. Share your experience and help us continue to elevate spaces across Rwanda.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm onSuccess={onClose} isModal={true} />
      </DialogContent>
    </Dialog>
  )
}
