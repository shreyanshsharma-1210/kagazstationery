import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, GraduationCap, ArrowRight, Check } from "lucide-react";
import { COLLEGES } from "@/lib/mock-data";

export const Route = createFileRoute("/college-kits/")({
  component: CollegeWizard,
});

type Step = 1 | 2 | 3 | 4;

function CollegeWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [year, setYear] = useState<1 | 2 | 3 | 4 | null>(null);
  const [query, setQuery] = useState("");

  const college = COLLEGES.find((c) => c.id === collegeId);
  const branch = college?.branches.find((b) => b.id === branchId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COLLEGES;
    return COLLEGES.filter((c) => c.name.toLowerCase().includes(q) || c.short.toLowerCase().includes(q));
  }, [query]);

  function handleFinish() {
    if (!collegeId || !branchId || !year) return;
    navigate({
      to: "/college-kits/$kitId",
      params: { kitId: `${collegeId}-${branchId}-${year}` },
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Find Your College Kit</h1>
          <p className="text-sm text-muted-foreground">A personalized kit, in 4 quick steps.</p>
        </div>
      </div>

      <Stepper step={step} />

      <div className="mt-6 rounded-3xl border bg-card p-5 shadow-card md:p-7">
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold">Step 1 — Choose your college</h2>
            <div className="mt-3 flex items-center gap-2 rounded-full border bg-background px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Indore colleges..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-4 grid gap-2">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCollegeId(c.id);
                    setBranchId(null);
                    setYear(null);
                    setStep(2);
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all hover:border-primary ${
                    collegeId === c.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold">{c.short}</div>
                    <div className="text-xs text-muted-foreground">{c.name}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              <button className="rounded-2xl border-2 border-dashed border-muted-foreground/30 px-4 py-3 text-left text-sm text-muted-foreground hover:border-primary hover:text-primary">
                My college is not listed — request a custom kit
              </button>
            </div>
          </div>
        )}

        {step === 2 && college && (
          <div>
            <h2 className="font-display text-xl font-bold">
              Step 2 — Choose your course/branch
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{college.short}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {college.branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBranchId(b.id);
                    setStep(3);
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all hover:border-primary ${
                    branchId === b.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.group}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(1)} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold">Step 3 — Which year?</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y as 1 | 2 | 3 | 4);
                    setStep(4);
                  }}
                  className={`rounded-2xl border px-4 py-4 text-center font-display text-xl font-extrabold transition-all hover:border-primary ${
                    year === y ? "border-primary bg-primary/5 text-primary" : ""
                  }`}
                >
                  {y === 4 ? "Final" : `${y}${y === 1 ? "st" : y === 2 ? "nd" : "rd"}`}
                </button>
              ))}
            </div>
            <BackBtn onClick={() => setStep(2)} />
          </div>
        )}

        {step === 4 && college && branch && year && (
          <div>
            <h2 className="font-display text-xl font-bold">Step 4 — Confirm &amp; view your kit</h2>
            <div className="mt-4 space-y-2 rounded-2xl bg-secondary/60 p-4 text-sm">
              <Row label="College" value={college.short} />
              <Row label="Branch" value={branch.name} />
              <Row label="Year" value={year === 4 ? "Final" : `Year ${year}`} />
            </div>
            <button
              onClick={handleFinish}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              View College Kit <ArrowRight className="h-4 w-4" />
            </button>
            <BackBtn onClick={() => setStep(3)} />
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Can't find your kit?{" "}
        <a href="https://wa.me/919999999999" className="font-semibold text-primary underline">
          Send your booklist on WhatsApp
        </a>
      </p>
      <div className="mt-2 text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="mt-6 flex items-center gap-2">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              n < step
                ? "bg-primary text-primary-foreground"
                : n === step
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {n < step ? <Check className="h-3.5 w-3.5" /> : n}
          </div>
          {n < 4 && <div className={`h-0.5 flex-1 rounded ${n < step ? "bg-primary" : "bg-secondary"}`} />}
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
      ← Back
    </button>
  );
}
