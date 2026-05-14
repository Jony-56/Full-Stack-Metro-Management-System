"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTickets = async () => {
    try {
      setLoading(true);

      const res = await api.get("/staff/tickets");
      const data = Array.isArray(res.data) ? res.data : res.data.tickets;

      setTickets(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tickets");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      await api.patch(`/staff/tickets/${id}/status`, {
        status: status,
      });

      toast.success("Ticket status updated");
      getTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update ticket");
      console.log(error.response?.data || error);
    }
  };

  const deleteTicket = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete/cancel this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await api.patch(`/staff/tickets/${id}/status`, {
        status: "cancelled",
      });

      toast.success("Ticket cancelled successfully");
      getTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel ticket");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Ticket Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View, update, complete and cancel passenger tickets.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">Ticket List</h2>

          <button
            onClick={getTickets}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading tickets...</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-slate-100 text-sm text-slate-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Passenger</th>
                    <th className="p-3">Route</th>
                    <th className="p-3">Train</th>
                    <th className="p-3">Journey Date</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td className="p-3 text-slate-500" colSpan="9">
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
                          {ticket.passenger?.fullName ||
                            ticket.user?.fullName ||
                            "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.route?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.train?.trainNumber || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.journeyDate || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.seatCount}
                        </td>

                        <td className="p-3 text-slate-600">
                          {ticket.totalFare}
                        </td>

                        <td className="p-3">
                          <TicketStatus status={ticket.status} />
                        </td>

                        <td className="p-3">
                          <TicketActions
                            ticket={ticket}
                            updateTicketStatus={updateTicketStatus}
                            deleteTicket={deleteTicket}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card */}
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
                          Passenger:{" "}
                          {ticket.passenger?.fullName ||
                            ticket.user?.fullName ||
                            "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Route: {ticket.route?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Train: {ticket.train?.trainNumber || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Journey Date: {ticket.journeyDate || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Seats: {ticket.seatCount}
                        </p>

                        <p className="text-sm text-slate-500">
                          Fare: {ticket.totalFare}
                        </p>
                      </div>

                      <TicketStatus status={ticket.status} />
                    </div>

                    <TicketActions
                      ticket={ticket}
                      updateTicketStatus={updateTicketStatus}
                      deleteTicket={deleteTicket}
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

function TicketActions({ ticket, updateTicketStatus, deleteTicket }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ticket.status !== "booked" && (
        <button
          onClick={() => updateTicketStatus(ticket.id, "booked")}
          className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-600"
        >
          Booked
        </button>
      )}

      {ticket.status !== "completed" && (
        <button
          onClick={() => updateTicketStatus(ticket.id, "completed")}
          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          Complete
        </button>
      )}

      {ticket.status !== "cancelled" && (
        <button
          onClick={() => updateTicketStatus(ticket.id, "cancelled")}
          className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          Cancel
        </button>
      )}

      <button
        onClick={() => deleteTicket(ticket.id)}
        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}