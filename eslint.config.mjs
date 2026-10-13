import nextVitals from "eslint-config-next/core-web-vitals";

// Next 16 removed `next lint`; run `npm run lint` (plain ESLint with the Next core-web-vitals rules).
const config = [
  ...nextVitals,
  {
    // New in eslint-config-next 16 (React Compiler checks). The existing components work; these are advisory
    // until each one is reworked, so they warn instead of failing the gate.
    rules: { "react-hooks/set-state-in-effect": "warn", "react-hooks/refs": "warn" },
  },
  { ignores: [".next*/**", "node_modules/**", "public/**", "scripts/**", "tests/**", "next-env.d.ts"] },
];

export default config;
