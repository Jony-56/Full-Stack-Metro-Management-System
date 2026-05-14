"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getUser, getToken } from "../lib/auth";

export default function DashboardLayout({ role, children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
      <Sidebar role={role} />

      <section className="p-4 md:ml-64 md:p-6">
        <Topbar user={user} />

        <div>{children}</div>
      </section>
    </main>
  );
}