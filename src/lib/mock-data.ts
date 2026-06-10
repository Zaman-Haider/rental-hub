export type RentalType = "dry" | "wet";

export type Equipment = {
  id: string;
  name: string;
  model: string;
  description: string;
  status: "Available" | "In-Use";
  dayRate: number;
  image: string;
};

export type Driver = { id: string; name: string; phone: string };

export type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  projectName: string;
  location: string;
  startDate: string;
  endDate?: string;
  units: number;
  type: RentalType;
  driverId?: string;
  deliveryDate?: string;
  dropoffInstructions?: string;
  pickupAddress?: string;
  subtotal: number;
  createdAt: string;
};

export type Agreement = {
  id: string;
  poNumber: string;
  bookingRef: string;
  project: string;
  rentalType: RentalType;
  status: "Pending Signature" | "Signed";
  createdAt: string;
};

export type Invoice = {
  id: string;
  project: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
};

export type RecurringProfile = {
  id: string;
  project: string;
  cadence: string;
  nextRun: string;
  amount: number;
};

export type TrackedUnit = {
  id: string;
  equipment: string;
  type: RentalType;
  state: string;
  location: string;
  driver?: string;
};

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  kind: "delivery" | "signature" | "billing" | "booking" | "tracking";
};

export const equipmentData: Equipment[] = [
  {
    id: "bop-500",
    name: "BOP Unit 500",
    model: "5000 PSI Annular",
    description: "Blowout preventer rated for high-pressure well control operations.",
    status: "Available",
    dayRate: 850,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  },
  {
    id: "bop-405",
    name: "BOP Unit 405",
    model: "10000 PSI Double Ram",
    description: "Dual-ram BOP for deep well intervention work.",
    status: "In-Use",
    dayRate: 1200,
    image: "https://images.unsplash.com/photo-1565793979206-3a05a5d4eb29?w=800&q=80",
  },
  {
    id: "gen-200",
    name: "Diesel Generator 200kW",
    model: "CAT XQ200",
    description: "Skid-mounted 200kW generator with 24hr fuel tank.",
    status: "Available",
    dayRate: 320,
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80",
  },
  {
    id: "comp-air",
    name: "Air Compressor 1600 CFM",
    model: "Sullair 1600H",
    description: "High-volume air compressor for drilling support.",
    status: "Available",
    dayRate: 540,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
  },
  {
    id: "trk-500",
    name: "Choke Manifold 5K",
    model: "5K Manual",
    description: "Manual choke manifold rated 5,000 PSI.",
    status: "Available",
    dayRate: 410,
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
  },
  {
    id: "tank-frac",
    name: "Frac Tank 500 BBL",
    model: "Steel 500",
    description: "Steel frac tank for produced water and flowback.",
    status: "Available",
    dayRate: 180,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
  },
];

export const driverData: Driver[] = [
  { id: "drv-a", name: "Driver A — James Whitaker", phone: "(432) 555-0101" },
  { id: "drv-b", name: "Driver B — Maria Gomez", phone: "(432) 555-0144" },
  { id: "drv-c", name: "Driver C — Levi Holt", phone: "(432) 555-0198" },
];

export const initialBookings: Booking[] = [
  {
    id: "BK-2041",
    equipmentId: "bop-405",
    equipmentName: "BOP Unit 405",
    projectName: "Site Alpha — Permian 12H",
    location: "Midland, TX",
    startDate: "2026-05-20",
    endDate: "2026-07-20",
    units: 1,
    type: "wet",
    driverId: "drv-b",
    deliveryDate: "2026-05-20T08:00",
    dropoffInstructions: "Drop at north pad, see drilling supervisor on arrival.",
    subtotal: 73200,
    createdAt: "2026-05-15",
  },
  {
    id: "BK-2039",
    equipmentId: "gen-200",
    equipmentName: "Diesel Generator 200kW",
    projectName: "Site Bravo — Eagle Ford 4",
    location: "Cotulla, TX",
    startDate: "2026-06-01",
    units: 2,
    type: "dry",
    pickupAddress: "Yard 3 — 2200 Industrial Pkwy, Odessa TX",
    subtotal: 19200,
    createdAt: "2026-05-28",
  },
];

