import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Check } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/shop")({
  component: Shop,
});

const CATEGORIES = ["All", "School", "College", "Office", "Art & Craft", "Printing"] as const;

function Shop() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sameDayOnly, setSameDayOnly] = useState(false);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (p.price > maxPrice) return false;
      if (sameDayOnly && !p.sameDay) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, cat, maxPrice, sameDayOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">Shop</h1>
      <p className="text-sm text-muted-foreground">
        Notebooks, pens, files, calculators &amp; more — same-day delivery in Indore.
      </p>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border bg-background px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notebooks, pens, geometry box..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <label className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2.5 text-sm">
          <input
            type="checkbox"
            checked={sameDayOnly}
            onChange={(e) => setSameDayOnly(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Same-day eligible
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>Up to ₹{maxPrice}</span>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-primary"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No products match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product: p }: { product: (typeof PRODUCTS)[number] }) {
  const addProduct = useCart((s) => s.addProduct);
  const [added, setAdded] = useState(false);
  const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-4 shadow-card transition-transform hover:-translate-y-0.5">
      <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent/20 text-2xl font-display font-extrabold text-muted-foreground">
        {p.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</div>
        <div className="mt-0.5 line-clamp-2 text-sm font-semibold">{p.name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold">₹{p.price}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{p.mrp}</span>
              <span className="text-xs font-semibold text-success">-{discount}%</span>
            </>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {p.sameDay && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold">Same-day</span>
          )}
          {p.inStock ? (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
              In stock
            </span>
          ) : (
            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
              Out of stock
            </span>
          )}
        </div>
        <button
          disabled={!p.inStock}
          onClick={() => {
            addProduct(p.id, 1);
            setAdded(true);
            toast.success(`${p.name} added to cart`);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-50"
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
