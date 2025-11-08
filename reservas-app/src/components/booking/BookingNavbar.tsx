// src/components/booking/BookingNavbar.tsx
// ✅ NAVBAR LIMPIO - Redes sociales movidas al footer
"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Private Shuttles", href: "/transfers" },
  { label: "Tailored Tours", href: "/private-tours" },
  { label: "Travel Guide", href: "/travel-guide" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export default function BookingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* ✅ NAVBAR LIMPIO - Sin redes sociales, con carrito */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-full">
          <div className="flex items-center justify-between gap-2">
            
            {/* ✅ LOGO - Responsive sizes */}
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Can't Wait Travel - Home"
            >
              <div className="relative w-64 h-16 sm:w-80 sm:h-20 md:w-96 md:h-24 lg:w-[28rem] lg:h-28">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp"
                  alt="Can't Wait Travel - Costa Rica Private Shuttle Service"
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 448px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* ✅ DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white text-sm font-medium hover:text-gray-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* ✅ CART ICON */}
              <Link
                href="/cart"
                className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10 relative ml-2"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </nav>

            {/* ✅ MOBILE MENU BUTTON */}
            <button
              onClick={handleDrawerToggle}
              className="lg:hidden text-white p-3 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ✅ MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={handleDrawerToggle}
          aria-hidden="true"
        />
      )}

      {/* ✅ MOBILE DRAWER */}
      <aside
        id="mobile-menu"
        className={cn(
          "fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          
          {/* Close Button */}
          <div className="flex justify-end p-4 border-b">
            <button
              onClick={handleDrawerToggle}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto" aria-label="Mobile navigation">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={handleDrawerToggle}
                    className="px-4 py-3 min-h-[52px] text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Cart Link */}
              <li>
                <Link
                  href="/cart"
                  onClick={handleDrawerToggle}
                  className="px-4 py-3 min-h-[52px] text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center gap-3"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}