export const initialAgreements: Agreement[] = [
  {
    id: "AG-908",
    poNumber: "PO-908",
    bookingRef: "BK-2041",
    project: "Site Alpha — Permian 12H",
    rentalType: "wet",
    status: "Pending Signature",
    createdAt: "2026-05-16",
  },
  {
    id: "AG-910",
    poNumber: "PO-910",
    bookingRef: "BK-2039",
    project: "Site Bravo — Eagle Ford 4",
    rentalType: "dry",
    status: "Pending Signature",
    createdAt: "2026-05-29",
  },
  {
    id: "AG-902",
    poNumber: "PO-902",
    bookingRef: "BK-2010",
    project: "Site Delta — Haynesville 7",
    rentalType: "wet",
    status: "Signed",
    createdAt: "2026-04-11",
  },
];

export const initialInvoices: Invoice[] = [
  { id: "INV-10042", project: "Site Alpha — Permian 12H", date: "2026-06-01", amount: 36600, status: "Unpaid" },
  { id: "INV-10031", project: "Site Delta — Haynesville 7", date: "2026-05-01", amount: 24800, status: "Paid" },
  { id: "INV-10018", project: "Site Bravo — Eagle Ford 4", date: "2026-04-01", amount: 19200, status: "Overdue" },
  { id: "INV-10009", project: "Site Charlie — Bakken 3", date: "2026-03-01", amount: 14250, status: "Paid" },
];

export const initialRecurring: RecurringProfile[] = [
  { id: "RP-01", project: "Site Alpha — Permian 12H", cadence: "Monthly on the 1st", nextRun: "2026-07-01", amount: 36600 },
  { id: "RP-02", project: "Site Delta — Haynesville 7", cadence: "Monthly on the 1st", nextRun: "2026-07-01", amount: 24800 },
];

export const initialTracking: TrackedUnit[] = [
  { id: "TR-405", equipment: "BOP Unit 405", type: "wet", state: "On-Site (Site Alpha)", location: "Midland, TX", driver: "Driver B" },
  { id: "TR-200", equipment: "Diesel Generator 200kW", type: "dry", state: "In Customer Custody", location: "Cotulla, TX" },
  { id: "TR-500", equipment: "BOP Unit 500", type: "wet", state: "Awaiting Dispatch", location: "Yard 3 — Odessa", driver: "—" },
  { id: "TR-160", equipment: "Air Compressor 1600 CFM", type: "wet", state: "In Transit (Driver A)", location: "Hwy 285 N", driver: "Driver A" },
  { id: "TR-410", equipment: "Choke Manifold 5K", type: "wet", state: "Return Scheduled", location: "Site Delta", driver: "Driver C" },
  { id: "TR-FRC", equipment: "Frac Tank 500 BBL", type: "dry", state: "Checked Out", location: "Site Bravo", driver: undefined },
];

export const initialActivity: ActivityItem[] = [
  { id: "AC-1", text: "Unit 405 was delivered to Site Alpha", time: "2h ago", kind: "delivery" },
  { id: "AC-2", text: "Rental Agreement for PO-902 signed", time: "1d ago", kind: "signature" },
  { id: "AC-3", text: "Invoice INV-10042 generated for Site Alpha", time: "3d ago", kind: "billing" },
  { id: "AC-4", text: "Booking BK-2039 created for Diesel Generator 200kW", time: "4d ago", kind: "booking" },
];

export function rentalDays(start: string, end?: string) {
  if (!start) return 0;
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : s + 1000 * 60 * 60 * 24 * 30; // open-ended ~30 days
  const d = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
  return d;
}

export function calcSubtotal(rate: number, units: number, start: string, end: string | undefined, type: RentalType) {
  const days = rentalDays(start, end);
  const base = rate * Math.max(1, units) * days;
  const wetFee = type === "wet" ? 1200 + days * 75 : 0; // delivery + on-site service per day
  return Math.round(base + wetFee);
}
