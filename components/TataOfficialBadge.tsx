import Image from "next/image";

type Props = {
  variant?: "default" | "compact";
  className?: string;
};

const logoPath = "/brands/tata.svg";

export function TataOfficialBadge({ variant = "default", className = "" }: Props) {
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-1.5 rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-foreground ${className}`}
        title="Official Tata Distributor & Retailer"
      >
        <span className="relative h-4 w-10 shrink-0">
          <Image src={logoPath} alt="Tata" width={40} height={16} className="object-contain" />
        </span>
        <span>Official Tata</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 ${className}`}
      title="Official Tata Distributor & Retailer"
    >
      <span className="relative h-6 w-14 shrink-0">
        <Image src={logoPath} alt="Tata" width={56} height={24} className="object-contain" />
      </span>
      <p className="text-sm font-medium text-foreground">Official Tata Distributor & Retailer</p>
    </div>
  );
}
