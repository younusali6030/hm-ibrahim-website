"use client";

import dynamic from "next/dynamic";

/**
 * Code-split so the WebGL code stays out of the first bundle. They still server-render their static fallback
 * (the white wordmark, the steel gradient), so nothing shifts and no-JS visitors see the real thing.
 */
export const LazySteelSheen = dynamic(() => import("./SteelSheen").then((m) => m.SteelSheen));
export const LazyLiquidMark = dynamic(() => import("./LiquidMark").then((m) => m.LiquidMark));
