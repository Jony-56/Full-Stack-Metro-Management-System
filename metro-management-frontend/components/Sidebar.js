"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ role, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  let menuItems = [];

  if (role === "admin") {
    menuItems = [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Users", href: "/admin/users" },
      { name: "Stations", href: "/admin/stations" },
      { name: "Routes", href: "/admin/routes" },
      { name: "Trains", href: "/admin/trains" },
      { name: "Tickets", href: "/admin/tickets" },
    ];
  }

  if (role === "staff") {
    menuItems = [
      { name: "Dashboard", href: "/staff/dashboard" },
      { name: "All Tickets", href: "/staff/tickets" },
      { name: "Payments", href: "/staff/payments" },
    ];
  }

  if (role === "passenger") {
    menuItems = [
      { name: "Dashboard", href: "/passenger/dashboard" },
      { name: "Book Ticket", href: "/passenger/book-ticket" },
      { name: "My Tickets", href: "/passenger/my-tickets" },
      { name: "Payments", href: "/passenger/payments" },
      { name: "Trip History", href: "/passenger/trip-history" },
      { name: "Profile", href: "/passenger/profile" },
    ];
  }

  const sidebarContent = (
    <div className="h-full bg-slate-950 p-5 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cyan-400">Metro MS</h1>

        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white md:hidden"
        >
          X
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={
                active
                  ? "block rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950"
                  : "block rounded-xl px-4 py-3 font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 md:block">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          ></div>

          <aside className="relative h-screen w-72">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}