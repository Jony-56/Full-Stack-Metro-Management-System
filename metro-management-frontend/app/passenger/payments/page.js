"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function PassengerPaymentsPage() {
  const searchParams = useSearchParams();

  const [payments, setPayments] = useState([]);

  const [ticketId, setTicketId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const getMyPayments = async () => {
    try {
      setPaymentLoading(true);

      const res = await api.get("/payments/my");
      const data = Array.isArray(res.data) ? res.data : res.data.payments;

      setPayments(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payments");
      console.log(error.response?.data || error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const makePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/payments", {
        ticketId: Number(ticketId),
        amount: Number(amount),
        method: method,
        transactionId: transactionId,
      });

      toast.success("Payment successful");

      setTicketId("");
      setAmount("");
      setMethod("bkash");
      setTransactionId("");

      getMyPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make payment");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ticketIdFromUrl = searchParams.get("ticketId");
    const amountFromUrl = searchParams.get("amount");

    if (ticketIdFromUrl) {
      setTicketId(ticketIdFromUrl);
    }

    if (amountFromUrl) {
      setAmount(amountFromUrl);
    }

    getMyPayments();
  }, [searchParams]);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Make payment for your ticket and view your payment history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Make Payment
          </h2>

          <form onSubmit={makePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Ticket ID
              </label>
              <input
                type="number"
                placeholder="Enter ticket ID"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none"
                value={amount}
                readOnly
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                Amount is auto-filled from your selected ticket.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Payment Method
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Transaction ID
              </label>
              <input
                type="text"
                placeholder="TXN123456"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Make Payment"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow md:p-6 lg:col-span-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Payment History
            </h2>

            <button
              onClick={getMyPayments}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {paymentLoading ? (
            <p className="text-sm text-slate-500">Loading payments...</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b bg-slate-100 text-sm text-slate-600">
                      <th className="p-3">Payment ID</th>
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
                            {payment.amount} tk
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
                            Ticket: #
                            {payment.ticket?.id || payment.ticketId || "N/A"}
                          </p>

                          <p className="text-sm text-slate-500">
                            Amount: {payment.amount} tk
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