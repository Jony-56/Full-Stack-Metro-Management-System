"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function StaffPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/staff/payments");
      const data = Array.isArray(res.data) ? res.data : res.data.payments;

      setPayments(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payments");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <DashboardLayout role="staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Staff Payment Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View all passenger payment records.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">All Payments</h2>

          <button
            onClick={getPayments}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading payments...</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-slate-100 text-sm text-slate-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Ticket</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td className="p-3 text-slate-500" colSpan="6">
                        No payment found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="border-b text-sm">
                        <td className="p-3 font-medium text-slate-800">
                          #{payment.id}
                        </td>

                        <td className="p-3 text-slate-600">
                          #{payment.ticket?.id || payment.ticketId || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {payment.amount}
                        </td>

                        <td className="p-3 capitalize text-slate-600">
                          {payment.method}
                        </td>

                        <td className="p-3 text-slate-600">
                          {payment.transactionId}
                        </td>

                        <td className="p-3">
                          <PaymentStatus status={payment.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500">No payment found</p>
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Payment #{payment.id}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Ticket: #{payment.ticket?.id || payment.ticketId || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Amount: {payment.amount}
                        </p>
                        <p className="text-sm capitalize text-slate-500">
                          Method: {payment.method}
                        </p>
                        <p className="text-sm text-slate-500">
                          TXN: {payment.transactionId}
                        </p>
                      </div>

                      <PaymentStatus status={payment.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function PaymentStatus({ status }) {
  if (status === "success") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Success
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Failed
      </span>
    );
  }

  if (status === "refunded") {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        Refunded
      </span>
    );
  }

  return (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      Pending
    </span>
  );
}