"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ role }) {
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

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 p-5 text-white md:block">
      <h1 className="mb-8 text-2xl font-bold text-cyan-400">
        Metro MS
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}