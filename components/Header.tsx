'use client'

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import { getGeneralInquiryLink } from "@/lib/whatsapp"

const NAV_ITEMS = [
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current !== null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20)
        rafIdRef.current = null
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''))
    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.4, 0.6],
      }
    )

    sectionEls.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback((href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/70 backdrop-blur-xl border-b border-border/40 py-3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative z-10 group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Wooders"
                  width={70}
                  height={50}
                  priority
                  className={`h-10 lg:h-12 w-auto transition-all duration-500 ${isScrolled ? '' : 'brightness-0 invert'}`}
                />
              </motion.div>
            </button>

            <nav className="hidden md:flex items-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`relative px-6 py-2 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 rounded-full ${
                    activeSection === item.href.replace('#', '')
                      ? isScrolled
                        ? 'bg-wood-dark text-white shadow-lg shadow-wood-dark/10'
                        : 'bg-white text-wood-dark shadow-xl'
                      : isScrolled
                        ? 'text-muted-foreground hover:text-foreground'
                        : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a
                href={getGeneralInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-500 hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'bg-wood-light text-white shadow-lg shadow-wood-light/20 hover:bg-wood-medium'
                    : 'bg-white text-wood-dark shadow-2xl hover:bg-cream'
                }`}
              >
                Order Bespoke
              </a>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden rounded-2xl ${!isScrolled ? 'text-white hover:bg-white/10' : 'bg-muted/50'}`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-wood-dark/90 backdrop-blur-md md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex flex-col items-center justify-center h-full gap-8">
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    onClick={() => scrollTo(item.href)}
                    className="text-3xl font-black text-white tracking-tighter hover:text-wood-light transition-colors"
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-8"
                >
                  <a
                    href={getGeneralInquiryLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 bg-wood-light text-white rounded-2xl font-black tracking-widest uppercase shadow-2xl shadow-wood-light/20"
                  >
                    Contact Us
                  </a>
                </motion.div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-10 w-10" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
