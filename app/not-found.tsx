import Link from "next/link";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <section className="bg-nav text-white">
      <div className="page-container py-20 md:py-32">
        <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">Page not found</p>
        <h1 className="mt-4 text-white" style={{ fontSize: "clamp(5rem, 16vw, 12rem)", lineHeight: 0.85 }}>404</h1>
        <p className="mt-6 max-w-xl text-xl text-white/80">
          That shutter is down. The link may be old, or the page may have moved.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110">
            Back to home
          </Link>
          <Link href="/products" className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10">
            Browse products
          </Link>
          <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10">
            Get a quote
          </Link>
        </div>
        <p className="mt-10 text-sm text-white/60">{site.name}, Siyaganj, Indore.</p>
      </div>
    </section>
  );
}
