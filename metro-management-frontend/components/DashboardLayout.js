"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getUser, getToken } from "../lib/auth";

export default function DashboardLayout({ role, children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();

    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    if (savedUser.role !== role) {
      router.push("/login");
      return;
    }

    setUser(savedUser);
  }, [router, role]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Sidebar
        role={role}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <section className="p-4 md:ml-64 md:p-6">
        <Topbar user={user} setMobileOpen={setMobileOpen} />

        <div className="mx-auto max-w-7xl">{children}</div>
      </section>
    </main>
  );
}