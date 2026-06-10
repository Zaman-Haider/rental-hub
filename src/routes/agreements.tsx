import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { CheckCircle2, FileSignature } from "lucide-react";
import type { Agreement } from "@/lib/mock-data";

export const Route = createFileRoute("/agreements")({
  head: () => ({ meta: [{ title: "Rental Agreements — Rigline Rentals" }, { name: "description", content: "Review and digitally sign rental agreements." }] }),
  component: Agreements,
});

function Agreements() {
  const { agreements, signAgreement } = useStore();
  const [open, setOpen] = useState<Agreement | null>(null);

  return (
    <PageShell title="Rental agreements" description="Review and sign your rental contracts." >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO #</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.poNumber}</TableCell>
                  <TableCell>{a.bookingRef}</TableCell>
                  <TableCell>{a.project}</TableCell>
                  <TableCell><Badge variant={a.rentalType === "wet" ? "default" : "secondary"}>{a.rentalType === "wet" ? "Wet" : "Dry"}</Badge></TableCell>
                  <TableCell>
                    {a.status === "Signed" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Signed</span>
                    ) : (
                      <Badge variant="outline" className="border-amber-400 text-amber-700">Pending Signature</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status === "Pending Signature" ? (
                      <Button size="sm" onClick={() => setOpen(a)}><FileSignature className="mr-2 h-4 w-4" /> View & Sign</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setOpen(a)}>View</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rental Agreement — {open?.poNumber}</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/40 p-4 text-sm leading-relaxed">
                <p className="font-semibold">RIGLINE RENTALS — EQUIPMENT RENTAL AGREEMENT</p>
                <p className="mt-2">This agreement is entered into between <strong>Acme Drilling Co.</strong> ("Customer") and <strong>Rigline Rentals, Inc.</strong> ("Lessor") for the rental of equipment associated with booking <strong>{open.bookingRef}</strong> on project <strong>{open.project}</strong>.</p>
                <p className="mt-2">
                  <strong>Rental Type:</strong>{" "}
                  {open.rentalType === "wet"
                    ? "Wet Rental — Lessor will deliver the unit to the customer site using a Rigline-employed driver, drop off the equipment at the designated location, and return on request to retrieve the unit. The equipment may remain on-site for an extended period under recurring billing terms (monthly)."
                    : "Dry Rental — Customer will pick up the unit from the Lessor's yard and return it in the same condition. No delivery services are included."}
                </p>
                <p className="mt-2">Customer agrees to standard liability, insurance, and damage terms as outlined in Schedule A. Recurring invoices will be generated automatically on the 1st of each month for on-site equipment.</p>
                <p className="mt-6">Signed at: ______________________ &nbsp; Date: __________</p>
              </div>
              <DialogFooter>
                {open.status === "Pending Signature" ? (
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      signAgreement(open.id);
                      toast.success("Agreement signed", { description: `${open.poNumber} digitally signed.` });
                      setOpen(null);
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Digitally Sign
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setOpen(null)}>Close</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
