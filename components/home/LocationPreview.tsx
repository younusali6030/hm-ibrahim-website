"use client";

import Image from "next/image";
import { GaugeRule } from "@/components/motif/Motif";
import { VisitUs } from "@/components/visit/VisitUs";
import { useT } from "@/lib/i18n";

/** Home "Visit us": the shared VisitUs block beside the storefront. One address, one set of hours, everywhere. */
export function LocationPreview() {
  const t = useT();
  return (
    <section className="py-16 md:py-20">
      <div className="page-container">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <div className="overflow-hidden rounded-[14px] border border-border bg-card">
            <Image
              src="/about-storefront.png"
              alt={t("HM Ibrahim & Co storefront at Siyaganj, Indore", "सियागंज, इंदौर में एचएम इब्राहिम एंड कंपनी की दुकान")}
              width={600}
              height={400}
              className="h-64 w-full object-cover md:h-80"
            />
          </div>
          <div>
            <VisitUs variant="full" source="home_visit" />
          </div>
        </div>
        <GaugeRule className="mt-12" />
      </div>
    </section>
  );
}
