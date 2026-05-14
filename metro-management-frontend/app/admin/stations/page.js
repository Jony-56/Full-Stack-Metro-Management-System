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

      const data = Array.isArray(res.data) ? res.data : res.data.stations;
      setStations(data || []);
    } catch (error) {
      toast.error("Failed to load stations");
      console.log(error.response?.data || error);
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
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const updateStationStatus = async (id, isActive) => {
    try {
      await api.patch(`/stations/${id}`, {
        isActive: isActive,
      });

      toast.success(isActive ? "Station activated" : "Station deactivated");
      getStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update station");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getStations();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Station Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, view, activate and deactivate metro stations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900 md:text-xl">
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

        <div className="rounded-2xl bg-white p-5 shadow md:p-6 lg:col-span-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                Station List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total stations: {stations.length}
              </p>
            </div>

            <button
              onClick={getStations}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] border-collapse text-left">
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

                      <td className="p-3 text-slate-600">{station.code}</td>

                      <td className="p-3 text-slate-600">
                        {station.location}
                      </td>

                      <td className="p-3">
                        <StationStatus isActive={station.isActive} />
                      </td>

                      <td className="p-3">
                        <StationAction
                          station={station}
                          updateStationStatus={updateStationStatus}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {stations.length === 0 ? (
              <p className="text-sm text-slate-500">No station found</p>
            ) : (
              stations.map((station) => (
                <div
                  key={station.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {station.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Code: {station.code}
                      </p>

                      <p className="text-sm text-slate-500">
                        Location: {station.location}
                      </p>
                    </div>

                    <StationStatus isActive={station.isActive} />
                  </div>

                  <StationAction
                    station={station}
                    updateStationStatus={updateStationStatus}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StationStatus({ isActive }) {
  if (isActive) {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Active
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
}

function StationAction({ station, updateStationStatus }) {
  if (station.isActive) {
    return (
      <button
        onClick={() => updateStationStatus(station.id, false)}
        className="w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 sm:w-auto"
      >
        Deactivate
      </button>
    );
  }

  return (
    <button
      onClick={() => updateStationStatus(station.id, true)}
      className="w-full rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600 sm:w-auto"
    >
      Activate
    </button>
  );
}