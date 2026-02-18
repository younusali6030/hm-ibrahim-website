import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { name: string; url: string };

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className = "" }: Props) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-muted-foreground ${className}`}>
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
                <Link href={item.url} className="hover:text-primary transition-colors py-1.5 -my-1.5 inline-flex items-center">
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
