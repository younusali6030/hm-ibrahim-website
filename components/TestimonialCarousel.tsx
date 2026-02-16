"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const goNext = () => setIndex((i) => (i + 1) % testimonials.length);
  const goPrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-20" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <h2 id="testimonials-heading" className="text-center text-3xl font-bold text-foreground md:text-4xl">
          What Our Customers Say
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Trusted by builders, contractors, and fabricators across Indore and beyond
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: current.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-lg text-foreground">
                    &ldquo;{current.text}&rdquo;
                  </blockquote>
                  <footer className="mt-4">
                    <p className="font-semibold text-foreground">{current.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {current.role}
                      {current.company && ` • ${current.company}`}
                    </p>
                  </footer>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={goPrev} aria-label="Previous testimonial">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {index + 1} / {testimonials.length}
                </span>
                <Button variant="ghost" size="icon" onClick={goNext} aria-label="Next testimonial">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
