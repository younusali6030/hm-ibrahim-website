import { BadgeCheck } from "lucide-react";
import { site } from "@/content/site";

type Props = {
  className?: string;
  variant?: "default" | "compact";
};

export function TataBadge({ className = "", variant = "default" }: Props) {
  if (!site.authorizedDealer.enabled) return null;

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <BadgeCheck className="h-3.5 w-3.5 text-primary" />
        <span>{site.authorizedDealer.note}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 ${className}`}>
      <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
      <p className="text-sm font-medium text-foreground">{site.authorizedDealer.note}</p>
    </div>
  );
}
