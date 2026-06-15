import type { Product, ClassKit, College, CollegeKit } from "./types";

export const PRODUCTS: Product[] = [
  { id: "p-nb-200", name: "A4 Spiral Notebook 200 pages", brand: "Classmate", category: "School", mrp: 180, price: 149, inStock: true, sameDay: true },
  { id: "p-nb-100", name: "Single Line Notebook 100 pages", brand: "Navneet", category: "School", mrp: 80, price: 59, inStock: true, sameDay: true },
  { id: "p-pen-blue", name: "Reynolds Blue Ball Pen (Pack of 5)", brand: "Reynolds", category: "School", mrp: 50, price: 40, inStock: true, sameDay: true },
  { id: "p-pencil", name: "Apsara Platinum Pencil (Pack of 10)", brand: "Apsara", category: "School", mrp: 60, price: 50, inStock: true, sameDay: true },
  { id: "p-geo", name: "Camlin Geometry Box", brand: "Camlin", category: "School", mrp: 250, price: 199, inStock: true, sameDay: true },
  { id: "p-ruler", name: "30cm Plastic Ruler", brand: "Camlin", category: "School", mrp: 30, price: 20, inStock: true, sameDay: true },
  { id: "p-eraser", name: "Eraser & Sharpener Combo", brand: "Apsara", category: "School", mrp: 40, price: 25, inStock: true, sameDay: true },
  { id: "p-cover", name: "Brown Book Cover Roll", brand: "Local", category: "School", mrp: 60, price: 45, inStock: true, sameDay: true },
  { id: "p-label", name: "Name Label Stickers (50 pcs)", brand: "Local", category: "School", mrp: 50, price: 35, inStock: true, sameDay: true },
  { id: "p-calc", name: "Casio Scientific Calculator FX-991", brand: "Casio", category: "College", mrp: 1500, price: 1199, inStock: true, sameDay: true },
  { id: "p-lab-physics", name: "Physics Lab Manual", brand: "Local Print", category: "School", mrp: 220, price: 180, inStock: true },
  { id: "p-lab-chem", name: "Chemistry Lab Manual", brand: "Local Print", category: "School", mrp: 220, price: 180, inStock: true },
  { id: "p-prac-file", name: "Practical File (Hardbound)", brand: "Navneet", category: "College", mrp: 150, price: 120, inStock: true, sameDay: true },
  { id: "p-drafter", name: "Mini Drafter (Engineering)", brand: "Camlin", category: "College", mrp: 800, price: 650, inStock: true },
  { id: "p-marker", name: "Permanent Marker Set (4 colors)", brand: "Camlin", category: "Office", mrp: 120, price: 95, inStock: true, sameDay: true },
  { id: "p-highlighter", name: "Highlighter Pack (5 colors)", brand: "Faber-Castell", category: "Office", mrp: 250, price: 199, inStock: true, sameDay: true },
  { id: "p-exam-pad", name: "Exam Pad with Clip", brand: "Solo", category: "School", mrp: 180, price: 140, inStock: true, sameDay: true },
  // Class-specific textbooks (placeholders mapped to class)
  { id: "tb-1", name: "Class 1 NCERT Textbook Set", brand: "NCERT", category: "School", mrp: 600, price: 540, inStock: true },
  { id: "tb-5", name: "Class 5 NCERT Textbook Set", brand: "NCERT", category: "School", mrp: 900, price: 820, inStock: true },
  { id: "tb-8", name: "Class 8 NCERT Textbook Set", brand: "NCERT", category: "School", mrp: 1200, price: 1080, inStock: true },
  { id: "tb-10", name: "Class 10 NCERT Textbook Set", brand: "NCERT", category: "School", mrp: 1500, price: 1350, inStock: true },
  { id: "tb-12-sci", name: "Class 12 Science Textbook Set", brand: "NCERT", category: "School", mrp: 2200, price: 1980, inStock: true },
  { id: "tb-12-com", name: "Class 12 Commerce Textbook Set", brand: "NCERT", category: "School", mrp: 1900, price: 1710, inStock: true },
  { id: "tb-12-arts", name: "Class 12 Arts Textbook Set", brand: "NCERT", category: "School", mrp: 1700, price: 1530, inStock: true },
];

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

const baseSchoolItems = [
  { productId: "p-nb-200", qty: 4, required: false },
  { productId: "p-nb-100", qty: 6, required: true },
  { productId: "p-pen-blue", qty: 2, required: true },
  { productId: "p-pencil", qty: 1, required: true },
  { productId: "p-eraser", qty: 1, required: true },
  { productId: "p-ruler", qty: 1, required: true },
  { productId: "p-cover", qty: 1, required: false },
  { productId: "p-label", qty: 1, required: false },
];

