import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kaagaz Stationers — Same-Day Stationery Delivery in Indore" },
      {
        name: "description",
        content:
          "Class-wise & college-wise verified stationery kits delivered same-day across Indore. Order till 9 PM. COD, UPI & WhatsApp ordering.",
      },
      { name: "author", content: "Kaagaz Stationers" },
      { property: "og:title", content: "Kaagaz Stationers — Same-Day Stationery Delivery in Indore" },
      {
        property: "og:description",
        content: "Same-day stationery delivery in Indore. Verified class & college kits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Kaagaz Stationers — Same-Day Stationery Delivery in Indore" },
      { name: "description", content: "Neighborly Tools connects neighbors to rent tools locally, fostering a sharing economy." },
      { property: "og:description", content: "Neighborly Tools connects neighbors to rent tools locally, fostering a sharing economy." },
      { name: "twitter:description", content: "Neighborly Tools connects neighbors to rent tools locally, fostering a sharing economy." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c423ff1-8faf-4f0b-9c6f-a15a8ca58be4/id-preview-a8885b54--6ea385a1-da76-4254-b195-95d3628b869f.lovable.app-1776867081787.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c423ff1-8faf-4f0b-9c6f-a15a8ca58be4/id-preview-a8885b54--6ea385a1-da76-4254-b195-95d3628b869f.lovable.app-1776867081787.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <MobileNav />
      <Toaster />
    </div>
  );
}
