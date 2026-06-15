export type Product = {
  id: string;
  name: string;
  brand?: string;
  category: "School" | "College" | "Office" | "Art & Craft" | "Printing";
  mrp: number;
  price: number;
  image?: string;
  inStock: boolean;
  sameDay?: boolean;
  tag?: string;
};

export type KitItem = {
  productId: string;
  qty: number;
  required: boolean;
  note?: string;
};

export type ClassKit = {
  id: string;
  classNumber: number; // 1..12
  stream?: "Science" | "Commerce" | "Arts";
  title: string;
  badge: string;
  bundlePrice: number;
  items: KitItem[];
};

export type CollegeKit = {
  id: string;
  collegeId: string;
  branchId: string;
  year: 1 | 2 | 3 | 4;
  title: string;
  bundlePrice: number;
  expectedDelivery: string;
  items: KitItem[];
};

export type College = {
  id: string;
  name: string;
  short: string;
  branches: { id: string; name: string; group: string }[];
};

export type CartLine =
  | { kind: "product"; productId: string; qty: number }
  | { kind: "classKit"; kitId: string; itemOverrides: Record<string, number>; }
  | { kind: "collegeKit"; kitId: string; itemOverrides: Record<string, number>; }
  | { kind: "printing"; jobId: string; estimate: number; summary: string };
