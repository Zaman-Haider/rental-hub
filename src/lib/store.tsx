import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialActivity,
  initialAgreements,
  initialBookings,
  initialInvoices,
  initialRecurring,
  initialTracking,
  type ActivityItem,
  type Agreement,
  type Booking,
  type Invoice,
  type RecurringProfile,
  type TrackedUnit,
} from "./mock-data";

type Ctx = {
  bookings: Booking[];
  agreements: Agreement[];
  invoices: Invoice[];
  recurring: RecurringProfile[];
  tracking: TrackedUnit[];
  activity: ActivityItem[];
  addBooking: (b: Booking) => void;
  signAgreement: (id: string) => void;
  generateNextInvoice: (project: string, amount: number) => void;
  markInvoicePaid: (id: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

let nextActivityId = 1000;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [recurring] = useState<RecurringProfile[]>(initialRecurring);
  const [tracking, setTracking] = useState<TrackedUnit[]>(initialTracking);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);

  const pushActivity = useCallback((item: Omit<ActivityItem, "id" | "time">) => {
    setActivity((a) => [
      { id: `AC-${nextActivityId++}`, time: "just now", ...item },
      ...a,
    ]);
  }, []);

  const addBooking = useCallback(
    (b: Booking) => {
      setBookings((bs) => [b, ...bs]);
      // create matching pending agreement
      const ag: Agreement = {
        id: `AG-${Math.floor(900 + Math.random() * 99)}`,
        poNumber: `PO-${Math.floor(900 + Math.random() * 99)}`,
        bookingRef: b.id,
        project: b.projectName,
        rentalType: b.type,
        status: "Pending Signature",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setAgreements((a) => [ag, ...a]);
      // create tracking entry
      const trk: TrackedUnit = {
        id: `TR-${b.id.slice(-3)}`,
        equipment: b.equipmentName,
        type: b.type,
        state: b.type === "wet" ? "Awaiting Dispatch" : "Checked Out",
        location: b.type === "wet" ? "Yard 3 — Odessa" : b.location,
        driver: b.type === "wet" ? "Driver B" : undefined,
      };
      setTracking((t) => [trk, ...t]);
      pushActivity({ text: `Booking ${b.id} created for ${b.equipmentName}`, kind: "booking" });
    },
    [pushActivity],
  );

  const signAgreement = useCallback(
    (id: string) => {
      setAgreements((as) => as.map((a) => (a.id === id ? { ...a, status: "Signed" } : a)));
      const a = agreements.find((x) => x.id === id);
      if (a) pushActivity({ text: `Rental Agreement for ${a.poNumber} signed`, kind: "signature" });
    },
    [agreements, pushActivity],
  );

  const generateNextInvoice = useCallback(
    (project: string, amount: number) => {
      const inv: Invoice = {
        id: `INV-${10050 + Math.floor(Math.random() * 900)}`,
        project,
        date: new Date().toISOString().slice(0, 10),
        amount,
        status: "Unpaid",
      };
      setInvoices((i) => [inv, ...i]);
      pushActivity({ text: `Invoice ${inv.id} generated for ${project}`, kind: "billing" });
    },
    [pushActivity],
  );

  const markInvoicePaid = useCallback((id: string) => {
    setInvoices((i) => i.map((x) => (x.id === id ? { ...x, status: "Paid" } : x)));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ bookings, agreements, invoices, recurring, tracking, activity, addBooking, signAgreement, generateNextInvoice, markInvoicePaid }),
    [bookings, agreements, invoices, recurring, tracking, activity, addBooking, signAgreement, generateNextInvoice, markInvoicePaid],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore must be inside StoreProvider");
  return v;
}
