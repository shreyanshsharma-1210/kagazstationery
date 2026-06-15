import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ArrowLeft, Lock, Plus, Minus, ShoppingBag, Truck } from "lucide-react";
import { buildClassKit, findProduct, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/class-kits/$classId")({
  component: ClassKitDetail,
});

function parseClassId(classId: string): { cls: number; stream?: "Science" | "Commerce" | "Arts" } | null {
  const parts = classId.split("-");
  const cls = Number(parts[0]);
  if (!cls || cls < 1 || cls > 12) return null;
  const streamRaw = parts[1];
  if (!streamRaw) return { cls };
  const stream = (streamRaw[0].toUpperCase() + streamRaw.slice(1)) as "Science" | "Commerce" | "Arts";
  if (!["Science", "Commerce", "Arts"].includes(stream)) return { cls };
  return { cls, stream };
}

function ClassKitDetail() {
  const { classId } = Route.useParams();
  const parsed = parseClassId(classId);
  const navigate = useNavigate();
  const addClassKit = useCart((s) => s.addClassKit);

  const safe = parsed ?? { cls: 1, stream: undefined };
  const kit = useMemo(() => buildClassKit(safe.cls, safe.stream), [safe.cls, safe.stream]);

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
  const bundleTotal = Math.round(itemsTotal * 0.92);
  const savings = itemsTotal - bundleTotal;

  if (!parsed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Class not found</h1>
        <Link to="/class-kits" className="mt-4 inline-block text-primary underline">
          Back to class kits
        </Link>
      </div>
    );
  }

  function setQty(id: string, qty: number) {
    setQtyById((s) => ({ ...s, [id]: Math.max(0, qty) }));
  }

  function handleBuy() {
    addClassKit(kit.id);
    toast.success("Kit added to cart");
    navigate({ to: "/cart" });
  }

  const grouped = {
    Books: kit.items.filter((i) => i.productId.startsWith("tb-")),
    Notebooks: kit.items.filter((i) => i.productId.startsWith("p-nb")),
    "Writing & Tools": kit.items.filter((i) =>
      ["p-pen-blue", "p-pencil", "p-eraser", "p-ruler", "p-geo", "p-calc"].includes(i.productId)
    ),
    "Lab & Practicals": kit.items.filter((i) => i.productId.startsWith("p-lab") || i.productId === "p-prac-file"),
    Extras: kit.items.filter((i) => ["p-cover", "p-label", "p-exam-pad"].includes(i.productId)),
  };

  const extraOptions = PRODUCTS.filter(
    (p) => !kit.items.some((it) => it.productId === p.id) && p.category === "School"
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <Link to="/class-kits" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All classes
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-soft md:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" /> {kit.badge}
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">{kit.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-90">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-4 w-4" /> Same-day delivery in Indore
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
                      onQty={(q) => setQty(it.productId, q)}
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
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Kit total</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold">₹{bundleTotal}</span>
              {savings > 0 && (
                <span className="text-sm text-muted-foreground line-through">₹{itemsTotal}</span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-1 text-xs font-semibold text-success">
                You save ₹{savings} with this kit
              </div>
            )}
            <button
              onClick={handleBuy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              <ShoppingBag className="h-4 w-4" /> Buy Complete Set
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Required items are locked by syllabus. Optional items can be removed above.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Kit total</div>
            <div className="font-display text-lg font-extrabold">₹{bundleTotal}</div>
          </div>
          <button
            onClick={handleBuy}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Buy Complete Set
          </button>
        </div>
      </div>
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
            <span title={note ?? "Required by syllabus"} className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> Required
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {p.brand} · MRP ₹{p.mrp} · ₹{p.price}/unit
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
