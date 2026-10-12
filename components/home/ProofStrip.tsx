import { site } from "@/content/site";

const FACTS = [
  { big: "1939", small: "Founded in Siyaganj" },
  { big: "Retail + wholesale", small: "One counter, every order size" },
  { big: "Tata Wiron", small: "Authorized dealer" },
  { big: "All India", small: "Shipping on request" },
];

export function ProofStrip() {
  return (
    <section className="border-b border-border" aria-label="Why buyers trust us">
      <ul className="page-container grid grid-cols-2 gap-px bg-border bg-clip-content md:grid-cols-4">
        {FACTS.map((f) => (
          <li key={f.big} data-reveal className="bg-card px-4 py-6 md:py-8">
            <p className="font-display text-3xl font-extrabold uppercase leading-none text-foreground md:text-4xl">
              {f.big}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{f.small}</p>
          </li>
        ))}
      </ul>
      <p className="sr-only">{site.name}, {site.address.city}</p>
    </section>
  );
}