function pickTextbook(cls: number, stream?: "Science" | "Commerce" | "Arts") {
  if (cls === 12) {
    if (stream === "Commerce") return "tb-12-com";
    if (stream === "Arts") return "tb-12-arts";
    return "tb-12-sci";
  }
  if (cls >= 9) return "tb-10";
  if (cls >= 6) return "tb-8";
  if (cls >= 3) return "tb-5";
  return "tb-1";
}

export function buildClassKit(cls: number, stream?: "Science" | "Commerce" | "Arts"): ClassKit {
  const items = [
    { productId: pickTextbook(cls, stream), qty: 1, required: true, note: "Required by syllabus" },
    ...baseSchoolItems,
  ];
  if (cls >= 6) items.push({ productId: "p-geo", qty: 1, required: true });
  if (cls >= 9) items.push({ productId: "p-exam-pad", qty: 1, required: false });
  if (cls === 12 && stream === "Science") {
    items.push({ productId: "p-calc", qty: 1, required: true });
    items.push({ productId: "p-lab-physics", qty: 1, required: true });
    items.push({ productId: "p-lab-chem", qty: 1, required: true });
  }

  const total = items.reduce((s, i) => {
    const p = findProduct(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const bundlePrice = Math.round(total * 0.92);

  const streamSuffix = stream ? ` (${stream})` : "";
  return {
    id: `class-${cls}${stream ? "-" + stream.toLowerCase() : ""}`,
    classNumber: cls,
    stream,
    title: `Class ${cls}${streamSuffix} Complete Kit`,
    badge: "Verified by Kaagaz Stationers — Indore syllabus ready",
    bundlePrice,
    items,
  };
}

export const COLLEGES: College[] = [
  {
    id: "prestige",
    name: "Prestige Institute of Management & Research",
    short: "Prestige",
    branches: [
      { id: "bba", name: "BBA", group: "Management" },
      { id: "bcom", name: "B.Com", group: "Commerce" },
      { id: "mba", name: "MBA", group: "Management" },
    ],
  },
  {
    id: "sgsits",
    name: "SGSITS",
    short: "SGSITS",
    branches: [
      { id: "cse", name: "CSE", group: "Engineering" },
      { id: "it", name: "IT", group: "Engineering" },
      { id: "mech", name: "Mechanical", group: "Engineering" },
      { id: "civil", name: "Civil", group: "Engineering" },
    ],
  },
  {
    id: "medicaps",
    name: "Medi-Caps University",
    short: "Medi-Caps",
    branches: [
      { id: "cse", name: "CSE", group: "Engineering" },
      { id: "ec", name: "Electronics", group: "Engineering" },
      { id: "pharma", name: "B.Pharma", group: "Pharmacy" },
    ],
  },
  {
    id: "davv",
    name: "DAVV (Devi Ahilya Vishwavidyalaya)",
    short: "DAVV",
    branches: [
      { id: "bsc", name: "B.Sc", group: "Science" },
      { id: "bcom", name: "B.Com", group: "Commerce" },
      { id: "ba", name: "B.A", group: "Arts" },
    ],
  },
  {
    id: "iet-davv",
    name: "IET DAVV",
    short: "IET DAVV",
    branches: [
      { id: "cse", name: "CSE", group: "Engineering" },
      { id: "it", name: "IT", group: "Engineering" },
    ],
  },
];

export function buildCollegeKit(collegeId: string, branchId: string, year: 1 | 2 | 3 | 4): CollegeKit {
  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);
  const isEng = branch?.group === "Engineering";
  const isCommerce = branch?.group === "Commerce" || branch?.group === "Management";

  const items = [
    { productId: "p-nb-200", qty: 6, required: true, note: "For lecture notes" },
    { productId: "p-pen-blue", qty: 3, required: true },
    { productId: "p-highlighter", qty: 1, required: false },
    { productId: "p-prac-file", qty: 2, required: true, note: "Required for submissions" },
  ];

  if (isEng) {
    items.push({ productId: "p-calc", qty: 1, required: true, note: "Required for all years" });
    items.push({ productId: "p-lab-physics", qty: 1, required: year === 1, note: "1st year practical" });
    items.push({ productId: "p-drafter", qty: 1, required: year === 1, note: "Engineering Graphics" });
  }
  if (isCommerce) {
    items.push({ productId: "p-calc", qty: 1, required: true });
    items.push({ productId: "p-marker", qty: 1, required: false });
  }

  const total = items.reduce((s, i) => {
    const p = findProduct(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const bundlePrice = Math.round(total * 0.9);

  return {
    id: `${collegeId}-${branchId}-${year}`,
    collegeId,
    branchId,
    year,
    title: `${college?.short ?? "College"} — ${branch?.name ?? "Branch"} — Year ${year} Kit`,
    bundlePrice,
    expectedDelivery: "Delivered today by 8 PM",
    items,
  };
}
