"use client"

import { Mail, Phone, MapPin, Instagram, ArrowUpRight } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 md:py-10">
        {/* Top: logo + nav + contact — all inline on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8 text-center md:text-left">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Wooders"
              width={36}
              height={36}
              unoptimized
              className="h-10 w-auto"
            />
            <p className="text-background/50 text-xs max-w-[200px] leading-relaxed">
              Handcrafted wooden decor. Made in Rwanda.
            </p>
          </div>

          {/* Navigate */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-background/40">Navigate</h4>
            <nav className="flex gap-3 justify-center md:justify-start">
              <a href="#collection" className="text-xs text-background/70 hover:text-background transition-colors">Collection</a>
              <a href="#about" className="text-xs text-background/70 hover:text-background transition-colors">About</a>
              <a href="#testimonials" className="text-xs text-background/70 hover:text-background transition-colors">Testimonials</a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-background/40">Contact</h4>
            <div className="flex flex-col gap-1.5 items-center md:items-start">
              <a href="mailto:woodersrwanda@gmail.com" className="text-xs text-background/70 hover:text-background transition-colors flex items-center gap-1.5">
                <Mail className="h-3 w-3 flex-shrink-0" />
                woodersrwanda@gmail.com
              </a>
              <a href="tel:+250780609878" className="text-xs text-background/70 hover:text-background transition-colors flex items-center gap-1.5">
                <Phone className="h-3 w-3 flex-shrink-0" />
                +250 780 609 878
              </a>
              <div className="flex gap-1.5 items-center">
                <MapPin className="h-3 w-3 flex-shrink-0 text-background/70" />
                <span className="text-xs text-background/70">Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          {/* Social + back to top */}
          <div className="flex items-center justify-center md:justify-end gap-2 shrink-0">
            <a href="https://www.instagram.com/wooders_rw?igsh=MTN5Zmo5YTk4bXJvdQ==" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-background/15 flex items-center justify-center hover:bg-background/10 transition-colors" aria-label="Instagram">
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={scrollToTop}
              className="h-8 w-8 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-background/40 text-[11px]">
            &copy; {new Date().getFullYear()} Wooders Rwanda
          </p>
          <p className="text-background/30 text-[11px]">
            Handcrafted with care in Kigali
          </p>
        </div>
      </div>
    </footer>
  )
}
