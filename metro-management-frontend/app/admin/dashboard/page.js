"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    users: 0,
    stations: 0,
    routes: 0,
    trains: 0,
    tickets: 0,
    payments: 0,
  });

  const getDashboardData = async () => {
    try {
      const usersRes = await api.get("/users");
      const stationsRes = await api.get("/stations");
      const routesRes = await api.get("/routes");
      const trainsRes = await api.get("/trains");
      const ticketsRes = await api.get("/staff/tickets");
      const paymentsRes = await api.get("/staff/payments");

      const users = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.users || [];

      const stations = Array.isArray(stationsRes.data)
        ? stationsRes.data
        : stationsRes.data.stations || [];

      const routes = Array.isArray(routesRes.data)
        ? routesRes.data
        : routesRes.data.routes || [];

      const trains = Array.isArray(trainsRes.data)
        ? trainsRes.data
        : trainsRes.data.trains || [];

      const tickets = Array.isArray(ticketsRes.data)
        ? ticketsRes.data
        : ticketsRes.data.tickets || [];

      const payments = Array.isArray(paymentsRes.data)
        ? paymentsRes.data
        : paymentsRes.data.payments || [];

      setSummary({
        users: users.length,
        stations: stations.length,
        routes: routes.length,
        trains: trains.length,
        tickets: tickets.length,
        payments: payments.length,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of users, stations, routes, trains, tickets and payments.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Users" value={summary.users} />
        <DashboardCard title="Total Stations" value={summary.stations} />
        <DashboardCard title="Total Routes" value={summary.routes} />
        <DashboardCard title="Total Trains" value={summary.trains} />
        <DashboardCard title="Total Tickets" value={summary.tickets} />
        <DashboardCard title="Total Payments" value={summary.payments} />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <QuickLink
          title="Manage Users"
          text="View, update and deactivate users."
          href="/admin/users"
        />

        <QuickLink
          title="Manage Stations"
          text="Create and manage metro stations."
          href="/admin/stations"
        />

        <QuickLink
          title="Manage Routes"
          text="Create and update metro routes."
          href="/admin/routes"
        />

        <QuickLink
          title="Manage Trains"
          text="Create and update train information."
          href="/admin/trains"
        />

        <QuickLink
          title="Manage Tickets"
          text="View and update passenger tickets."
          href="/admin/tickets"
        />
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

function QuickLink({ title, text, href }) {
  return (
    <a
      href={href}
      className="block rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
      <p className="mt-4 text-sm font-semibold text-cyan-600">
        Open section →
      </p>
    </a>
  );
}