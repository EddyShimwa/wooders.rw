"use client"

import { Mail, Phone, MapPin, Instagram, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer id="contact" className="bg-wood-dark text-white overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-wood-light/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 lg:px-10 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo + Brand */}
          <div className="space-y-6">
            <Image
              src="/images/logo.png"
              alt="Wooders"
              width={120}
              height={80}
              className="h-12 lg:h-14 w-auto object-contain"
            />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs font-medium">
              Handcrafted wood products for homes and businesses across Rwanda.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/wooders_rw?igsh=MTN5Zmo5YTk4bXJvdQ==" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-wood-light hover:border-wood-light transition-all duration-300 group" aria-label="Instagram">
                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-normal tracking-[0.2em] uppercase text-wood-light">Navigation</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/collection" className="text-[13px] font-normal text-white/70 hover:text-white transition-colors">Collection</Link>
              <Link href="/#about" className="text-[13px] font-normal text-white/70 hover:text-white transition-colors">About</Link>
              <Link href="/#testimonials" className="text-[13px] font-normal text-white/70 hover:text-white transition-colors">Customer Reviews</Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-normal tracking-[0.2em] uppercase text-wood-light">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:woodersrwanda@gmail.com" className="group flex items-center gap-3 text-[13px] font-normal text-white/70 hover:text-white transition-colors">
                <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-wood-light/20 transition-colors">
                  <Mail className="h-3 w-3" />
                </div>
                woodersrwanda@gmail.com
              </a>
              <a href="tel:+250780609878" className="group flex items-center gap-3 text-[13px] font-normal text-white/70 hover:text-white transition-colors">
                <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-wood-light/20 transition-colors">
                  <Phone className="h-3 w-3" />
                </div>
                +250 780 609 878
              </a>
              <div className="flex items-center gap-3 text-[13px] font-normal text-white/70">
                <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="h-3 w-3" />
                </div>
                Kigali, Rwanda
              </div>
            </div>
          </div>

          {/* Newsletter / Call to Action */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-normal tracking-[0.2em] uppercase text-wood-light">Need Help Choosing?</h4>
            <p className="text-[13px] text-white/50 font-normal">Message us and we&apos;ll help you pick the right piece for your space.</p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 group text-[11px] font-normal tracking-widest uppercase text-wood-light hover:text-white transition-colors"
            >
              Back to top
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-[11px] font-normal tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Wooders Rwanda. Made by local artisans.
          </p>
          <div className="flex items-center gap-8 text-white/20 text-[10px] font-normal tracking-[0.2em] uppercase">
            <span>Made in Rwanda</span>
            <span>Built to Last</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
