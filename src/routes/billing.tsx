import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { RefreshCcw, Repeat } from "lucide-react";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing & Invoices — Rigline Rentals" }, { name: "description", content: "View invoices and recurring billing profiles." }] }),
  component: Billing,
});

function statusVariant(s: string) {
  if (s === "Paid") return "default" as const;
  if (s === "Overdue") return "destructive" as const;
  return "secondary" as const;
}

function Billing() {
  const { invoices, recurring, bookings, generateNextInvoice, markInvoicePaid } = useStore();

  return (
    <PageShell title="Billing & invoices" description="Recurring billing for long-term rentals and ad-hoc invoices.">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.id}</TableCell>
                  <TableCell>{i.project}</TableCell>
                  <TableCell>{i.date}</TableCell>
                  <TableCell className="text-right">${i.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={statusVariant(i.status)}>{i.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {i.status !== "Paid" && (
                      <Button size="sm" variant="outline" onClick={() => { markInvoicePaid(i.id); toast.success(`${i.id} marked paid`); }}>
                        Mark paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Active rentals — generate next cycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">{b.projectName}</div>
                <div className="text-xs text-muted-foreground">{b.equipmentName} • {b.type === "wet" ? "Wet" : "Dry"} rental • Booking {b.id}</div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  generateNextInvoice(b.projectName, b.subtotal);
                  toast.success("Next cycle invoice generated", { description: `${b.projectName} — $${b.subtotal.toLocaleString()}` });
                }}
              >
                Generate next cycle invoice
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Repeat className="h-4 w-4" /> Recurring billing profiles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Cadence</TableHead>
                <TableHead>Next run</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurring.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.project}</TableCell>
                  <TableCell>{r.cadence}</TableCell>
                  <TableCell>{r.nextRun}</TableCell>
                  <TableCell className="text-right">${r.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
