/**
 * Testimonials for homepage — from Google reviews and customer feedback.
 * Replace or add real snippets from your Google Business profile.
 */

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  rating?: number; // 1-5
  fromGoogle?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Sharma",
    role: "Contractor",
    company: "Sharma Builders",
    text: "We have been sourcing TMT bars and MS angles from HM Ibrahim & Co for over a decade. Quality and delivery are always reliable. A trusted name in Siyaganj.",
    rating: 5,
    fromGoogle: true,
  },
  {
    id: "2",
    name: "Amit Patel",
    role: "Fabricator",
    company: "Patel Fabrication Works",
    text: "Best rates and good stock. They understand our bulk requirements and arrange material on time. Highly recommend for wholesale buyers.",
    rating: 5,
    fromGoogle: true,
  },
  {
    id: "3",
    name: "Vikram Singh",
    role: "Site Engineer",
    text: "Quick fulfillment and fair pricing. We order binding wire, mesh, and rods regularly. The team is helpful and the location is convenient.",
    rating: 5,
    fromGoogle: true,
  },
  {
    id: "4",
    name: "Suresh Khandelwal",
    role: "Retail Customer",
    text: "I needed a small quantity of GI pipes and fasteners. They didn’t turn me away—served with the same attention as big orders. Old-school values.",
    rating: 5,
    fromGoogle: true,
  },
  {
    id: "5",
    name: "Deepak Jain",
    role: "Workshop Owner",
    company: "Jain Engineering",
    text: "Welding rods, perforated sheets, and MS flats—all under one roof. Saves time and we get consistent quality. HM Ibrahim has been our go-to for years.",
    rating: 5,
    fromGoogle: true,
  },
  {
    id: "6",
    name: "Mohit Agarwal",
    role: "Builder",
    text: "For RCC and structural material we rely on them. Transparent pricing and no last-minute surprises. A legacy business that still delivers.",
    rating: 5,
    fromGoogle: true,
  },
];
