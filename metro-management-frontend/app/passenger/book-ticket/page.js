"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function BookTicketPage() {
  const [routes, setRoutes] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const [routeId, setRouteId] = useState("");
  const [trainId, setTrainId] = useState("");
  const [sourceStationId, setSourceStationId] = useState("");
  const [destinationStationId, setDestinationStationId] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [seatCount, setSeatCount] = useState(1);

  const [distance, setDistance] = useState(0);
  const [farePerSeat, setFarePerSeat] = useState(0);
  const [totalFare, setTotalFare] = useState(0);

  const [loading, setLoading] = useState(false);

  const getRoutes = async () => {
    try {
      const res = await api.get("/routes");
      const data = Array.isArray(res.data) ? res.data : res.data.routes;

      const activeRoutes = (data || []).filter(
        (route) => route.isActive !== false
      );

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

      const activeTrains = (data || []).filter(
        (train) => train.status === "active"
      );

      setTrains(activeTrains);
    } catch (error) {
      toast.error("Failed to load trains");
      console.log(error.response?.data || error);
    }
  };

  const getStations = async () => {
    try {
      const res = await api.get("/stations");
      const data = Array.isArray(res.data) ? res.data : res.data.stations;

      const activeStations = (data || []).filter(
        (station) => station.isActive !== false
      );

      setStations(activeStations);
    } catch (error) {
      toast.error("Failed to load stations");
      console.log(error.response?.data || error);
    }
  };

  const calculateFare = () => {
    if (!routeId || !sourceStationId || !destinationStationId) {
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
      return;
    }

    if (sourceStationId === destinationStationId) {
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
      return;
    }

    const selectedRoute = routes.find((route) => route.id === Number(routeId));

    if (!selectedRoute) {
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
      return;
    }

    const routeStops = selectedRoute.routeStations || selectedRoute.stops || [];

    const sourceStop = routeStops.find((stop) => {
      const stationId = stop.station?.id || stop.stationId;
      return stationId === Number(sourceStationId);
    });

    const destinationStop = routeStops.find((stop) => {
      const stationId = stop.station?.id || stop.stationId;
      return stationId === Number(destinationStationId);
    });

    if (!sourceStop || !destinationStop) {
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
      return;
    }

    const sourceDistance = Number(sourceStop.distanceFromStart);
    const destinationDistance = Number(destinationStop.distanceFromStart);

    const calculatedDistance = Math.abs(destinationDistance - sourceDistance);

    if (calculatedDistance <= 0) {
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
      return;
    }

    const fareUnit = Math.ceil(calculatedDistance / 10);
    const calculatedFarePerSeat = fareUnit * 60;
    const calculatedTotalFare = calculatedFarePerSeat * Number(seatCount || 1);

    setDistance(calculatedDistance);
    setFarePerSeat(calculatedFarePerSeat);
    setTotalFare(calculatedTotalFare);
  };

  const bookTicket = async (e) => {
    e.preventDefault();

    if (sourceStationId === destinationStationId) {
      toast.error("Source and destination cannot be same");
      return;
    }

    if (!totalFare || totalFare <= 0) {
      toast.error("Fare could not be calculated. Please check route stops.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/tickets", {
        routeId: Number(routeId),
        trainId: Number(trainId),
        sourceStationId: Number(sourceStationId),
        destinationStationId: Number(destinationStationId),
        journeyDate: journeyDate,
        seatCount: Number(seatCount),
        totalFare: Number(totalFare),
      });

      toast.success("Ticket booked successfully");

      setRouteId("");
      setTrainId("");
      setSourceStationId("");
      setDestinationStationId("");
      setJourneyDate("");
      setSeatCount(1);
      setDistance(0);
      setFarePerSeat(0);
      setTotalFare(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book ticket");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoutes();
    getTrains();
    getStations();
  }, []);

  useEffect(() => {
    calculateFare();
  }, [routeId, sourceStationId, destinationStationId, seatCount, routes]);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Book Ticket
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select route, train, stations and journey date to book your ticket.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6 lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Ticket Information
          </h2>

          <form onSubmit={bookTicket} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Route
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={routeId}
                onChange={(e) => {
                  setRouteId(e.target.value);
                  setSourceStationId("");
                  setDestinationStationId("");
                }}
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

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Train
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={trainId}
                onChange={(e) => setTrainId(e.target.value)}
                required
              >
                <option value="">Select train</option>
                {trains.map((train) => (
                  <option key={train.id} value={train.id}>
                    {train.trainNumber} - Capacity {train.capacity}
                  </option>
                ))}
              </select>
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
                {getRouteStations(routes, routeId, stations).map((station) => (
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
                {getRouteStations(routes, routeId, stations).map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Journey Date
              </label>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Seat Count
              </label>
              <input
                type="number"
                min="1"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Distance
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none"
                value={distance ? `${distance} km` : "Auto calculated"}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Fare Per Seat
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none"
                value={farePerSeat ? `${farePerSeat} tk` : "Auto calculated"}
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Total Fare
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900 outline-none"
                value={totalFare ? `${totalFare} tk` : "Auto calculated"}
                readOnly
              />
              <p className="mt-2 text-xs text-slate-500">
                Fare rule: 60 tk for every 10 km. Total fare is calculated based
                on distance and seat count.
              </p>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Booking..." : "Book Ticket"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow md:p-6">
          <h2 className="text-xl font-bold text-cyan-400">Booking Summary</h2>

          <div className="mt-5 space-y-4 text-sm">
            <SummaryItem label="Route" value={getRouteName(routes, routeId)} />
            <SummaryItem label="Train" value={getTrainName(trains, trainId)} />
            <SummaryItem
              label="From"
              value={getStationName(stations, sourceStationId)}
            />
            <SummaryItem
              label="To"
              value={getStationName(stations, destinationStationId)}
            />
            <SummaryItem label="Journey Date" value={journeyDate || "N/A"} />
            <SummaryItem label="Distance" value={distance ? `${distance} km` : "N/A"} />
            <SummaryItem label="Fare Per Seat" value={farePerSeat ? `${farePerSeat} tk` : "N/A"} />
            <SummaryItem label="Seats" value={seatCount || "N/A"} />
            <SummaryItem label="Total Fare" value={totalFare ? `${totalFare} tk` : "N/A"} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}

function getRouteName(routes, id) {
  const route = routes.find((item) => item.id === Number(id));
  return route ? route.name : "N/A";
}

function getTrainName(trains, id) {
  const train = trains.find((item) => item.id === Number(id));
  return train ? train.trainNumber : "N/A";
}

function getStationName(stations, id) {
  const station = stations.find((item) => item.id === Number(id));
  return station ? station.name : "N/A";
}

function getRouteStations(routes, routeId, allStations) {
  const selectedRoute = routes.find((route) => route.id === Number(routeId));

  if (!selectedRoute) {
    return allStations;
  }

  const routeStops = selectedRoute.routeStations || selectedRoute.stops || [];

  if (routeStops.length === 0) {
    return allStations;
  }

  const stationList = routeStops
    .map((stop) => {
      if (stop.station) {
        return stop.station;
      }

      const stationId = stop.stationId;
      return allStations.find((station) => station.id === stationId);
    })
    .filter(Boolean);

  return stationList;
}