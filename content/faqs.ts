/**
 * FAQs for Home and Products pages. Edit questions and answers here.
 */

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category?: string; // optional: "general" | "products" | "orders" etc.
};

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "Where is HM Ibrahim & Co located?",
    answer:
      "We are at 60, Siyaganj Main Road, Opp. Tijori Gali, Siyaganj, Indore, Madhya Pradesh. Siyaganj is a well-known market for iron and hardware in Indore.",
    category: "general",
  },
  {
    id: "2",
    question: "Do you supply retail as well as wholesale?",
    answer:
      "Yes. We serve retail customers, wholesalers, contractors, and industrial buyers. Minimum order may vary by product; contact us for details.",
    category: "general",
  },
  {
    id: "3",
    question: "How can I get a price quote?",
    answer:
      "Use the 'Request a Quote' form on the website with your product, quantity, and contact details. You can also call or WhatsApp us directly. We respond quickly with pricing and availability.",
    category: "orders",
  },
  {
    id: "4",
    question: "Do you deliver or do I need to pick up?",
    answer:
      "We can arrange delivery subject to availability and location. For bulk orders and local areas we often provide delivery. Pickup from our warehouse is always available. Mention your preference when requesting a quote.",
    category: "orders",
  },
  {
    id: "5",
    question: "What are your business hours?",
    answer:
      "We are open Monday–Saturday 9:00 AM–8:00 PM. Sunday closed. Hours may vary on holidays; call before visiting if unsure.",
    category: "general",
  },
  {
    id: "6",
    question: "Do you stock TMT bars and what grades?",
    answer:
      "Yes. We stock TMT bars in various sizes (8 mm to 32 mm) and grades such as Fe 500 and Fe 550. Specify your requirement when enquiring.",
    category: "products",
  },
  {
    id: "7",
    question: "Can you supply cut-to-length or fabricated items?",
    answer:
      "We primarily supply standard material. Cut-to-length or basic fabrication may be arranged in some cases; please ask when placing an order.",
    category: "products",
  },
  {
    id: "8",
    question: "Which areas do you serve?",
    answer:
      "We are based in Indore and serve Indore city and nearby areas including Dewas, Ujjain, Mhow, Pithampur, and surrounding regions. Delivery depends on order size and location.",
    category: "general",
  },
  {
    id: "9",
    question: "How do I pay?",
    answer:
      "We accept cash, cheque, and bank transfer. Payment terms may vary for retail vs wholesale; discuss with us when placing your order.",
    category: "orders",
  },
  {
    id: "10",
    question: "Do you have a printed catalog?",
    answer:
      "We can share product lists and specifications. Use 'Request a Quote' or WhatsApp to tell us your interest, and we will provide relevant details. A catalog download may be available on the website.",
    category: "general",
  },
];

export function getFaqsByCategory(category: string): FAQ[] {
  return faqs.filter((f) => f.category === category);
}

export const generalFaqs = faqs.filter((f) => f.category === "general" || !f.category);
export const productFaqs = faqs.filter((f) => f.category === "products");
export const orderFaqs = faqs.filter((f) => f.category === "orders");
