"use client";

import DashboardLayout from "../../../components/DashboardLayout";

export default function StaffDashboard() {
  return (
    <DashboardLayout role="staff">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Staff Dashboard
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">All Tickets</h2>
          <p className="mt-2 text-slate-500">View and update tickets</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Payments</h2>
          <p className="mt-2 text-slate-500">View all payment records</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Operations</h2>
          <p className="mt-2 text-slate-500">Manage daily operations</p>
        </div>
      </div>
    </DashboardLayout>
  );
}