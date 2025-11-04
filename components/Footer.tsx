"use client"

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/images/logo.png"
                alt="Wooders"
                width={32}
                height={32}
                unoptimized
                className="h-8 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting beautiful wooden décor that brings warmth and character to your home.
              Each piece tells a story of craftsmanship and natural beauty.
            </p>
          </div>

          {/* Quick Links + Contact (mobile: two columns) */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About Us
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Admin
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-foreground">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>info@woodersrwanda.rw</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+2507811111111</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Kigali Rwanda</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} Wooders Rwanda. All rights reserved.
            </p>
            
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center md:justify-end">
              <Link href="/privacy" className="hover:text-foreground transition-colors text-muted-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors text-muted-foreground">
                Terms of Service
              </Link>
              <Link href="/delivery" className="hover:text-foreground transition-colors text-muted-foreground">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}