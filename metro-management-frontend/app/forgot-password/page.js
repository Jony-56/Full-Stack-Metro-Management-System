"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/users/forgot-password", {
        email: email,
      });

      toast.success("Reset token generated");

      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate token");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Forgot Password
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter your email to get password reset token.
        </p>

        <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Get Reset Token"}
          </button>
        </form>

        {resetToken && (
          <div className="mt-6 rounded-xl bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Reset Token:
            </p>

            <p className="mt-2 break-all rounded-lg bg-white p-3 text-sm text-slate-900">
              {resetToken}
            </p>

            <Link
              href={`/reset-password?token=${resetToken}`}
              className="mt-4 block rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              Reset Password Now
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember password?{" "}
          <Link href="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}