import Link from "@/components/LocaleLink";
import { ChevronRight } from "lucide-react";
import type { Lang } from "@/lib/locale";

export type BreadcrumbItem = { name: string; url: string };

type Props = {
  items: BreadcrumbItem[];
  className?: string;
  lang?: Lang;
};

export function Breadcrumbs({ items, className = "", lang = "en" }: Props) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={lang === "hi" ? "ब्रेडक्रम्ब (नेविगेशन पथ)" : "Breadcrumb"} className={`text-sm text-muted-foreground ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />}
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="hover:text-primary transition-colors min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
