"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/DashboardLayout";
import api from "../../../lib/axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("passenger");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      const res = await api.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
      console.log(error.response?.data || error);
    }
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setRole("passenger");
    setEditId(null);
  };

  const editUser = (user) => {
    setEditId(user.id);
    setFullName(user.fullName || "");
    setPhone(user.phone || "");
    setRole(user.role || "passenger");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    if (!editId) {
      toast.error("Please select a user to update");
      return;
    }

    try {
      setLoading(true);

      await api.patch(`/users/${editId}`, {
        fullName: fullName,
        phone: phone,
        role: role,
      });

      toast.success("User updated successfully");
      resetForm();
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id, isActive) => {
    try {
      await api.patch(`/users/${id}`, {
        isActive: isActive,
      });

      toast.success(isActive ? "User activated" : "User deactivated");
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user status");
      console.log(error.response?.data || error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = confirm("Are you sure you want to deactivate this user?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deactivated");
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View, update, activate and deactivate system users.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Update User
          </h2>

          {!editId && (
            <p className="mb-4 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-700">
              Click Edit from the user list to update a user.
            </p>
          )}

          <form onSubmit={updateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editId}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="text"
                placeholder="Phone number"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!editId}
              >
                <option value="passenger">Passenger</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!editId || loading}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update User"}
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
            User List
          </h2>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-100 text-sm text-slate-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan="6">
                      No user found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b text-sm">
                      <td className="p-3 font-medium text-slate-800">
                        {user.fullName}
                      </td>

                      <td className="p-3 text-slate-600">
                        {user.email}
                      </td>

                      <td className="p-3 text-slate-600">
                        {user.phone || "N/A"}
                      </td>

                      <td className="p-3 capitalize text-slate-600">
                        {user.role}
                      </td>

                      <td className="p-3">
                        <UserStatus user={user} />
                      </td>

                      <td className="p-3">
                        <UserActions
                          user={user}
                          editUser={editUser}
                          deleteUser={deleteUser}
                          updateUserStatus={updateUserStatus}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {users.length === 0 ? (
              <p className="text-sm text-slate-500">No user found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-sm text-slate-500">
                        Phone: {user.phone || "N/A"}
                      </p>
                      <p className="text-sm capitalize text-slate-500">
                        Role: {user.role}
                      </p>
                    </div>

                    <UserStatus user={user} />
                  </div>

                  <UserActions
                    user={user}
                    editUser={editUser}
                    deleteUser={deleteUser}
                    updateUserStatus={updateUserStatus}
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

function UserStatus({ user }) {
  if (user.isActive === false) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Inactive
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      Active
    </span>
  );
}

function UserActions({ user, editUser, deleteUser, updateUserStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => editUser(user)}
        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
      >
        Edit
      </button>

      {user.isActive === false ? (
        <button
          onClick={() => updateUserStatus(user.id, true)}
          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
        >
          Activate
        </button>
      ) : (
        <button
          onClick={() => deleteUser(user.id)}
          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
        >
          Deactivate
        </button>
      )}
    </div>
  );
}