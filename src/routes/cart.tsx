import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShoppingBag, Trash2, Truck, Tag, MessageCircle } from "lucide-react";
import { useCart, lineLabel, linePrice } from "@/lib/cart-store";
import { findProduct, buildClassKit, buildCollegeKit } from "@/lib/mock-data";
import type { CartLine } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

function Cart() {
  const lines = useCart((s) => s.lines);
  const removeLine = useCart((s) => s.removeLine);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const total = useCart((s) => s.total());
  const navigate = useNavigate();

  const groups = useMemo(() => {
    const g: Record<string, { idx: number; line: CartLine }[]> = {
      "Class Kits": [],
      "College Kits": [],
      "Individual Items": [],
      Printing: [],
    };
    lines.forEach((line, idx) => {
      if (line.kind === "classKit") g["Class Kits"].push({ idx, line });
      else if (line.kind === "collegeKit") g["College Kits"].push({ idx, line });
      else if (line.kind === "printing") g["Printing"].push({ idx, line });
      else g["Individual Items"].push({ idx, line });
    });
    return g;
  }, [lines]);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a class kit, college kit, or shop individual stationery.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/class-kits" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Class Kits
          </Link>
          <Link to="/college-kits" className="rounded-full border px-4 py-2 text-sm font-bold">
            College Kits
          </Link>
          <Link to="/shop" className="rounded-full border px-4 py-2 text-sm font-bold">
            Shop
          </Link>
        </div>
        <div className="mt-8 rounded-2xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
          Just want to send a handwritten booklist?{" "}
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20here%27s%20my%20booklist%20photo"
            className="font-semibold text-whatsapp underline"
          >
            Send a photo on WhatsApp
          </a>{" "}
          — we'll build your kit.
        </div>
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `New order from Kaagaz Stationers Web:\n${lines.map((l) => `• ${lineLabel(l)} — ₹${linePrice(l)}`).join("\n")}\nTotal: ₹${total}`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold md:text-3xl">Your Cart</h1>
        <button
          onClick={() => {
            clear();
            toast("Cart cleared");
          }}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {Object.entries(groups).map(([title, entries]) =>
            entries.length === 0 ? null : (
              <section key={title}>
                <h2 className="font-display text-lg font-bold">{title}</h2>
                <div className="mt-2 divide-y rounded-2xl border bg-card shadow-card">
                  {entries.map(({ idx, line }) => (
                    <CartRow
                      key={idx}
                      line={line}
                      onRemove={() => {
                        removeLine(idx);
                        toast("Item removed");
                      }}
                      onQty={(q) => setQty(idx, q)}
                    />
                  ))}
                </div>
              </section>
            )
          )}

          <div className="rounded-2xl border bg-secondary/50 p-4">
            <div className="flex items-start gap-2 text-sm">
              <Tag className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <div className="font-semibold">First-order discount auto-applied</div>
                <div className="text-xs text-muted-foreground">
                  Free first delivery in Indore. Order before 9 PM for same-day dispatch.
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <SummaryRow label="Items total" value={`₹${total}`} />
            <SummaryRow label="Delivery" value="FREE (first order)" success />
            <div className="my-3 border-t" />
            <div className="flex items-baseline justify-between">
              <span className="font-display text-base font-bold">Total</span>
              <span className="font-display text-2xl font-extrabold">₹{total}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Truck className="h-3 w-3" /> Same-day delivery available
            </div>
            <button
              onClick={() => navigate({ to: "/checkout" })}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Proceed to Checkout
            </button>
            <a
              href={`https://wa.me/919999999999?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground shadow-soft hover:bg-whatsapp/90"
            >
              <MessageCircle className="h-4 w-4" /> Send order on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={success ? "font-semibold text-success" : "font-semibold"}>{value}</span>
    </div>
  );
}

function CartRow({
  line,
  onRemove,
  onQty,
}: {
  line: CartLine;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  const price = linePrice(line);
  const label = lineLabel(line);
  let sub = "";
  if (line.kind === "product") {
    const p = findProduct(line.productId);
    sub = p ? `${p.brand ?? ""} · ₹${p.price}/unit` : "";
  } else if (line.kind === "classKit") {
    const parts = line.kitId.split("-");
    const cls = Number(parts[1]);
    const stream = parts[2];
    const s = stream ? ((stream[0].toUpperCase() + stream.slice(1)) as "Science" | "Commerce" | "Arts") : undefined;
    const kit = buildClassKit(cls, s);
    sub = `${kit.items.length} items · saved as bundle`;
  } else if (line.kind === "collegeKit") {
    const [c, b, y] = line.kitId.split("-");
    const kit = buildCollegeKit(c, b, Number(y) as 1 | 2 | 3 | 4);
    sub = `${kit.items.length} items · ${kit.expectedDelivery}`;
  } else if (line.kind === "printing") {
    sub = line.summary;
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold uppercase text-muted-foreground">
        {label.slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</div>
      </div>
      {line.kind === "product" ? (
        <div className="flex items-center gap-1 rounded-full border bg-background p-1">
          <button
            onClick={() => onQty(line.qty - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
          <button
            onClick={() => onQty(line.qty + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            +
          </button>
        </div>
      ) : null}
      <div className="w-20 text-right font-display text-sm font-bold">₹{price}</div>
      <button
        onClick={onRemove}
        aria-label="Remove"
        className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
