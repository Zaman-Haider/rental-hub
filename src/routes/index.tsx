import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Activity, FileSignature, Receipt, Truck, PackagePlus } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Rigline Rentals" },
      { name: "description", content: "Overview of active rentals, deliveries, agreements and invoices." },
    ],
  }),
  component: Dashboard,
});

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warn" | "danger" | "success";
}) {
  const toneClass =
    tone === "warn"
      ? "bg-amber-100 text-amber-700"
      : tone === "danger"
      ? "bg-red-100 text-red-700"
      : tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-md ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { bookings, agreements, invoices, tracking, activity } = useStore();
  const activeRentals = tracking.filter((t) => !t.state.startsWith("Awaiting") && !t.state.startsWith("Return")).length;
  const upcomingDeliveries = tracking.filter((t) => t.type === "wet" && (t.state.startsWith("Awaiting") || t.state.startsWith("In Transit"))).length;
  const pendingAgreements = agreements.filter((a) => a.status === "Pending Signature").length;
  const unpaid = invoices.filter((i) => i.status !== "Paid").length;

  return (
    <PageShell
      title="Welcome back, Acme Drilling"
      description="A snapshot of your rentals, deliveries and billing."
      actions={
        <Button asChild>
          <Link to="/rent">
            <PackagePlus className="mr-2 h-4 w-4" /> Rent equipment
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active rentals" value={activeRentals} hint={`${bookings.length} bookings on file`} icon={Truck} tone="success" />
        <Stat label="Upcoming deliveries (wet)" value={upcomingDeliveries} hint="In transit or queued" icon={Truck} tone="default" />
        <Stat label="Pending DocuSign" value={pendingAgreements} hint="Awaiting signature" icon={FileSignature} tone="warn" />
        <Stat label="Unpaid invoices" value={unpaid} hint="Includes overdue" icon={Receipt} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{a.text}</span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live unit status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tracking.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div>
                  <div className="font-medium">{t.equipment}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
                <Badge variant={t.type === "wet" ? "default" : "secondary"}>{t.state}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/tracker">Open tracker</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
