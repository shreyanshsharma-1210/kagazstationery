import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, MapPin, GraduationCap } from "lucide-react";
import { toast } from "sonner";

type Profile = {
  name: string;
  phone: string;
  email: string;
  schoolOrCollege: string;
  classOrBranch: string;
};

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState<Profile>({
    name: "",
    phone: "",
    email: "",
    schoolOrCollege: "",
    classOrBranch: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kaagaz-profile");
      if (stored) setP(JSON.parse(stored));
    } catch {}
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("kaagaz-profile", JSON.stringify(p));
    toast.success("Profile saved");
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-2xl px-4 py-8 md:py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-extrabold">Your profile</h1>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-5 shadow-card">
        <Field label="Full name" value={p.name} onChange={(v) => setP({ ...p, name: v })} />
        <Field label="Phone (WhatsApp)" value={p.phone} onChange={(v) => setP({ ...p, phone: v })} type="tel" />
        <Field label="Email (optional)" value={p.email} onChange={(v) => setP({ ...p, email: v })} type="email" />
        <div className="border-t pt-4">
          <div className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" /> Save for faster recommendations
          </div>
          <Field label="School / College" value={p.schoolOrCollege} onChange={(v) => setP({ ...p, schoolOrCollege: v })} />
          <Field label="Class / Branch" value={p.classOrBranch} onChange={(v) => setP({ ...p, classOrBranch: v })} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-secondary/40 p-4 text-sm">
        <div className="inline-flex items-center gap-1 font-semibold">
          <MapPin className="h-4 w-4" /> Saved addresses
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          You can add Home, Hostel/PG and College addresses during checkout.
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
      >
        Save profile
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
