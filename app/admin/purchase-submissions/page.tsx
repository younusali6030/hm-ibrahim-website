import type { Metadata } from "next";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { baseUrl, site } from "@/lib/site";
import { PurchaseSubmissionsTable, type PurchaseSubmissionRow } from "@/components/admin/PurchaseSubmissionsTable";

export const metadata: Metadata = {
  title: "Purchase Submissions (Admin)",
  description: "View post-purchase submissions from the website.",
  alternates: { canonical: `${baseUrl}/admin/purchase-submissions` },
};

type Props = {
  searchParams: { pw?: string };
};

export default async function AdminPurchaseSubmissionsPage({ searchParams }: Props) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const supplied = searchParams.pw ?? "";

  if (!adminPassword) {
    return (
      <div className="page-container section-padding">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Admin password not configured
        </h1>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
          Set <code className="font-mono">ADMIN_PASSWORD</code> in your environment (.env.local and Vercel env)
          to protect this page.
        </p>
      </div>
    );
  }

  if (supplied !== adminPassword) {
    return (
      <div className="page-container section-padding">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Admin — Purchase Submissions
        </h1>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
          This page is protected. Enter the admin password to continue.
        </p>
        <form method="GET" className="mt-6 max-w-sm space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Password
            <input
              type="password"
              name="pw"
              className="mt-1 w-full min-h-[44px] rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const submissions = await prisma.purchaseSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: PurchaseSubmissionRow[] = submissions.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    email: s.email,
    phone: s.phone,
    customerType: s.customerType,
    productCategory: s.productCategory,
    itemName: s.itemName,
    quantity: s.quantity,
    unit: s.unit,
    purchaseDate: s.purchaseDate ? s.purchaseDate.toISOString().slice(0, 10) : null,
    createdAt: s.createdAt.toISOString().slice(0, 10),
  }));

  return (
    <div className="page-container section-padding">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
        Purchase Submissions
      </h1>
      <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
        View purchase submissions sent from the Post-Purchase form. Use search and filters to narrow down by
        customer type or product category. Export CSV for offline analysis.
      </p>
      <PurchaseSubmissionsTable initialRows={rows} />
    </div>
  );
}

