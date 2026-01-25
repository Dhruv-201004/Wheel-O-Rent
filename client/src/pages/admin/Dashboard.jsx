import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

export default function Dashboard() {
  const { token, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch maintenance mode status
  const fetchMaintenanceStatus = async () => {
    try {
      const { data } = await axios.get("/api/admin/maintenance-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setMaintenanceMode(data.maintenanceMode);
      }
    } catch (error) {
      console.error("Failed to fetch maintenance status");
    }
  };

  // Toggle maintenance mode
  const handleMaintenanceToggle = async () => {
    try {
      const { data } = await axios.post(
        "/api/admin/maintenance-toggle",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        setMaintenanceMode(!maintenanceMode);
        toast.success("Maintenance mode toggled");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle maintenance mode");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Delete car
  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Car deleted successfully");
        fetchCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete car");
    }
  };

  // Update booking status
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success("Booking status updated");
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  // Make user admin
  const handleMakeAdmin = async (userId) => {
    try {
      const { data } = await axios.post(
        `/api/admin/users/${userId}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success("User promoted to admin");
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to promote user");
    }
  };

  // Remove admin access
  const handleRemoveAdmin = async (userId) => {
    try {
      const { data } = await axios.post(
        `/api/admin/users/${userId}/remove-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success("Admin access removed");
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to remove admin access");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMaintenanceStatus();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto !px-3 sm:!px-6 lg:!px-8 !py-4 sm:!py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="!px-4 sm:!px-6 !py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1" aria-label="Tabs">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "users", label: "Users", icon: "👥" },
              { id: "cars", label: "Cars", icon: "🚗" },
              { id: "bookings", label: "Bookings", icon: "📅" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "users") fetchUsers();
                  if (tab.id === "cars") fetchCars();
                  if (tab.id === "bookings") fetchBookings();
                }}
                className={`px-4 py-4 border-b-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/30"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Users Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Users
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      {stats.totalUsers}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Platform users</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 10a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 12a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Owners Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Owners
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      {stats.totalOwners}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Car owners</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Cars Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Cars
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      {stats.totalCars}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">In system</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      ${stats.totalRevenue}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">All time</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-4">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.16 5.314l4.897-1.596A1 1 0 0114 4.69v4.535a8 8 0 01-2.357 5.529l-.834.834a8 8 0 01-5.656 2.342H7a1 1 0 01-.82-1.569l1.285-1.538A8 8 0 018.16 5.314z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Booking Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-100">
                  <p className="text-gray-600 text-sm font-medium">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-3">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-100">
                  <p className="text-gray-600 text-sm font-medium">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600 mt-3">
                    {stats.confirmedBookings}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-6 border border-amber-100">
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-amber-600 mt-3">
                    {stats.pendingBookings}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg p-6 border border-red-100">
                  <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600 mt-3">
                    {stats.cancelledBookings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                👥 Users Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage platform users and assign admin roles
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm space-x-3">
                        {user.isAdmin ? (
                          <button
                            onClick={() => handleRemoveAdmin(user._id)}
                            className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 px-3 py-1.5 hover:bg-amber-50 rounded"
                          >
                            Remove Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 px-3 py-1.5 hover:bg-green-50 rounded"
                          >
                            Make Admin
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 px-3 py-1.5 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === "cars" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                🚗 Cars Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                View and manage all vehicles in the system
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Brand & Model
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price/Day
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map((car) => (
                    <tr
                      key={car._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {car.brand} {car.model}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {car.owner?.name || "N/A"}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${car.pricePerDay}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            car.currentlyBooked
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : car.isAvailable
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {car.currentlyBooked
                            ? "Booked"
                            : car.isAvailable
                              ? "Available"
                              : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 px-3 py-1.5 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                📅 Bookings Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                View and manage all booking transactions
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pickup Date
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.car?.brand} {booking.car?.model}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {booking.user?.name}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              booking._id,
                              e.target.value,
                            )
                          }
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${booking.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ⚙️ Maintenance Mode
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-md">
                    Enable maintenance mode to temporarily disable the website
                    for regular users. Admins can still access the platform.
                  </p>
                </div>
                <button
                  onClick={handleMaintenanceToggle}
                  className={`relative inline-flex h-10 w-16 items-center rounded-full transition-all duration-300 ${
                    maintenanceMode
                      ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-200"
                      : "bg-gradient-to-r from-gray-300 to-gray-400 shadow-sm"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-all duration-300 shadow-md ${
                      maintenanceMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {maintenanceMode && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    <span>
                      Maintenance mode is currently <strong>ENABLED</strong>.
                      Regular users cannot access the website.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
