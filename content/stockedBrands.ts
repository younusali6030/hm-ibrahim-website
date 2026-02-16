/**
 * Brands we stock — national and local. Used for "Brands We Stock" section and messaging.
 * Only set isAuthorized: true for brands we are truly authorized dealers for.
 */

export type StockedBrand = {
  name: string;
  specialty: string;
  note?: string;
  isAuthorized?: boolean;
  categoryTags?: string[];
  location?: string;
};

export const stockedBrands: StockedBrand[] = [
  {
    name: "Tata",
    specialty: "Steel products, TMT bars",
    note: "Authorized dealer. Tata products available on request.",
    isAuthorized: true,
    categoryTags: ["iron-steel", "tmt-bars"],
  },
  {
    name: "Bansal Wire",
    specialty: "Industrial wire and mesh range",
    note: "Available; contact for availability.",
    isAuthorized: false,
    categoryTags: ["wire-mesh"],
  },
  {
    name: "H D Wires Pvt Ltd",
    specialty: "Welded wire mesh and galvanized cables",
    categoryTags: ["wire-mesh"],
  },
  {
    name: "Shree Shyam Perforators",
    specialty: "Perforated sheets and perforated wire mesh",
    categoryTags: ["hardware-tools", "perforated-sheets"],
  },
  {
    name: "Hamrahi Wiremesh Industries",
    specialty: "GI barbed wire, aluminum mesh, and concertina wire",
    categoryTags: ["wire-mesh", "barbed-wire"],
  },
  {
    name: "Bhansali Wire Industries",
    specialty: "SS wire mesh (SS 304 & 316) and industrial meshes",
    categoryTags: ["wire-mesh"],
  },
  {
    name: "STALCO",
    specialty: "Steel wire mesh",
    note: "Est. 1963. Polo Ground industrial area.",
    location: "Polo Ground industrial area",
    categoryTags: ["wire-mesh"],
  },
  {
    name: "Bokadia Wires",
    specialty: "Fencing wire, GI wire, and mesh varieties",
    note: "Est. 1978.",
    categoryTags: ["wire-mesh"],
  },
];
