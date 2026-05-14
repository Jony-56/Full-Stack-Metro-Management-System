"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function PassengerProfilePage() {
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const currentUser = res.data.user || res.data;

      setUser(currentUser);
      setFullName(currentUser.fullName || "");
      setPhone(currentUser.phone || "");

      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      console.log(error.response?.data || error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setProfileLoading(true);

      const res = await api.patch("/users/me", {
        fullName: fullName,
        phone: phone,
      });

      toast.success("Profile updated successfully");

      const updatedUser = res.data.user || {
        ...user,
        fullName: fullName,
        phone: phone,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.log(error.response?.data || error);
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      setPasswordLoading(true);

      await api.patch("/users/change-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.log(error.response?.data || error);
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <DashboardLayout role="passenger">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and change your password.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow md:p-6">
          <h2 className="text-xl font-bold text-cyan-400">
            Account Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <ProfileItem label="Name" value={user?.fullName || "N/A"} />
            <ProfileItem label="Email" value={user?.email || "N/A"} />
            <ProfileItem label="Phone" value={user?.phone || "N/A"} />
            <ProfileItem label="Role" value={user?.role || "N/A"} />
            <ProfileItem
              label="Status"
              value={user?.isActive === false ? "Inactive" : "Active"}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Update Profile
          </h2>

          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Change Password
          </h2>

          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Old Password
              </label>
              <input
                type="password"
                placeholder="Enter old password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold capitalize text-white">
        {value}
      </span>
    </div>
  );
}