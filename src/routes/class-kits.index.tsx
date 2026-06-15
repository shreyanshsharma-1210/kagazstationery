import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/class-kits/")({
  component: ClassKitsList,
});

const STREAMS = ["Science", "Commerce", "Arts"] as const;

function ClassKitsList() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold md:text-3xl">Class Kits</h1>
          <p className="text-sm text-muted-foreground">
            One verified kit per class. Indore syllabus ready.
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Class 1 – 10
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
          <Link
            key={cls}
            to="/class-kits/$classId"
            params={{ classId: String(cls) }}
            className="group flex items-center justify-between rounded-2xl border bg-card px-4 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Class</div>
              <div className="font-display text-2xl font-extrabold">{cls}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Class 11 &amp; 12 — pick stream
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {[11, 12].flatMap((cls) =>
          STREAMS.map((stream) => (
            <Link
              key={`${cls}-${stream}`}
              to="/class-kits/$classId"
              params={{ classId: `${cls}-${stream.toLowerCase()}` }}
              className="group flex items-center justify-between rounded-2xl border bg-card px-4 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Class {cls}
                </div>
                <div className="font-display text-lg font-bold">{stream}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
