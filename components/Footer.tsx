"use client"

import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-2">
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
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Crafting beautiful wooden décor that brings warmth and character to your home.
              Each piece tells a story of craftsmanship and natural beauty.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/admin/orders"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:woodersrwanda@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>woodersrwanda@gmail.com</span>
              </a>
              <a href="tel:+250780609878" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+250 780 609 878</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Wooders Rwanda. All rights reserved.
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors text-muted-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors text-muted-foreground">
                Terms
              </Link>
              <Link href="/delivery" className="hover:text-foreground transition-colors text-muted-foreground">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}