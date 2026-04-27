"use client";

import Link from "next/link";
import { Container } from "./container";
import { QuoteFormDialog } from "@/components/sections/quote-form";
import { Phone, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              AAA Texas Roofing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <a 
              href="tel:+15555555555" 
              className="hidden sm:flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="font-semibold">(555) 555-5555</span>
            </a>
            <QuoteFormDialog triggerSize="sm">Get Free Quote</QuoteFormDialog>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link href="/services" className="block py-2 text-sm font-medium">
              Services
            </Link>
            <Link href="/projects" className="block py-2 text-sm font-medium">
              Projects
            </Link>
            <Link href="/about" className="block py-2 text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="block py-2 text-sm font-medium">
              Contact
            </Link>
            <a 
              href="tel:+15555555555" 
              className="flex items-center space-x-2 py-2 text-primary font-semibold"
            >
              <Phone className="h-4 w-4" />
              <span>(555) 555-5555</span>
            </a>
          </div>
        )}
      </Container>
    </header>
  );
}
