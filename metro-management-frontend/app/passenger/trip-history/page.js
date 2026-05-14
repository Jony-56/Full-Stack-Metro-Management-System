"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function TripHistoryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTripHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/trips/my");
      const data = Array.isArray(res.data) ? res.data : res.data.trips;

      setTrips(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load trip history");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripHistory();
  }, []);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Trip History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your completed metro trips.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Completed Trips
          </h2>

          <button
            onClick={getTripHistory}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading trip history...</p>
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
                    <th className="p-3">Journey Date</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {trips.length === 0 ? (
                    <tr>
                      <td className="p-3 text-slate-500" colSpan="9">
                        No completed trip found
                      </td>
                    </tr>
                  ) : (
                    trips.map((trip) => (
                      <tr key={trip.id} className="border-b text-sm">
                        <td className="p-3 font-medium text-slate-800">
                          #{trip.id}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.route?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.train?.trainNumber || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.sourceStation?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.destinationStation?.name || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.journeyDate || "N/A"}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.seatCount}
                        </td>

                        <td className="p-3 text-slate-600">
                          {trip.totalFare} tk
                        </td>

                        <td className="p-3">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {trips.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No completed trip found
                </p>
              ) : (
                trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Trip #{trip.id}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Route: {trip.route?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Train: {trip.train?.trainNumber || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          From: {trip.sourceStation?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          To: {trip.destinationStation?.name || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Journey Date: {trip.journeyDate || "N/A"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Seats: {trip.seatCount}
                        </p>

                        <p className="text-sm text-slate-500">
                          Fare: {trip.totalFare} tk
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Completed
                      </span>
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