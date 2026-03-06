"use client"

import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getGeneralInquiryLink } from "@/lib/whatsapp"

export function Footer() {
  return (
    <footer id="contact" className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Wooders"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Crafting beautiful wooden decor that brings warmth and character to your home. Each piece tells a story.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Get in Touch</h3>
            <div className="space-y-3">
              <a
                href={getGeneralInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 32 32" className="w-4 h-4 fill-[#25D366]">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z"/>
                  </svg>
                </div>
                <span>Chat on WhatsApp</span>
              </a>
              <a href="mailto:woodersrwanda@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span>woodersrwanda@gmail.com</span>
              </a>
              <a href="tel:+250780609878" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+250 780 609 878</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/delivery" className="text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <p className="text-muted-foreground text-sm text-center">
            &copy; {new Date().getFullYear()} Wooders Rwanda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
