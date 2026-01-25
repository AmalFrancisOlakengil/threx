'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaContainerRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(
      headlineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0
    );

    timeline.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0.2
    );

    timeline.fromTo(
      ctaContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0.4
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1
          ref={headlineRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground"
        >
          Find the Best Locations to{' '}
          <span className="text-primary">Start or Expand</span> Your Business
        </h1>

        <p
          ref={descriptionRef}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Unlock data-driven location insights. Analyze competitors, demographics, pricing, and market gaps to make smarter expansion decisions.
        </p>

        <div
          ref={ctaContainerRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/app">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Analyze a Location
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-foreground/20 hover:bg-muted/50 px-8 bg-transparent"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
