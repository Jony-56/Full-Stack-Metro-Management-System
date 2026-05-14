"use client";

import DashboardLayout from "../../../components/DashboardLayout";

export default function PassengerDashboard() {
  return (
    <DashboardLayout role="passenger">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Passenger Dashboard
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Book Ticket</h2>
          <p className="mt-2 text-slate-500">Book your metro ticket</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">My Tickets</h2>
          <p className="mt-2 text-slate-500">View your booked tickets</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Trip History</h2>
          <p className="mt-2 text-slate-500">View completed trips</p>
        </div>
      </div>
    </DashboardLayout>
  );
}