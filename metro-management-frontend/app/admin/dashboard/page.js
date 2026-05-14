"use client";

import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Admin Dashboard
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Users</h2>
          <p className="mt-2 text-slate-500">Manage all users</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Stations</h2>
          <p className="mt-2 text-slate-500">Create and manage stations</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Trains</h2>
          <p className="mt-2 text-slate-500">Manage train information</p>
        </div>
      </div>
    </DashboardLayout>
  );
}