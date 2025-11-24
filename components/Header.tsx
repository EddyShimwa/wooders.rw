'use client'

import { Heart, Package, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface HeaderProps {
  onOrderTrackingClick: () => void;
  onWishlistClick: () => void;
  wishlistCount: number;
}

export const Header = ({ onOrderTrackingClick, onWishlistClick, wishlistCount }: HeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Wooders"
                  width={40}
                  height={40}
                  unoptimized
                  priority
                  className="h-8 lg:h-10 w-auto"
                />
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === "/" ? "text-[hsl(var(--wood-dark))] dark:text-[hsl(var(--wood-light))]" : "text-muted-foreground hover:text-[hsl(var(--wood-medium))] dark:hover:text-[hsl(var(--wood-light))]]"
                }`}
              >
                Home
                {pathname === "/" && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[hsl(var(--wood-medium))]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
              <Link 
                href="/about" 
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === "/about" ? "text-[hsl(var(--wood-dark))] dark:text-[hsl(var(--wood-light))]" : "text-muted-foreground hover:text-[hsl(var(--wood-medium))] dark:hover:text-[hsl(var(--wood-light))]]"
                }`}
              >
                About
                {pathname === "/about" && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[hsl(var(--wood-medium))]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onWishlistClick}
                className="relative hover:bg-[hsl(var(--wood-light))]/10 hover:text-[hsl(var(--wood-medium))] transition-all duration-200"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[hsl(var(--wood-medium))] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onOrderTrackingClick}
                className="hidden sm:flex border-[hsl(var(--wood-medium))] text-[hsl(var(--wood-medium))] hover:bg-[hsl(var(--wood-light))]/10 hover:text-[hsl(var(--wood-medium))] transition-all duration-200 gap-2"
              >
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Track Order</span>
              </Button>

              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border md:hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                About
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  onOrderTrackingClick();
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start border-[hsl(var(--wood-medium))] text-[hsl(var(--wood-medium))] hover:bg-[hsl(var(--wood-light))]/10 transition-all duration-200"
              >
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
