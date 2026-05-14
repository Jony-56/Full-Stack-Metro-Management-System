import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Metro Management System
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Smart Metro Ticketing & Management Platform
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            A modern dashboard system for passengers, staff, and admins to manage
            stations, routes, trains, tickets, payments, and trip history.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-slate-600 px-8 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}