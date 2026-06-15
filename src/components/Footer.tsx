export function Footer() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold">Kaagaz Stationers</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Right Kit. Right Now. Hyperlocal stationery and printing across Indore.
          </p>
        </div>
        <FooterCol title="Shop" links={[["Class Kits", "/class-kits"], ["College Kits", "/college-kits"], ["Shop", "/shop"], ["Printing", "/printing"]]} />
        <FooterCol title="Service" links={[["Same-day delivery", "/"], ["WhatsApp ordering", "/"], ["COD & UPI", "/"]]} />
        <div>
          <div className="text-sm font-semibold">Indore</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Order till 9 PM for same-day dispatch. Free first delivery.
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Kaagaz Stationers, Indore.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-2 space-y-1.5">
        {links.map(([l, h]) => (
          <li key={l}>
            <a href={h} className="text-sm text-muted-foreground hover:text-foreground">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
