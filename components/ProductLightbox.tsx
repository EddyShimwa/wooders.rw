'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Product } from '@/types/product'
import { getProductOrderLink } from '@/lib/whatsapp'

interface ProductLightboxProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  allProducts?: Product[]
  onNavigate?: (product: Product) => void
}

export function ProductLightbox({ product, isOpen, onClose, allProducts = [], onNavigate }: ProductLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!product) return null

  const currentIndex = allProducts.findIndex(p => p.id === product.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allProducts.length - 1

  const goToPrev = () => {
    if (hasPrev && onNavigate) {
      setImageLoaded(false)
      onNavigate(allProducts[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (hasNext && onNavigate) {
      setImageLoaded(false)
      onNavigate(allProducts[currentIndex + 1])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close product viewer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation arrows */}
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev() }}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next product"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Content */}
          <motion.div
            key={product.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl mx-4 flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden bg-white/5">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 100vw, 900px"
                priority
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Product info + WhatsApp CTA */}
            <div className="text-center space-y-3 w-full max-w-lg">
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">{product.name}</h3>
              {product.price && (
                <p className="text-lg font-black tracking-tighter text-white">
                  <span className="text-[10px] text-white/50 mr-1.5 font-bold">RWF</span>
                  {product.price.toLocaleString()}
                </p>
              )}
              {product.category && (
                <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">{product.category}</p>
              )}
              {product.description && (
                <p className="text-white/70 text-[13px] font-medium leading-relaxed line-clamp-2">{product.description}</p>
              )}
              <a
                href={getProductOrderLink(product.name, product.category)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full font-bold text-sm tracking-tight transition-colors mt-2"
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                </svg>
                Order on WhatsApp
              </a>
            </div>

            {/* Counter */}
            {allProducts.length > 1 && (
              <p className="text-white/40 text-xs">
                {currentIndex + 1} / {allProducts.length}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
