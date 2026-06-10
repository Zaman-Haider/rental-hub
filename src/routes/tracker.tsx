import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { MapPin, Truck, Wrench } from "lucide-react";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [{ title: "Equipment Tracker — Rigline Rentals" }, { name: "description", content: "Track equipment status across dry and wet rentals." }] }),
  component: Tracker,
});

function stateColor(state: string) {
  if (state.startsWith("On-Site") || state.includes("Custody") || state.startsWith("Checked Out")) return "bg-emerald-100 text-emerald-800";
  if (state.startsWith("In Transit")) return "bg-blue-100 text-blue-800";
  if (state.startsWith("Awaiting")) return "bg-amber-100 text-amber-800";
  if (state.startsWith("Return")) return "bg-purple-100 text-purple-800";
  return "bg-muted text-foreground";
}

function Tracker() {
  const { tracking } = useStore();
  const [filter, setFilter] = useState<"all" | "wet" | "dry">("all");
  const items = tracking.filter((t) => filter === "all" || t.type === filter);

  return (
    <PageShell
      title="Equipment tracker"
      description="Live status of every unit across dry and wet rentals."
      actions={
        <div className="flex gap-1 rounded-md border p-1">
          {(["all", "wet", "dry"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "ghost"} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "wet" ? "Wet" : "Dry"}
            </Button>
          ))}
        </div>
      }
    >
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 w-full overflow-hidden border-b bg-[radial-gradient(circle_at_30%_40%,oklch(0.95_0.02_240),transparent_40%),radial-gradient(circle_at_70%_60%,oklch(0.95_0.04_140),transparent_40%),oklch(0.97_0.005_240)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.92_0.01_240)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.92_0.01_240)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />
            {items.slice(0, 8).map((t, idx) => {
              const left = 8 + ((idx * 13) % 80);
              const top = 12 + ((idx * 19) % 70);
              return (
                <div
                  key={t.id}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full shadow ${t.type === "wet" ? "bg-primary text-primary-foreground" : "bg-emerald-600 text-white"}`}>
                    {t.type === "wet" ? <Truck className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                  </div>
                  <div className="mt-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow">{t.id}</div>
                </div>
              );
            })}
            <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" /> Permian Basin region (mock map)
            </div>
          </div>

          <div className="divide-y">
            {items.map((t) => (
              <div key={t.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${t.type === "wet" ? "bg-primary/10 text-primary" : "bg-emerald-100 text-emerald-700"}`}>
                    {t.type === "wet" ? <Truck className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="font-medium">{t.equipment} <span className="text-xs text-muted-foreground">• {t.id}</span></div>
                    <div className="text-sm text-muted-foreground">{t.location}{t.driver ? ` • ${t.driver}` : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.type === "wet" ? "default" : "secondary"}>{t.type === "wet" ? "Wet" : "Dry"}</Badge>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stateColor(t.state)}`}>{t.state}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
