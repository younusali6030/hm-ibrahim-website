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
      "We are at 60, Siyaganj Main Road, opposite Tijori Gali, Siyaganj, Indore, Madhya Pradesh. Siyaganj is a well-known iron and hardware market in Indore.",
    category: "general",
  },
  {
    id: "2",
    question: "Do you supply retail as well as wholesale?",
    answer:
      "Yes. We serve retail customers, wholesalers, contractors and industrial buyers. The minimum order varies by product, so contact us for details.",
    category: "general",
  },
  {
    id: "3",
    question: "How can I get a price quote?",
    answer:
      "Send the quote form on this website with your product, quantity and contact details, or call or WhatsApp us directly. We will call back with the rate and availability.",
    category: "orders",
  },
  {
    id: "4",
    question: "Do you deliver or do I need to pick up?",
    answer:
      "Orders accepted across India; delivery arrangements confirmed with each quotation. You can also collect from our warehouse in Siyaganj. Tell us which you prefer when you ask for a quote.",
    category: "orders",
  },
  {
    id: "5",
    question: "What are your business hours?",
    answer:
      "We are open Monday to Saturday, 9 am to 8 pm, and closed on Sunday. Hours may vary on public holidays, so call before you visit if you are unsure.",
    category: "general",
  },
  {
    id: "6",
    question: "Do you stock TMT bars and what grades?",
    answer:
      "Yes. We stock TMT bars from 8 mm to 32 mm in grades such as Fe 500 and Fe 550. Tell us your requirement when you enquire.",
    category: "products",
  },
  {
    id: "7",
    question: "Can you supply cut-to-length or fabricated items?",
    answer:
      "We mainly supply standard lengths. Cut-to-length or basic fabrication can be arranged in some cases, so please ask when you order.",
    category: "products",
  },
  {
    id: "8",
    question: "Which areas do you serve?",
    answer:
      "We are based in Indore and serve the city and nearby areas, including Dewas, Ujjain, Mhow and Pithampur. Orders accepted across India; delivery arrangements confirmed with each quotation.",
    category: "general",
  },
  {
    id: "9",
    question: "How do I pay?",
    answer:
      "We accept cash, cheque and bank transfer. Payment terms can differ between retail and wholesale orders, so please discuss them with us when you order.",
    category: "orders",
  },
  {
    id: "10",
    question: "Do you have a printed catalog?",
    answer:
      "We can share product lists and specifications. Tell us what you need through the quote form or WhatsApp and we will send the relevant details. A printable catalog is also available on this website.",
    category: "general",
  },
];

export function getFaqsByCategory(category: string): FAQ[] {
  return faqs.filter((f) => f.category === category);
}

export const generalFaqs = faqs.filter((f) => f.category === "general" || !f.category);
export const productFaqs = faqs.filter((f) => f.category === "products");
export const orderFaqs = faqs.filter((f) => f.category === "orders");
