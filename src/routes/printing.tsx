import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, Upload, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/printing")({
  component: Printing,
});

function Printing() {
  const addPrinting = useCart((s) => s.addPrinting);
  const navigate = useNavigate();

  const [pages, setPages] = useState(20);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState<"bw" | "color">("bw");
  const [sided, setSided] = useState<"single" | "duplex">("single");
  const [size, setSize] = useState<"A4" | "A3">("A4");
  const [binding, setBinding] = useState<"none" | "staple" | "spiral" | "file">("none");
  const [delivery, setDelivery] = useState<"deliver" | "pickup">("deliver");
  const [filename, setFilename] = useState<string | null>(null);

  // Pricing
  const perPage = color === "color" ? (size === "A3" ? 12 : 6) : (size === "A3" ? 4 : 2);
  const sideMult = sided === "duplex" ? 0.85 : 1;
  const bindingCost = { none: 0, staple: 5, spiral: 40, file: 25 }[binding];
  const subtotal = Math.round(pages * copies * perPage * sideMult + bindingCost);
  const discount = pickupOrBigDiscount(subtotal, delivery);
  const total = subtotal - discount;
  const discountPct = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

  function handleAdd() {
    const summary = `${pages} pages × ${copies} copies · ${color === "bw" ? "B&W" : "Color"} · ${size} · ${sided} · ${binding}`;
    addPrinting(total, summary);
    toast.success("Print job added to cart");
    navigate({ to: "/cart" });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Printer className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Print &amp; Deliver</h1>
          <p className="text-sm text-muted-foreground">
            Up to 50% off. Same-day printing &amp; delivery in Indore.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Upload */}
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-bold">1. Upload your file</h2>
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/40 px-4 py-8 text-center transition-colors hover:bg-secondary">
              <Upload className="h-6 w-6 text-primary" />
              <div className="text-sm font-semibold">
                {filename ? filename : "Click to upload PDF, DOC, DOCX or images"}
              </div>
              <div className="text-xs text-muted-foreground">Max 50 MB · Multiple files supported</div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFilename(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </section>

          {/* Options */}
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-bold">2. Print options</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField label="Total pages" value={pages} onChange={setPages} min={1} />
              <NumberField label="Number of copies" value={copies} onChange={setCopies} min={1} />
              <Choice label="Color" value={color} onChange={setColor} options={[["bw", "Black & White"], ["color", "Color"]]} />
              <Choice label="Sides" value={sided} onChange={setSided} options={[["single", "One-sided"], ["duplex", "Duplex (-15%)"]]} />
              <Choice label="Paper size" value={size} onChange={setSize} options={[["A4", "A4"], ["A3", "A3"]]} />
              <Choice label="Binding" value={binding} onChange={setBinding} options={[["none", "None"], ["staple", "Staple"], ["spiral", "Spiral"], ["file", "File"]]} />
            </div>
          </section>

          {/* Fulfilment */}
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-bold">3. Fulfilment</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Pill active={delivery === "deliver"} onClick={() => setDelivery("deliver")} title="Print & Deliver" sub="To your doorstep" />
              <Pill active={delivery === "pickup"} onClick={() => setDelivery("pickup")} title="Store Pickup" sub="-10% (students near shop)" />
            </div>
          </section>
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated total</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold">₹{total}</span>
              {discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">₹{subtotal}</span>
              )}
            </div>
            {/* Discount progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-success">
                  <Tag className="h-3 w-3" /> Up to 50% off
                </span>
                <span className="text-muted-foreground">{discountPct}% applied</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-success transition-all" style={{ width: `${Math.min(100, discountPct * 2)}%` }} />
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Add to cart <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/cart" className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground">
              View cart
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function pickupOrBigDiscount(subtotal: number, delivery: "deliver" | "pickup") {
  let d = 0;
  if (delivery === "pickup") d += subtotal * 0.1;
  if (subtotal >= 500) d += subtotal * 0.15;
  if (subtotal >= 1500) d += subtotal * 0.1;
  return Math.round(Math.min(subtotal * 0.5, d));
}

function NumberField({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value || 0)))}
        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              value === v ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/40"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Pill({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 rounded-2xl border p-3 text-left transition-all ${
        active ? "border-primary bg-primary/5 shadow-soft" : "hover:border-primary/40"
      }`}
    >
      <div className="text-sm font-bold">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}
