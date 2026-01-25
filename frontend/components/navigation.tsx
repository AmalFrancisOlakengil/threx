'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Zonely</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-primary transition">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-medium text-foreground hover:text-primary transition">
              FAQ
            </a>
          </div>

          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
