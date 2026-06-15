import { Link } from "@tanstack/react-router";
import { Home, BookOpen, GraduationCap, Store, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/class-kits", label: "Class", icon: BookOpen },
  { to: "/college-kits", label: "College", icon: GraduationCap },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function MobileNav() {
  const count = useCart((s) => s.count());
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-medium text-muted-foreground"
                activeProps={{ className: "flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-semibold text-primary" }}
                activeOptions={{ exact: it.to === "/" }}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {it.to === "/cart" && count > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {count}
                    </span>
                  )}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
