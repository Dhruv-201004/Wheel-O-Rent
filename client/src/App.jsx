import Navbar from "./components/Navbar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBooking from "./pages/MyBooking";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import AdminDashboard from "./pages/admin/Dashboard";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { showLogin, isAdmin, user } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  const isAdminPath = useLocation().pathname.startsWith("/admin");
  const navigate = useNavigate();

  // If admin is logged in and not on admin page, redirect to admin
  useEffect(() => {
    if (isAdmin && user && !isAdminPath) {
      navigate("/admin");
    }
  }, [isAdmin, user, isAdminPath, navigate]);

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isOwnerPath && !isAdminPath && <Footer />}
    </>
  );
};

export default App;
