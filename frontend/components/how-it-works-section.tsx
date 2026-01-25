'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Select Business Category',
    description: 'Choose your industry and define your business model parameters.',
  },
  {
    number: '02',
    title: 'Choose a Location',
    description: 'Search and select the geographic area you want to analyze.',
  },
  {
    number: '03',
    title: 'Analyze Market',
    description: 'Get instant insights on competitors, demographics, and pricing.',
  },
  {
    number: '04',
    title: 'Compare & Download',
    description: 'Compare multiple locations and download comprehensive reports.',
  },
];

export function HowItWorksSection() {
  const containerRef = useRef(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    stepsRef.current.forEach((step, index) => {
      gsap.fromTo(
        step,
        { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.15,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-20 md:py-32 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, intuitive workflow to analyze any location in minutes.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) stepsRef.current[index] = el;
              }}
              className="flex gap-6 md:gap-8"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary bg-primary/10 text-primary font-bold text-sm md:text-base">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-24 bg-gradient-to-b from-primary/50 to-transparent mt-4" />
                )}
              </div>
              <div className="pt-1 pb-8">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
