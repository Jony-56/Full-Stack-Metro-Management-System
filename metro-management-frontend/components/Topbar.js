"use client";

import { logout } from "../lib/auth";

export default function Topbar({ user }) {
  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Welcome, {user?.fullName || "User"}
        </h2>
        <p className="text-sm capitalize text-slate-500">
          Role: {user?.role}
        </p>
      </div>

      <button
        onClick={logout}
        className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}