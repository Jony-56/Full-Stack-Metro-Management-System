"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminTrainsPage() {
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [trainNumber, setTrainNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [routeId, setRouteId] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const getRoutes = async () => {
    try {
      const res = await api.get("/routes");
      const data = Array.isArray(res.data) ? res.data : res.data.routes;

      // Only active routes for train creation
      const activeRoutes = (data || []).filter((route) => route.isActive !== false);
      setRoutes(activeRoutes);
    } catch (error) {
      toast.error("Failed to load routes");
      console.log(error.response?.data || error);
    }
  };

  const getTrains = async () => {
    try {
      const res = await api.get("/trains");
      const data = Array.isArray(res.data) ? res.data : res.data.trains;
      setTrains(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load trains");
      console.log(error.response?.data || error);
    }
  };

  const resetForm = () => {
    setTrainNumber("");
    setCapacity("");
    setRouteId("");
    setStatus("active");
    setEditId(null);
  };

  const submitTrain = async (e) => {
    e.preventDefault();

    if (!routeId) {
      toast.error("Please select a route");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.patch(`/trains/${editId}`, {
          trainNumber: trainNumber,
          capacity: Number(capacity),
          routeId: Number(routeId),
          status: status,
        });

        toast.success("Train updated successfully");
      } else {
        // Important: POST /trains does not send status
        await api.post("/trains", {
          trainNumber: trainNumber,
          capacity: Number(capacity),
          routeId: Number(routeId),
        });

        toast.success("Train created successfully");
      }

      resetForm();
      getTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save train");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const editTrain = (train) => {
    setEditId(train.id);
    setTrainNumber(train.trainNumber || "");
    setCapacity(train.capacity || "");
    setRouteId(train.route?.id || train.routeId || "");
    setStatus(train.status || "active");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateTrainStatus = async (id, newStatus) => {
    try {
      await api.patch(`/trains/${id}`, {
        status: newStatus,
      });

      if (newStatus === "active") {
        toast.success("Train activated");
      } else if (newStatus === "maintenance") {
        toast.success("Train moved to maintenance");
      } else {
        toast.success("Train deactivated");
      }

      getTrains();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update train");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getRoutes();
    getTrains();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Train Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, update, activate, deactivate and maintain trains.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            {editId ? "Update Train" : "Add New Train"}
          </h2>

          <form onSubmit={submitTrain} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Train Number
              </label>
              <input
                type="text"
                placeholder="MRT-101"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Capacity
              </label>
              <input
                type="number"
                placeholder="300"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Route
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                required
              >
                <option value="">Select route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            {editId && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editId
                ? "Update Train"
                : "Create Train"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl bg-slate-200 py-3 font-semibold text-slate-900 hover:bg-slate-300"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow md:p-6 lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Train List
          </h2>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-100 text-sm text-slate-600">
                  <th className="p-3">Train Number</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {trains.length === 0 ? (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan="5">
                      No train found
                    </td>
                  </tr>
                ) : (
                  trains.map((train) => (
                    <tr key={train.id} className="border-b text-sm">
                      <td className="p-3 font-medium text-slate-800">
                        {train.trainNumber}
                      </td>

                      <td className="p-3 text-slate-600">
                        {train.capacity}
                      </td>

                      <td className="p-3 text-slate-600">
                        {train.route?.name || "N/A"}
                      </td>

                      <td className="p-3">
                        <TrainStatus status={train.status} />
                      </td>

                      <td className="p-3">
                        <TrainActions
                          train={train}
                          editTrain={editTrain}
                          updateTrainStatus={updateTrainStatus}
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
            {trains.length === 0 ? (
              <p className="text-sm text-slate-500">No train found</p>
            ) : (
              trains.map((train) => (
                <div
                  key={train.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {train.trainNumber}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Capacity: {train.capacity}
                      </p>
                      <p className="text-sm text-slate-500">
                        Route: {train.route?.name || "N/A"}
                      </p>
                    </div>

                    <TrainStatus status={train.status} />
                  </div>

                  <TrainActions
                    train={train}
                    editTrain={editTrain}
                    updateTrainStatus={updateTrainStatus}
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

function TrainStatus({ status }) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Active
      </span>
    );
  }

  if (status === "maintenance") {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Maintenance
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Inactive
    </span>
  );
}

function TrainActions({ train, editTrain, updateTrainStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => editTrain(train)}
        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
      >
        Edit
      </button>

      {train.status !== "active" && (
        <button
          onClick={() => updateTrainStatus(train.id, "active")}
          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          Activate
        </button>
      )}

      {train.status !== "maintenance" && (
        <button
          onClick={() => updateTrainStatus(train.id, "maintenance")}
          className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-600"
        >
          Maintenance
        </button>
      )}

      {train.status !== "inactive" && (
        <button
          onClick={() => updateTrainStatus(train.id, "inactive")}
          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
        >
          Deactivate
        </button>
      )}
    </div>
  );
}