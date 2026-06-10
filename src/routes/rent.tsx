import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { calcSubtotal, driverData, equipmentData, rentalDays, type Equipment, type RentalType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Truck, Wrench } from "lucide-react";

export const Route = createFileRoute("/rent")({
  head: () => ({
    meta: [
      { title: "Rent Equipment — Rigline Rentals" },
      { name: "description", content: "Browse available equipment and submit a wet or dry rental request." },
    ],
  }),
  component: Rent,
});

function Rent() {
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => equipmentData.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <PageShell
      title="Rent equipment"
      description="Pick a unit, choose dry or wet rental, and submit your booking."
      actions={
        <Input placeholder="Search equipment…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <Card key={e.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img src={e.image} alt={e.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.model}</div>
                </div>
                <Badge variant={e.status === "Available" ? "default" : "secondary"}>{e.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{e.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-lg font-semibold">${e.dayRate.toLocaleString()}</span>
                  <span className="text-muted-foreground"> / day</span>
                </div>
                <Button disabled={e.status !== "Available"} onClick={() => setSelected(e)}>
                  Select <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RentalDialog equipment={selected} onClose={() => setSelected(null)} />
    </PageShell>
  );
}

function RentalDialog({ equipment, onClose }: { equipment: Equipment | null; onClose: () => void }) {
  const { addBooking } = useStore();
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [units, setUnits] = useState(1);
  const [type, setType] = useState<RentalType>("dry");
  const [driverId, setDriverId] = useState<string>("drv-a");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dropoff, setDropoff] = useState("");

  const open = !!equipment;
  const days = rentalDays(startDate, endDate || undefined);
  const subtotal = equipment ? calcSubtotal(equipment.dayRate, units, startDate, endDate || undefined, type) : 0;

  function reset() {
    setProjectName(""); setLocation(""); setStartDate(""); setEndDate(""); setUnits(1);
    setType("dry"); setDriverId("drv-a"); setDeliveryDate(""); setDropoff("");
  }

  function submit() {
    if (!equipment || !projectName || !location || !startDate) {
      toast.error("Please fill in project name, location and start date.");
      return;
    }
    const id = `BK-${2050 + Math.floor(Math.random() * 900)}`;
    const booking = {
      id,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      projectName,
      location,
      startDate,
      endDate: endDate || undefined,
      units,
      type,
      driverId: type === "wet" ? driverId : undefined,
      deliveryDate: type === "wet" ? deliveryDate : undefined,
      dropoffInstructions: type === "wet" ? dropoff : undefined,
      pickupAddress: type === "dry" ? "Yard 3 — 2200 Industrial Pkwy, Odessa TX" : undefined,
      subtotal,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    console.log("New booking submitted", booking);
    addBooking(booking);
    toast.success(`Booking ${id} created`, { description: `${equipment.name} • ${type === "wet" ? "Wet" : "Dry"} rental` });
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rental details — {equipment?.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Project name</Label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Permian 12H" />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Midland, TX" />
            </div>
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>End date <span className="text-xs text-muted-foreground">(optional — open-ended)</span></Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Number of units</Label>
              <Input type="number" min={1} value={units} onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rental type</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as RentalType)}
              className="grid grid-cols-2 gap-3"
            >
              <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${type === "dry" ? "border-primary ring-1 ring-primary" : ""}`}>
                <RadioGroupItem value="dry" id="dry" className="mt-1" />
                <div>
                  <div className="flex items-center gap-2 font-medium"><Wrench className="h-4 w-4" /> Dry Rental</div>
                  <div className="text-xs text-muted-foreground">You pick up and return the unit from our yard.</div>
                </div>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${type === "wet" ? "border-primary ring-1 ring-primary" : ""}`}>
                <RadioGroupItem value="wet" id="wet" className="mt-1" />
                <div>
                  <div className="flex items-center gap-2 font-medium"><Truck className="h-4 w-4" /> Wet Rental</div>
                  <div className="text-xs text-muted-foreground">We deliver to site, drop off and pick up.</div>
                </div>
              </label>
            </RadioGroup>
          </div>

          {type === "dry" ? (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <div className="font-medium">Pickup address</div>
              <div className="text-muted-foreground">Yard 3 — 2200 Industrial Pkwy, Odessa TX • Open 6am–6pm</div>
            </div>
          ) : (
            <div className="space-y-3 rounded-md border p-3">
              <div className="text-sm font-medium">Delivery details</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Delivery driver</Label>
                  <Select value={driverId} onValueChange={setDriverId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {driverData.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Estimated delivery</Label>
                  <Input type="datetime-local" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Site drop-off instructions</Label>
                <Textarea value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Gate code, point of contact, pad location…" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-md bg-primary/5 p-3 text-sm">
            <div className="text-muted-foreground">
              {days || 0} day{days === 1 ? "" : "s"} × {units} unit{units === 1 ? "" : "s"} × ${equipment?.dayRate.toLocaleString()}/day
              {type === "wet" && <span> + wet service</span>}
            </div>
            <div className="text-lg font-semibold">${subtotal.toLocaleString()}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Submit booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
