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
      "We serve individual customers and small projects with the same care as large orders. Walk in for small quantities of rods, wire, fasteners and hardware. Many items have no minimum order.",
    icon: "ShoppingBag",
    highlight: true,
  },
  {
    slug: "wholesale",
    title: "Wholesale Supply",
    description:
      "Wholesale rates and direct support for dealers and stockists. Bulk orders of iron, steel, pipes and wire, with clear pricing and dependable stock.",
    icon: "Package",
    highlight: true,
  },
  {
    slug: "contractor",
    title: "Bulk Orders and Contractor Supply",
    description:
      "We supply builders and contractors with TMT bars, structural sections, mesh and construction hardware. Project orders and repeat supply arrangements are welcome.",
    icon: "HardHat",
    highlight: true,
  },
  {
    slug: "warehouse",
    title: "Warehouse Availability",
    description:
      "Our depot and warehouse in Siyaganj hold stock across the main categories. Standard items go out quickly; special sizes and grades can be arranged on order.",
    icon: "Warehouse",
  },
  {
    slug: "delivery",
    title: "Delivery and Transport",
    description:
      "Delivery can be arranged, subject to stock and location. We cover Indore and nearby areas. Discuss delivery options when you place your order.",
    icon: "Truck",
  },
  {
    slug: "fabrication",
    title: "Cut-to-Length or Fabrication",
    description:
      "Cut-to-length or basic fabrication may be available for some products. Please ask when you order and we will confirm whether it is possible and how long it will take.",
    icon: "Scissors",
  },
];
