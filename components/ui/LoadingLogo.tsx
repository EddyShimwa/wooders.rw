'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LoadingLogoProps {
  className?: string
  size?: number
  text?: string
}

export function LoadingLogo({ className, size = 100, text = "Crafting excellence..." }: LoadingLogoProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8", className)}>
      <div className="relative">
        {/* Outer glowing rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 -m-8 rounded-full bg-wood-light/20 blur-2xl"
        />
        
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 -m-4 border border-dashed border-wood-light/30 rounded-full"
        />

        {/* Logo Container */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Image
            src="/images/logo.png"
            alt="Wooders"
            width={size}
            height={size}
            priority
            className="h-auto w-auto drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className="flex flex-col items-center space-y-2">
          <motion.p
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[10px] font-black tracking-[0.4em] uppercase text-wood-dark/60"
          >
            {text}
          </motion.p>
          <div className="h-0.5 w-12 bg-wood-light/20 rounded-full overflow-hidden">
            <motion.div
              animate={{
                x: [-48, 48],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-1/2 bg-wood-medium"
            />
          </div>
        </div>
      )}
    </div>
  )
}
