"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function PassengerDashboard() {
  const [summary, setSummary] = useState({
    tickets: 0,
    payments: 0,
    trips: 0,
  });

  const getDashboardData = async () => {
    try {
      const ticketsRes = await api.get("/tickets/my");
      const paymentsRes = await api.get("/payments/my");
      const tripsRes = await api.get("/trips/my");

      const tickets = Array.isArray(ticketsRes.data)
        ? ticketsRes.data
        : ticketsRes.data.tickets || [];

      const payments = Array.isArray(paymentsRes.data)
        ? paymentsRes.data
        : paymentsRes.data.payments || [];

      const trips = Array.isArray(tripsRes.data)
        ? tripsRes.data
        : tripsRes.data.trips || [];

      setSummary({
        tickets: tickets.length,
        payments: payments.length,
        trips: trips.length,
      });
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Passenger Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Book tickets, manage payments and view your completed trips.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="My Tickets" value={summary.tickets} />
        <DashboardCard title="My Payments" value={summary.payments} />
        <DashboardCard title="Completed Trips" value={summary.trips} />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          title="Book Ticket"
          text="Select route, train, stations and journey date."
          href="/passenger/book-ticket"
          buttonText="Book Now"
        />

        <QuickAction
          title="My Tickets"
          text="View your tickets, pay fare or cancel booked tickets."
          href="/passenger/my-tickets"
          buttonText="View Tickets"
        />

        <QuickAction
          title="Payments"
          text="Make payment and check your payment history."
          href="/passenger/payments"
          buttonText="Open Payments"
        />

        <QuickAction
          title="Trip History"
          text="View all completed metro trips."
          href="/passenger/trip-history"
          buttonText="View History"
        />

        <QuickAction
          title="Profile"
          text="Update your information and change password."
          href="/passenger/profile"
          buttonText="Open Profile"
        />
      </div>
    </DashboardLayout>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow md:p-6">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

function QuickAction({ title, text, href, buttonText }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg md:p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{text}</p>

      <Link
        href={href}
        className="mt-5 inline-block rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
      >
        {buttonText}
      </Link>
    </div>
  );
}