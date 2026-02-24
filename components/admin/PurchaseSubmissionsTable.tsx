"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export type PurchaseSubmissionRow = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  customerType: string;
  productCategory: string;
  itemName: string;
  quantity: number;
  unit: string;
  purchaseDate: string | null;
  createdAt: string;
};

type Props = {
  initialRows: PurchaseSubmissionRow[];
};

export function PurchaseSubmissionsTable({ initialRows }: Props) {
  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const rows = useMemo(() => {
    return initialRows.filter((row) => {
      const term = search.trim().toLowerCase();
      if (term) {
        const haystack = `${row.fullName} ${row.email} ${row.phone} ${row.itemName} ${row.productCategory}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (customerTypeFilter !== "all" && row.customerType !== customerTypeFilter) return false;
      if (categoryFilter !== "all" && row.productCategory !== categoryFilter) return false;
      return true;
    });
  }, [initialRows, search, customerTypeFilter, categoryFilter]);

  const uniqueCustomerTypes = useMemo(
    () => Array.from(new Set(initialRows.map((r) => r.customerType))).filter(Boolean),
    [initialRows]
  );
  const uniqueCategories = useMemo(
    () => Array.from(new Set(initialRows.map((r) => r.productCategory))).filter(Boolean),
    [initialRows]
  );

  function exportCsv() {
    if (!rows.length) return;
    const header = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Customer Type",
      "Product Category",
      "Item Name",
      "Quantity",
      "Unit",
      "Purchase Date",
      "Created At",
    ];
    const csvLines = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.fullName,
          r.email,
          r.phone,
          r.customerType,
          r.productCategory,
          r.itemName,
          r.quantity,
          r.unit,
          r.purchaseDate ?? "",
          r.createdAt,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase-submissions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, product..."
            className="min-h-[36px] rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <select
            value={customerTypeFilter}
            onChange={(e) => setCustomerTypeFilter(e.target.value)}
            className="min-h-[36px] rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All customer types</option>
            {uniqueCustomerTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-h-[36px] rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 font-semibold text-foreground">Date</th>
              <th className="px-3 py-2 font-semibold text-foreground">Customer</th>
              <th className="px-3 py-2 font-semibold text-foreground">Contact</th>
              <th className="px-3 py-2 font-semibold text-foreground">Type</th>
              <th className="px-3 py-2 font-semibold text-foreground">Category</th>
              <th className="px-3 py-2 font-semibold text-foreground">Item</th>
              <th className="px-3 py-2 font-semibold text-foreground">Qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                  No submissions found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/60">
                <td className="px-3 py-2 align-top text-xs text-muted-foreground whitespace-nowrap">
                  {row.purchaseDate || row.createdAt}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="text-sm font-medium text-foreground">{row.fullName}</div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted-foreground">
                  <div>{row.phone}</div>
                  <div>{row.email}</div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted-foreground">
                  {row.customerType}
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted-foreground">
                  {row.productCategory}
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted-foreground">
                  {row.itemName}
                </td>
                <td className="px-3 py-2 align-top text-xs text-muted-foreground whitespace-nowrap">
                  {row.quantity} {row.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

