"use client";

import { logout } from "../lib/auth";

export default function Topbar({ user, setMobileOpen }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow md:p-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          Menu
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-900 md:text-xl">
            Welcome, {user?.fullName || "User"}
          </h2>
          <p className="text-xs capitalize text-slate-500 md:text-sm">
            Role: {user?.role}
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 md:px-5"
      >
        Logout
      </button>
    </header>
  );
}