'use client'

import { Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  onOrderTrackingClick: () => void;
  onWishlistClick: () => void;
  wishlistCount: number;
}

export const Header = ({ onOrderTrackingClick, onWishlistClick, wishlistCount }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
                      <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className=" w-auto"
            >
              <Image
                src="/images/logo.png"
                alt="Wooders - Wooden Crafts"
                width={48}
                height={48}
                className="h-8 sm:h-12 w-auto"
              />
            </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/about" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onWishlistClick}
            className="relative hover:bg-wood/10 transition-smooth"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onOrderTrackingClick}
            className="border-wood hover:bg-wood/10 transition-smooth"
          >
            <Package className="h-4 w-4 mr-2" />
            Track Order
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};
