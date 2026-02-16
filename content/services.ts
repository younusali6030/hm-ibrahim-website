/**
 * Services offered by HM Ibrahim & Co. Edit descriptions here.
 */

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
};

export const services: Service[] = [
  {
    slug: "retail",
    title: "Retail Supply",
    description:
      "We serve individual customers and small projects with the same care as large orders. Walk in for small quantities of rods, wire, fasteners, and hardware. No minimum order for many items.",
    icon: "ShoppingBag",
    highlight: true,
  },
  {
    slug: "wholesale",
    title: "Wholesale Supply",
    description:
      "Competitive rates and dedicated support for dealers and stockists. Bulk orders of iron, steel, pipes, and wire with transparent pricing and reliable availability.",
    icon: "Package",
    highlight: true,
  },
  {
    slug: "contractor",
    title: "Bulk Orders / Contractor Supply",
    description:
      "We supply builders and contractors with TMT bars, structural sections, mesh, and construction hardware. Project-based orders and repeat supply arrangements welcome.",
    icon: "HardHat",
    highlight: true,
  },
  {
    slug: "warehouse",
    title: "Warehouse Availability",
    description:
      "Our depot and warehouse in Siyaganj keep stock of major categories. Quick fulfillment for standard items; special sizes and grades can be arranged on order.",
    icon: "Warehouse",
  },
  {
    slug: "delivery",
    title: "Delivery / Transport",
    description:
      "Delivery can be arranged subject to availability and location. Indore and nearby areas are covered. Discuss delivery options when placing your order.",
    icon: "Truck",
  },
  {
    slug: "fabrication",
    title: "Cut-to-Length or Fabrication",
    description:
      "Cut-to-length or basic fabrication may be available for certain products. Please enquire at the time of order—we will confirm feasibility and lead time.",
    icon: "Scissors",
  },
];
