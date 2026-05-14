"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminStationsPage() {
  const [stations, setStations] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);

  const getStations = async () => {
    try {
      const res = await api.get("/stations");

      // If your backend returns direct array
      setStations(res.data);

      // If your backend returns { stations: [...] }, use this instead:
      // setStations(res.data.stations);
    } catch (error) {
      toast.error("Failed to load stations");
      console.log(error);
    }
  };

  const createStation = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/stations", {
        name,
        code,
        location,
      });

      toast.success("Station created successfully");

      setName("");
      setCode("");
      setLocation("");

      getStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create station");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStationStatus = async (id, isActive) => {
    try {
      await api.patch(`/stations/${id}`, {
        isActive: isActive,
      });

      if (isActive) {
        toast.success("Station activated");
      } else {
        toast.success("Station deactivated");
      }

      getStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update station");
      console.log(error);
    }
  };

  useEffect(() => {
    getStations();
  }, []);

  return (
    <DashboardLayout role="admin">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Station Management
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Add New Station
          </h2>

          <form onSubmit={createStation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Station Name
              </label>

              <input
                type="text"
                placeholder="Uttara North"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Station Code
              </label>

              <input
                type="text"
                placeholder="UTN"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                type="text"
                placeholder="Uttara, Dhaka"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Station"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Station List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-100 text-sm text-slate-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {stations.length === 0 ? (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan="5">
                      No station found
                    </td>
                  </tr>
                ) : (
                  stations.map((station) => (
                    <tr key={station.id} className="border-b text-sm">
                      <td className="p-3 font-medium text-slate-800">
                        {station.name}
                      </td>

                      <td className="p-3 text-slate-600">
                        {station.code}
                      </td>

                      <td className="p-3 text-slate-600">
                        {station.location}
                      </td>

                      <td className="p-3">
                        {station.isActive ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {station.isActive ? (
                          <button
                            onClick={() =>
                              updateStationStatus(station.id, false)
                            }
                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateStationStatus(station.id, true)
                            }
                            className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}