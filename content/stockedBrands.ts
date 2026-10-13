/**
 * Brands we stock. Used for "Brands We Stock" section and messaging.
 * Only set isAuthorized: true for brands whose dealer authorisation is documented. Tata is split by scope:
 * Tata Wiron (wire and fencing) is the documented authorised line, see content/brands.ts; other Tata steel is stocked
 * or obtained on request, and is not described as an authorised-dealer relationship until a document says so.
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
    note: "Tata steel products available on request. Authorised for Tata Wiron wire and fencing.",
    isAuthorized: false,
    categoryTags: ["structural-items", "tmt-bars"],
  },
  {
    name: "Bansal Wire",
    specialty: "Industrial wire and mesh range",
    note: "Available; contact for availability.",
    isAuthorized: false,
    categoryTags: ["wiremesh", "wires"],
  },
  {
    name: "H D Wires Pvt Ltd",
    specialty: "Welded wire mesh and galvanised cables",
    categoryTags: ["wiremesh", "wires"],
  },
  {
    name: "Shree Shyam Perforators",
    specialty: "Perforated sheets and perforated wire mesh",
    categoryTags: ["perforated-sheets", "construction-tools"],
  },
  {
    name: "Hamrahi Wiremesh Industries",
    specialty: "GI barbed wire, aluminium mesh, and concertina wire",
    categoryTags: ["fencing-material", "barbed-wire", "wires"],
  },
  {
    name: "Bhansali Wire Industries",
    specialty: "SS wire mesh (SS 304 & 316) and industrial meshes",
    categoryTags: ["wiremesh", "wires"],
  },
  {
    name: "STALCO",
    specialty: "Steel wire mesh",
    note: "Est. 1963. Polo Ground industrial area.",
    location: "Polo Ground industrial area",
    categoryTags: ["wiremesh", "wires"],
  },
  {
    name: "Bokadia Wires",
    specialty: "Fencing wire, GI wire, and mesh varieties",
    note: "Est. 1978.",
    categoryTags: ["wiremesh", "wires"],
  },
];
