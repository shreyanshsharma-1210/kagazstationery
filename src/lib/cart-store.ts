import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./types";
import { buildClassKit, buildCollegeKit, findProduct } from "./mock-data";

type CartState = {
  lines: CartLine[];
  addProduct: (productId: string, qty?: number) => void;
  addClassKit: (kitId: string) => void;
  addCollegeKit: (kitId: string) => void;
  addPrinting: (estimate: number, summary: string) => void;
  removeLine: (idx: number) => void;
  setQty: (idx: number, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

function classKitPrice(kitId: string, overrides: Record<string, number>): number {
  // kitId shape: class-<n> or class-<n>-<stream>
  const parts = kitId.split("-");
  const cls = Number(parts[1]);
  const streamRaw = parts[2];
  const stream = streamRaw
    ? ((streamRaw[0].toUpperCase() + streamRaw.slice(1)) as "Science" | "Commerce" | "Arts")
    : undefined;
  const kit = buildClassKit(cls, stream);
  let total = 0;
  for (const it of kit.items) {
    const qty = overrides[it.productId] ?? it.qty;
    if (qty <= 0) continue;
    const p = findProduct(it.productId);
    if (p) total += p.price * qty;
  }
  return Math.round(total * 0.92);
}

function collegeKitPrice(kitId: string, overrides: Record<string, number>): number {
  const [collegeId, branchId, yearStr] = kitId.split("-");
  const year = Number(yearStr) as 1 | 2 | 3 | 4;
  const kit = buildCollegeKit(collegeId, branchId, year);
  let total = 0;
  for (const it of kit.items) {
    const qty = overrides[it.productId] ?? it.qty;
    if (qty <= 0) continue;
    const p = findProduct(it.productId);
    if (p) total += p.price * qty;
  }
  return Math.round(total * 0.9);
}

export function lineLabel(line: CartLine): string {
  switch (line.kind) {
    case "product": {
      const p = findProduct(line.productId);
      return p ? p.name : "Item";
    }
    case "classKit":
      return `Class ${line.kitId.split("-")[1]} Kit${line.kitId.split("-")[2] ? ` (${line.kitId.split("-")[2]})` : ""}`;
    case "collegeKit": {
      const [c, b, y] = line.kitId.split("-");
      return `${c.toUpperCase()} — ${b.toUpperCase()} — Year ${y} Kit`;
    }
    case "printing":
      return `Printing — ${line.summary}`;
  }
}

export function linePrice(line: CartLine): number {
  switch (line.kind) {
    case "product": {
      const p = findProduct(line.productId);
      return p ? p.price * line.qty : 0;
    }
    case "classKit":
      return classKitPrice(line.kitId, line.itemOverrides);
    case "collegeKit":
      return collegeKitPrice(line.kitId, line.itemOverrides);
    case "printing":
      return line.estimate;
  }
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addProduct: (productId, qty = 1) =>
        set((s) => {
          const existing = s.lines.findIndex((l) => l.kind === "product" && l.productId === productId);
          if (existing >= 0) {
            const next = [...s.lines];
            const cur = next[existing];
            if (cur.kind === "product") next[existing] = { ...cur, qty: cur.qty + qty };
            return { lines: next };
          }
          return { lines: [...s.lines, { kind: "product", productId, qty }] };
        }),
      addClassKit: (kitId) =>
        set((s) => ({ lines: [...s.lines, { kind: "classKit", kitId, itemOverrides: {} }] })),
      addCollegeKit: (kitId) =>
        set((s) => ({ lines: [...s.lines, { kind: "collegeKit", kitId, itemOverrides: {} }] })),
      addPrinting: (estimate, summary) =>
        set((s) => ({
          lines: [...s.lines, { kind: "printing", jobId: crypto.randomUUID(), estimate, summary }],
        })),
      removeLine: (idx) => set((s) => ({ lines: s.lines.filter((_, i) => i !== idx) })),
      setQty: (idx, qty) =>
        set((s) => {
          const next = [...s.lines];
          const l = next[idx];
          if (l.kind === "product") next[idx] = { ...l, qty: Math.max(1, qty) };
          return { lines: next };
        }),
      clear: () => set({ lines: [] }),
      total: () => get().lines.reduce((s, l) => s + linePrice(l), 0),
      count: () =>
        get().lines.reduce((s, l) => s + (l.kind === "product" ? l.qty : 1), 0),
    }),
    { name: "kaagaz-cart" }
  )
);
