import { Link } from "@tanstack/react-router";
import { ShoppingBag, BookOpen, GraduationCap, Store, Printer } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function Header() {
  const count = useCart((s) => s.count());
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Kaagaz</div>
            <div className="-mt-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Stationers · Indore
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/class-kits" icon={<BookOpen className="h-4 w-4" />} label="Class Kits" />
          <NavItem to="/college-kits" icon={<GraduationCap className="h-4 w-4" />} label="College Kits" />
          <NavItem to="/shop" icon={<Store className="h-4 w-4" />} label="Shop" />
          <NavItem to="/printing" icon={<Printer className="h-4 w-4" />} label="Printing" />
        </nav>

        <Link
          to="/cart"
          className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold bg-secondary text-foreground" }}
    >
      {icon}
      {label}
    </Link>
  );
}
