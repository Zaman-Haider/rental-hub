import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings — Rigline Rentals" }, { name: "description", content: "All your equipment bookings." }] }),
  component: Bookings,
});

function Bookings() {
  const { bookings } = useStore();
  return (
    <PageShell title="My bookings" description="Every dry and wet rental you've submitted.">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.id}</TableCell>
                  <TableCell>{b.equipmentName} × {b.units}</TableCell>
                  <TableCell>
                    <div>{b.projectName}</div>
                    <div className="text-xs text-muted-foreground">{b.location}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.type === "wet" ? "default" : "secondary"}>{b.type === "wet" ? "Wet" : "Dry"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.startDate} → {b.endDate ?? <span className="text-muted-foreground">open-ended</span>}
                  </TableCell>
                  <TableCell className="text-right font-semibold">${b.subtotal.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
