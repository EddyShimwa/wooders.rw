"use client"

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
  <div className="grid md:grid-cols-4 gap-y-6 md:gap-x-8 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-4">
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

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2 items-center md:items-start">
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
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>info@woodersrwanda.rw</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>+2507811111111</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>Kigali Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - evenly distributed */}
  <div className="border-t border-border mt-8 pt-8 grid grid-cols-1 md:grid-cols-4 items-center gap-y-4 md:gap-x-8">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Wooders Rwanda. All rights reserved.
            </p>
          </div>

          <div className="text-center">
            <Link href="/privacy" className="hover:text-foreground transition-colors text-sm text-muted-foreground">
              Privacy Policy
            </Link>
          </div>

          <div className="text-center">
            <Link href="/terms" className="hover:text-foreground transition-colors text-sm text-muted-foreground">
              Terms of Service
            </Link>
          </div>

          <div className="text-center">
            <Link href="/delivery" className="hover:text-foreground transition-colors text-sm text-muted-foreground">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}