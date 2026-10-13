"use client";

import { useEffect, useState } from "react";
import { SceneHost } from "@/components/fx/SceneHost";

const LOADERS = {
  products: () => import("@/components/fx/products/scene"),
  showroom: () => import("@/components/fx/products/showroom"),
  services: () => import("@/components/fx/services/scene"),
  blog: () => import("@/components/fx/blog/scene"),
  wire: () => import("@/components/fx/wire/entry"),
} as const;

export function LabClient() {
  const [q, setQ] = useState<{ s: keyof typeof LOADERS; focus: string | null; w: number; h: number } | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setQ({
      s: (p.get("s") as keyof typeof LOADERS) || "products",
      focus: p.get("focus"),
      w: Number(p.get("w")) || 1000,
      h: Number(p.get("h")) || 800,
    });
  }, []);
  if (!q) return null;
  return (
    <div style={{ width: q.w, height: q.h, position: "relative", background: "#0e161e" }}>
      <SceneHost key={q.s} load={LOADERS[q.s]} poster="/fx/none" focus={q.focus} continuous={q.s === "wire"} />
    </div>
  );
}
