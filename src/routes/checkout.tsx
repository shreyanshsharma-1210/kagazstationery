import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Sun, Calendar, Wallet, Smartphone, CreditCard, Check } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

function Checkout() {
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line: "",
    pincode: "452001",
    landmark: "",
    type: "Home" as "Home" | "Hostel/PG" | "College",
  });
  const [slot, setSlot] = useState<"sameday" | "express" | "scheduled">("sameday");
  const [pay, setPay] = useState<"cod" | "upi" | "card">("cod");
  const [placing, setPlacing] = useState(false);

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">
          Go to shop
        </Link>
      </div>
    );
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!address.name || !address.phone || !address.line) {
      toast.error("Please complete your address");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const orderId = "KZ" + Math.floor(100000 + Math.random() * 900000);
      try {
        const orders = JSON.parse(localStorage.getItem("kaagaz-orders") ?? "[]");
        orders.unshift({
          id: orderId,
          total,
          slot,
          pay,
          address,
          createdAt: new Date().toISOString(),
          status: "New",
        });
        localStorage.setItem("kaagaz-orders", JSON.stringify(orders));
      } catch {}
      clear();
      toast.success(`Order ${orderId} placed!`);
      navigate({ to: "/orders" });
    }, 800);
  }

  return (
    <form onSubmit={placeOrder} className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">Checkout</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Address */}
          <Section
            n={1}
            icon={<MapPin className="h-5 w-5" />}
            title="Delivery address"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} required />
              <Field label="Phone (WhatsApp)" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} required type="tel" />
              <div className="sm:col-span-2">
                <Field label="House / flat / street" value={address.line} onChange={(v) => setAddress({ ...address, line: v })} required />
              </div>
              <Field label="Pincode (Indore)" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} required />
              <Field label="Landmark (optional)" value={address.landmark} onChange={(v) => setAddress({ ...address, landmark: v })} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["Home", "Hostel/PG", "College"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddress({ ...address, type: t })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    address.type === t ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <Check className="h-3 w-3" /> Deliverable in your area
            </div>
          </Section>

          {/* Slot */}
          <Section n={2} icon={<Clock className="h-5 w-5" />} title="Delivery option">
            <div className="grid gap-2 sm:grid-cols-3">
              <SlotCard
                active={slot === "sameday"}
                onClick={() => setSlot("sameday")}
                icon={<Clock className="h-4 w-4" />}
                title="Same-Day Standard"
                sub="Order before 9 PM"
                badge="Most popular"
              />
              <SlotCard
                active={slot === "express"}
                onClick={() => setSlot("express")}
                icon={<Sun className="h-4 w-4" />}
                title="Early Morning Express"
                sub="6 – 8 AM slot"
              />
              <SlotCard
                active={slot === "scheduled"}
                onClick={() => setSlot("scheduled")}
                icon={<Calendar className="h-4 w-4" />}
                title="Scheduled"
                sub="Pick a date & window"
              />
            </div>
          </Section>

          {/* Payment */}
          <Section n={3} icon={<Wallet className="h-5 w-5" />} title="Payment method">
            <div className="grid gap-2 sm:grid-cols-3">
              <SlotCard
                active={pay === "cod"}
                onClick={() => setPay("cod")}
                icon={<Wallet className="h-4 w-4" />}
                title="Cash on Delivery"
                sub="Pay when you receive"
                badge="Popular in Indore"
              />
              <SlotCard
                active={pay === "upi"}
                onClick={() => setPay("upi")}
                icon={<Smartphone className="h-4 w-4" />}
                title="UPI"
                sub="GPay / PhonePe / Paytm"
              />
              <SlotCard
                active={pay === "card"}
                onClick={() => setPay("card")}
                icon={<CreditCard className="h-4 w-4" />}
                title="Card"
                sub="Debit / Credit"
              />
            </div>
          </Section>
        </div>

        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total payable</div>
            <div className="mt-1 font-display text-3xl font-extrabold">₹{total}</div>
            <div className="mt-1 text-xs text-success font-semibold">Free first delivery</div>
            <button
              type="submit"
              disabled={placing}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60"
            >
              {placing ? "Placing order..." : `Place order (${pay.toUpperCase()})`}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              By placing this order you agree to receive WhatsApp/SMS updates from Kaagaz Stationers.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Section({
  n,
  icon,
  title,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-card">
      <header className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {n}
        </div>
        <div className="flex items-center gap-1.5 font-display text-base font-bold">
          {icon} {title}
        </div>
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        type={type}
        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SlotCard({
  active,
  onClick,
  icon,
  title,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
        active ? "border-primary bg-primary/5 shadow-soft" : "hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-1.5 text-sm font-bold">{icon} {title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
      {badge && (
        <span className="absolute right-2 top-2 rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}
