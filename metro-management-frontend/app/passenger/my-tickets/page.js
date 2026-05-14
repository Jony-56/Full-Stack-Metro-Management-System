"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMyTickets = async () => {
    try {
      setLoading(true);

      const res = await api.get("/tickets/my");
      const data = Array.isArray(res.data) ? res.data : res.data.tickets;

      setTickets(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tickets");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const cancelTicket = async (id) => {
    const confirmCancel = confirm("Are you sure you want to cancel this ticket?");

    if (!confirmCancel) return;

    try {
      await api.delete(`/tickets/${id}`);

      toast.success("Ticket cancelled successfully");
      getMyTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel ticket");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getMyTickets();
  }, []);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          My Tickets
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your booked tickets, make payment or cancel tickets.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">Ticket List</h2>

          <button
            onClick={getMyTickets}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading tickets...</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-slate-100 text-sm text-slate-600">
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Route</th>
                    <th className="p-3">Train</th>
                    <th className="p-3">From</th>
                    <th className="p-3">To</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td className="p-3 text-slate-500" colSpan="10">
                        No ticket found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b text-sm">
                        <td className="p-3 font-medium text-slate-800">
                          #{ticket.id}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.route?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.train?.trainNumber || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.sourceStation?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.destinationStation?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.journeyDate || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.seatCount}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.totalFare} tk
                        </td>

                        <td className="p-3">
                          <TicketStatus status={ticket.status} />
                        </td>

                        <td className="p-3">
                          <TicketActions
                            ticket={ticket}
                            cancelTicket={cancelTicket}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {tickets.length === 0 ? (
                <p className="text-sm text-slate-500">No ticket found</p>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Ticket #{ticket.id}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Route: {ticket.route?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Train: {ticket.train?.trainNumber || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          From: {ticket.sourceStation?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          To: {ticket.destinationStation?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Date: {ticket.journeyDate || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Seats: {ticket.seatCount}
                        </p>

                        <p className="text-sm text-slate-500">
                          Fare: {ticket.totalFare} tk
                        </p>
                      </div>

                      <TicketStatus status={ticket.status} />
                    </div>

                    <TicketActions
                      ticket={ticket}
                      cancelTicket={cancelTicket}
                    />
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

function TicketStatus({ status }) {
  if (status === "completed") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Completed
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Cancelled
      </span>
    );
  }

  return (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      Booked
    </span>
  );
}

function TicketActions({ ticket, cancelTicket }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ticket.status === "booked" && (
        <Link
          href={`/passenger/payments?ticketId=${ticket.id}&amount=${ticket.totalFare}`}
          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          Pay
        </Link>
      )}

      {ticket.status === "booked" && (
        <button
          onClick={() => cancelTicket(ticket.id)}
          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
        >
          Cancel
        </button>
      )}
    </div>
  );
}