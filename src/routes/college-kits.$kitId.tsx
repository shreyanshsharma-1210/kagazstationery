import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ArrowLeft, Lock, Plus, Minus, ShoppingBag, Truck, GraduationCap } from "lucide-react";
import { buildCollegeKit, COLLEGES, findProduct, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/college-kits/$kitId")({
  component: CollegeKitDetail,
});

function CollegeKitDetail() {
  const { kitId } = Route.useParams();
  const navigate = useNavigate();
  const addCollegeKit = useCart((s) => s.addCollegeKit);

  const parts = kitId.split("-");
  const [collegeId, branchId, yearStr] = parts;
  const yearNum = Number(yearStr);
  const year = (yearNum >= 1 && yearNum <= 4 ? yearNum : 1) as 1 | 2 | 3 | 4;
  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);
  const isValid = !!(college && branch && yearNum >= 1 && yearNum <= 4);

  const safeCollegeId = college ? collegeId : "sgsits";
  const safeBranchId = branch ? branchId : "cse";
  const kit = useMemo(
    () => buildCollegeKit(safeCollegeId, safeBranchId, year),
    [safeCollegeId, safeBranchId, year]
  );
  const [qtyById, setQtyById] = useState<Record<string, number>>(() =>
    Object.fromEntries(kit.items.map((i) => [i.productId, i.qty]))
  );
  const [showAdder, setShowAdder] = useState(false);

  const itemsTotal = useMemo(
    () =>
      kit.items.reduce((s, it) => {
        const qty = qtyById[it.productId] ?? 0;
        const p = findProduct(it.productId);
        return s + (p ? p.price * qty : 0);
      }, 0),
    [kit, qtyById]
  );
  const bundleTotal = Math.round(itemsTotal * 0.9);
  const savings = itemsTotal - bundleTotal;

  if (!isValid || !college || !branch) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Kit not found</h1>
        <Link to="/college-kits" className="mt-4 inline-block text-primary underline">
          Restart wizard
        </Link>
      </div>
    );
  }

  function handleBuy() {
    addCollegeKit(kit.id);
    toast.success("College kit added to cart");
    navigate({ to: "/cart" });
  }

  const grouped = {
    "Core Books": kit.items.filter((i) => i.productId.startsWith("tb-")),
    "Lab Manuals & Practical Files": kit.items.filter(
      (i) => i.productId.startsWith("p-lab") || i.productId === "p-prac-file"
    ),
    "Notebooks & Files": kit.items.filter((i) => i.productId.startsWith("p-nb")),
    "Tools & Stationery": kit.items.filter((i) =>
      ["p-pen-blue", "p-pencil", "p-highlighter", "p-marker", "p-calc", "p-drafter"].includes(i.productId)
    ),
  };

  const extraOptions = PRODUCTS.filter(
    (p) => !kit.items.some((it) => it.productId === p.id) && (p.category === "College" || p.category === "Office")
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <Link to="/college-kits" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Restart wizard
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-soft md:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" /> College-verified kit
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">{kit.title}</h1>
        <div className="mt-3 grid gap-2 text-sm opacity-90 sm:grid-cols-3">
          <SummaryStat label="College" value={college.short} />
          <SummaryStat label="Branch" value={branch.name} />
          <SummaryStat label="Year" value={year === 4 ? "Final" : `Year ${year}`} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-90">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-4 w-4" /> {kit.expectedDelivery}
          </span>
          <span>· {kit.items.length} items</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {Object.entries(grouped).map(([section, items]) =>
            items.length === 0 ? null : (
              <section key={section}>
                <h2 className="font-display text-lg font-bold">{section}</h2>
                <div className="mt-2 divide-y rounded-2xl border bg-card shadow-card">
                  {items.map((it) => (
                    <ItemRow
                      key={it.productId}
                      productId={it.productId}
                      qty={qtyById[it.productId] ?? 0}
                      required={it.required}
                      note={it.note}
                      onQty={(q) =>
                        setQtyById((s) => ({ ...s, [it.productId]: Math.max(0, q) }))
                      }
                    />
                  ))}
                </div>
              </section>
            )
          )}

          <div>
            <button
              onClick={() => setShowAdder((s) => !s)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" /> {showAdder ? "Hide extras" : "+ Add more items"}
            </button>
            {showAdder && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {extraOptions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setQtyById((s) => ({ ...s, [p.id]: (s[p.id] ?? 0) + 1 }));
                      toast.success(`${p.name} added`);
                    }}
                    className="flex items-center justify-between rounded-xl border bg-card px-3 py-2 text-left text-sm hover:border-primary"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="ml-2 shrink-0 font-semibold">₹{p.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated total</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold">₹{bundleTotal}</span>
              {savings > 0 && (
                <span className="text-sm text-muted-foreground line-through">₹{itemsTotal}</span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-1 text-xs font-semibold text-success">
                You save ₹{savings} as a bundle
              </div>
            )}
            <button
              onClick={handleBuy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              <ShoppingBag className="h-4 w-4" /> Buy Complete Kit
            </button>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="h-3 w-3" /> Includes college-printed materials
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-display text-lg font-extrabold">₹{bundleTotal}</div>
          </div>
          <button
            onClick={handleBuy}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Buy Complete Kit
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
      <div className="font-display text-sm font-bold">{value}</div>
    </div>
  );
}

function ItemRow({
  productId,
  qty,
  required,
  note,
  onQty,
}: {
  productId: string;
  qty: number;
  required: boolean;
  note?: string;
  onQty: (q: number) => void;
}) {
  const p = findProduct(productId);
  if (!p) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold uppercase text-muted-foreground">
        {p.name.slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold">{p.name}</div>
          {required && (
            <span title={note ?? "Required"} className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> Required
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {p.brand} · ₹{p.price}/unit
          {note && !required ? <> · {note}</> : null}
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full border bg-background p-1">
        <button
          disabled={required && qty <= 1}
          onClick={() => onQty(qty - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary disabled:opacity-30"
          aria-label="Decrease"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-bold">{qty}</span>
        <button
          onClick={() => onQty(qty + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          aria-label="Increase"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
