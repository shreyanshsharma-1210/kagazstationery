import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Repeat } from "lucide-react";

type Order = {
  id: string;
  total: number;
  slot: string;
  pay: string;
  address: { name: string; line: string };
  createdAt: string;
  status: string;
};

export const Route = createFileRoute("/orders")({
  component: Orders,
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      setOrders(JSON.parse(localStorage.getItem("kaagaz-orders") ?? "[]"));
    } catch {
      setOrders([]);
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Package className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">No orders yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Place your first order — get free delivery.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
      <h1 className="font-display text-2xl font-extrabold md:text-3xl">My Orders</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Order</div>
                <div className="font-display text-lg font-bold">#{o.id}</div>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase">
                {o.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {new Date(o.createdAt).toLocaleString()} · {o.slot} · {o.pay.toUpperCase()}
            </div>
            <div className="mt-2 text-sm">
              Deliver to <span className="font-semibold">{o.address.name}</span>, {o.address.line}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-display text-xl font-extrabold">₹{o.total}</div>
              <button className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary">
                <Repeat className="h-3.5 w-3.5" /> Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
