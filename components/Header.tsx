"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getGeneralInquiryLink } from "@/lib/whatsapp";

const NAV_ITEMS = [
  { label: "Collection", href: "#collection" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Wooders"
                  width={60}
                  height={40}
                  unoptimized
                  priority
                  className="h-10 lg:h-14 w-auto"
                />
              </motion.div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeSection === item.href.replace("#", "")
                      ? isScrolled
                        ? "bg-[hsl(var(--wood-medium))]/10 text-[hsl(var(--wood-dark))]"
                        : "bg-white/20 text-white"
                      : isScrolled
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={getGeneralInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#25D366] text-white hover:bg-[#20BD5A]"
                    : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/20"
                }`}
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z" />
                </svg>
                Order Now
              </a>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden ${!isScrolled ? "text-white hover:bg-white/10" : ""}`}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Sidebar from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-64 backdrop-blur-2xl md:hidden flex flex-col transition-colors duration-300 ${
                isScrolled
                  ? "bg-background/70 border-l border-border/50 text-foreground"
                  : "bg-black/20 border-l border-white/15 text-white"
              }`}
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span
                  className={`text-xs font-semibold tracking-[0.15em] uppercase ${isScrolled ? "text-muted-foreground" : "text-white/40"}`}
                >
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${
                    isScrolled
                      ? "border-border hover:bg-muted/50"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => scrollTo(item.href)}
                    className={`text-left text-sm font-medium px-4 py-2.5 rounded-lg transition-all ${
                      activeSection === item.href.replace("#", "")
                        ? "bg-[hsl(var(--wood-light))]/20 text-[hsl(var(--wood-light))]"
                        : isScrolled
                          ? "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div
                className={`px-4 pb-8 pt-3 border-t ${isScrolled ? "border-border/50" : "border-white/10"}`}
              >
                <a
                  href={getGeneralInquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.912-6.876-8.152-7.194-.23-.318-1.932-2.57-1.932-4.9s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.94 1.328 3.238 1.444 3.472.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.49.62-.702.832-.234.234-.478.488-.206.956.272.468 1.212 2 2.602 3.238 1.784 1.59 3.288 2.082 3.756 2.316.468.234.742.196 1.014-.118.272-.316 1.168-1.36 1.48-1.828.312-.468.624-.39 1.054-.234.434.156 2.726 1.286 3.194 1.52.468.234.78.352.896.546.116.194.116 1.128-.274 2.228z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
