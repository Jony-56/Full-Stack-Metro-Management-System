"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/users/reset-password", {
        token: token,
        newPassword: newPassword,
      });

      toast.success("Password reset successfully");
      setToken("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter reset token and your new password.
        </p>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Reset Token
            </label>

            <input
              type="text"
              placeholder="Enter reset token"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Back to{" "}
          <Link href="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}