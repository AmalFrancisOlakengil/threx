'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Radar,
  BarChart3,
  Eye,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MapPin,
    title: 'Competitor Mapping',
    description: 'Visualize competitor locations and understand market concentration in real-time.',
  },
  {
    icon: TrendingUp,
    title: 'Demographic Insights',
    description: 'Access detailed demographic data including age, income, and consumer behavior.',
  },
  {
    icon: DollarSign,
    title: 'Rent & Price Estimation',
    description: 'Get accurate commercial and residential rent estimates for any location.',
  },
  {
    icon: Radar,
    title: 'Blind Spot Detection',
    description: 'Identify market gaps and underserved areas for your business model.',
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'Comprehensive market analysis with growth trends and opportunity scores.',
  },
  {
    icon: Eye,
    title: 'Location Comparison',
    description: 'Compare multiple locations side-by-side with visual analytics.',
  },
];

export function FeaturesSection() {
  const containerRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-20 md:py-32 px-4 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Powerful Features for Smart Decisions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to analyze locations and expand with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-md"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
