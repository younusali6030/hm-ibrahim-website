import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 max-w-2xl min-w-0 text-center">
      <h1 className="text-6xl sm:text-7xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">This page could not be found.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The link may be broken or the page may have been moved.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Browse all products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/quote">Request a quote</Link>
        </Button>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        {site.name} — Iron &amp; hardware in Indore. Need help?{" "}
        <Link href="/contact" className="text-primary underline underline-offset-2">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
