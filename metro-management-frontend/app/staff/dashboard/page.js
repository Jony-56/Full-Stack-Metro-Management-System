"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function StaffDashboard() {
  const [summary, setSummary] = useState({
    totalTickets: 0,
    bookedTickets: 0,
    cancelledTickets: 0,
    completedTickets: 0,
    totalPayments: 0,
    totalPassengers: 0,
  });

  const getDashboard = async () => {
    try {
      const res = await api.get("/staff/dashboard");
      setSummary(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <DashboardLayout role="staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Staff Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Operational summary for tickets, payments and passengers.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Tickets" value={summary.totalTickets} />
        <DashboardCard title="Booked Tickets" value={summary.bookedTickets} />
        <DashboardCard title="Cancelled Tickets" value={summary.cancelledTickets} />
        <DashboardCard title="Completed Tickets" value={summary.completedTickets} />
        <DashboardCard title="Total Payments" value={summary.totalPayments} />
        <DashboardCard title="Total Passengers" value={summary.totalPassengers} />
      </div>
    </DashboardLayout>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}