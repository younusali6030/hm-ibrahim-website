"use client";

import dynamic from "next/dynamic";

/** Client-only, split out of the critical bundle: the effects load after the page is interactive. */
export const LazySteelSheen = dynamic(() => import("./SteelSheen").then((m) => m.SteelSheen), { ssr: false });
export const LazyLiquidMark = dynamic(() => import("./LiquidMark").then((m) => m.LiquidMark), {
  ssr: false,
  loading: () => null,
});
