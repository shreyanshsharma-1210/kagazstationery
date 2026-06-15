import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, Sparkles, Printer, ArrowRight, Clock, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-stationery.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <Hero />
      <Highlights />
      <KitEntries />
      <PrintingTeaser />
      <Trust />
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-hero">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5" /> Order till 9 PM · Same-day dispatch
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Same-Day Stationery <br className="hidden md:block" />
            Delivery in Indore.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Get accurate school and college kits delivered to your doorstep.
            Class-wise &amp; college-wise verified bundles. Free first delivery.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/class-kits"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-background px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5"
            >
              Find Your Class Kit
            </Link>
            <Link
              to="/college-kits"
              className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/15 bg-background px-5 py-3 text-sm font-bold text-foreground hover:bg-secondary"
            >
              Find Your College Kit
            </Link>
            <a
              href="https://wa.me/919999999999?text=Hi%20Kaagaz%20Stationers%2C%20I%27d%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-whatsapp-foreground shadow-soft hover:bg-whatsapp/90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <p className="mt-5 font-display text-sm font-semibold text-primary">
            “Right Kit. Right Now. Kaagaz Stationers, Indore.”
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-accent/30 blur-3xl" />
          <img
            src={heroImg}
            alt="Books, notebooks, pens and a delivery scooter"
            width={1280}
            height={896}
            className="rounded-3xl shadow-soft"
          />
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { icon: Truck, label: "Same-Day Delivery", sub: "Order till 9 PM" },
    { icon: Sparkles, label: "Free First Delivery", sub: "On your first order" },
    { icon: ShieldCheck, label: "Verified Class Kits", sub: "Indore syllabus ready" },
    { icon: Printer, label: "Up to 50% Off Printing", sub: "Print + deliver same day" },
  ];
  return (
    <section className="mx-auto -mt-6 max-w-6xl px-4">
      <div className="grid gap-3 rounded-2xl border bg-card p-3 shadow-card sm:grid-cols-2 md:grid-cols-4">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KitEntries() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/class-kits"
          className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <div className="text-xs font-semibold uppercase tracking-widest opacity-80">For school students</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold">Find Your Class Kit</h2>
          <p className="mt-2 max-w-md text-sm opacity-90">
            One verified kit per class — Class 1 to 12. Books, notebooks, geometry and stationery, all in one tap.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-sm font-bold text-primary">
            Pick a class <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
        </Link>
        <Link
          to="/college-kits"
          className="group relative overflow-hidden rounded-3xl border-2 border-primary/15 bg-card p-8 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            For college students
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold">Find Your College Kit</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            College → Branch → Year → Verified kit. Books, lab manuals and practical files included.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Start the wizard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </section>
  );
}

function PrintingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-secondary/40 p-6 md:flex-row md:items-center md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Printer className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Print &amp; Deliver — up to 50% off</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your PDFs or docs. Choose copies, color, binding. We print &amp; deliver to your door today.
            </p>
          </div>
        </div>
        <Link
          to="/printing"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          Upload &amp; print <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        <Stat n="9 PM" label="Order cutoff for same-day" />
        <Stat n="100%" label="Verified class & college kits" />
        <Stat n="Indore" label="Hyperlocal pin-code delivery" />
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-background p-6 text-center shadow-card">
      <div className="font-display text-3xl font-extrabold text-primary">{n}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
