"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);

  const [name, setName] = useState("");
  const [sourceStationId, setSourceStationId] = useState("");
  const [destinationStationId, setDestinationStationId] = useState("");

  const [stopStationId, setStopStationId] = useState("");
  const [distanceFromStart, setDistanceFromStart] = useState("");
  const [stops, setStops] = useState([]);

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const getRoutes = async () => {
    try {
      const res = await api.get("/routes");
      const data = Array.isArray(res.data) ? res.data : res.data.routes;
      setRoutes(data || []);
    } catch (error) {
      toast.error("Failed to load routes");
      console.log(error.response?.data || error);
    }
  };

  const addStop = () => {
    if (!stopStationId || distanceFromStart === "") {
      toast.error("Please select station and distance");
      return;
    }

    const selectedStation = stations.find(
      (station) => station.id === Number(stopStationId)
    );

    const newStop = {
      stationId: Number(stopStationId),
      stopOrder: stops.length + 1,
      distanceFromStart: Number(distanceFromStart),
      stationName: selectedStation?.name,
    };

    setStops([...stops, newStop]);
    setStopStationId("");
    setDistanceFromStart("");
  };

  const removeStop = (index) => {
    const newStops = stops.filter((item, i) => i !== index);

    const updatedStops = newStops.map((item, index) => ({
      ...item,
      stopOrder: index + 1,
    }));

    setStops(updatedStops);
  };

  const resetForm = () => {
    setName("");
    setSourceStationId("");
    setDestinationStationId("");
    setStopStationId("");
    setDistanceFromStart("");
    setStops([]);
    setEditId(null);
  };

  const submitRoute = async (e) => {
    e.preventDefault();

    if (stops.length < 2) {
      toast.error("Please add at least 2 stops");
      return;
    }

    try {
      setLoading(true);

      const finalStops = stops.map((stop) => ({
        stationId: stop.stationId,
        stopOrder: stop.stopOrder,
        distanceFromStart: stop.distanceFromStart,
      }));

      const routeData = {
        name: name,
        sourceStationId: Number(sourceStationId),
        destinationStationId: Number(destinationStationId),
        stops: finalStops,
      };

      if (editId) {
        await api.patch(`/routes/${editId}`, routeData);
        toast.success("Route updated successfully");
      } else {
        await api.post("/routes", routeData);
        toast.success("Route created successfully");
      }

      resetForm();
      getRoutes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save route");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const editRoute = (route) => {
    setEditId(route.id);
    setName(route.name || "");
    setSourceStationId(route.sourceStation?.id || "");
    setDestinationStationId(route.destinationStation?.id || "");

    const oldStops = route.routeStations || route.stops || [];

    const formattedStops = oldStops.map((item, index) => ({
      stationId: item.station?.id || item.stationId,
      stationName: item.station?.name || item.stationName || "Station",
      stopOrder: item.stopOrder || index + 1,
      distanceFromStart: item.distanceFromStart || 0,
    }));

    setStops(formattedStops);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateRouteStatus = async (id, isActive) => {
    try {
      await api.patch(`/routes/${id}`, {
        isActive: isActive,
      });

      toast.success(isActive ? "Route activated" : "Route deactivated");
      getRoutes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update route");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getStations();
    getRoutes();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Route Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, update, activate and deactivate metro routes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900 md:text-xl">
            {editId ? "Update Route" : "Add New Route"}
          </h2>

          <form onSubmit={submitRoute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Route Name
              </label>
              <input
                type="text"
                placeholder="Uttara North to Motijheel"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Source Station
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={sourceStationId}
                onChange={(e) => setSourceStationId(e.target.value)}
                required
              >
                <option value="">Select source station</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Destination Station
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={destinationStationId}
                onChange={(e) => setDestinationStationId(e.target.value)}
                required
              >
                <option value="">Select destination station</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 font-semibold text-slate-900">
                Add Route Stops
              </h3>

              <div className="space-y-3">
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                  value={stopStationId}
                  onChange={(e) => setStopStationId(e.target.value)}
                >
                  <option value="">Select stop station</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Distance from start"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                  value={distanceFromStart}
                  onChange={(e) => setDistanceFromStart(e.target.value)}
                />

                <button
                  type="button"
                  onClick={addStop}
                  className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Add Stop
                </button>
              </div>
            </div>

            {stops.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">
                  Added Stops
                </h3>

                <div className="space-y-2">
                  {stops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-lg bg-white p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {stop.stopOrder}. {stop.stationName}
                        </p>
                        <p className="text-slate-500">
                          Distance: {stop.distanceFromStart} km
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
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
                ? "Update Route"
                : "Create Route"}
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
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                Route List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total routes: {routes.length}
              </p>
            </div>

            <button
              onClick={getRoutes}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[750px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-100 text-sm text-slate-600">
                  <th className="p-3">Route Name</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {routes.length === 0 ? (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan="5">
                      No route found
                    </td>
                  </tr>
                ) : (
                  routes.map((route) => (
                    <tr key={route.id} className="border-b text-sm">
                      <td className="p-3 font-medium text-slate-800">
                        {route.name}
                      </td>

                      <td className="p-3 text-slate-600">
                        {route.sourceStation?.name || "N/A"}
                      </td>

                      <td className="p-3 text-slate-600">
                        {route.destinationStation?.name || "N/A"}
                      </td>

                      <td className="p-3">
                        <RouteStatus isActive={route.isActive} />
                      </td>

                      <td className="p-3">
                        <RouteActions
                          route={route}
                          editRoute={editRoute}
                          updateRouteStatus={updateRouteStatus}
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
            {routes.length === 0 ? (
              <p className="text-sm text-slate-500">No route found</p>
            ) : (
              routes.map((route) => (
                <div
                  key={route.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {route.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Source: {route.sourceStation?.name || "N/A"}
                      </p>

                      <p className="text-sm text-slate-500">
                        Destination: {route.destinationStation?.name || "N/A"}
                      </p>
                    </div>

                    <RouteStatus isActive={route.isActive} />
                  </div>

                  <RouteActions
                    route={route}
                    editRoute={editRoute}
                    updateRouteStatus={updateRouteStatus}
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

function RouteStatus({ isActive }) {
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

function RouteActions({ route, editRoute, updateRouteStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => editRoute(route)}
        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
      >
        Edit
      </button>

      {route.isActive ? (
        <button
          onClick={() => updateRouteStatus(route.id, false)}
          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
        >
          Deactivate
        </button>
      ) : (
        <button
          onClick={() => updateRouteStatus(route.id, true)}
          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          Activate
        </button>
      )}
    </div>
  );
}