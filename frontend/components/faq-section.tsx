'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'What data sources are used?',
    answer:
      'We aggregate data from government databases, real estate services, census records, and proprietary market research. Our data is updated quarterly to ensure accuracy and relevance.',
  },
  {
    question: 'Is this suitable for small businesses?',
    answer:
      'Absolutely! Zonely is designed for businesses of all sizes. Whether you\'re a solo entrepreneur or a large corporation, our platform scales to your needs and budget.',
  },
  {
    question: 'How accurate are rent estimates?',
    answer:
      'Our rent estimates have a typical accuracy of ±5-10% compared to actual market rates. We use machine learning models trained on thousands of real transactions and continuously update our algorithms.',
  },
  {
    question: 'Can I compare multiple locations?',
    answer:
      'Yes! Our comparison feature allows you to analyze up to 10 locations side-by-side with customizable metrics, visual charts, and downloadable reports.',
  },
  {
    question: 'What format are the reports in?',
    answer:
      'Reports are available in PDF format, which includes visualizations, key metrics, competitive analysis, demographic breakdowns, and actionable recommendations.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes, we offer a 14-day free trial with full access to all features. No credit card required. You can cancel anytime during the trial period.',
  },
];

export function FAQSection() {
  const containerRef = useRef(null);
  const accordionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      accordionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: accordionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="faq"
      ref={containerRef}
      className="py-20 md:py-32 px-4 bg-muted/30"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Zonely.
          </p>
        </div>

        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary transition">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
