import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  // Dashboard state
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  // Card configuration
  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.carIconColored,
    },
    {
      title: "Pending ",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed ",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  // Fetch dashboard metrics
  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Load data when owner is authenticated
  useEffect(() => {
    if (isOwner) fetchDashboardData();
  }, [isOwner]);

  return (
    <div className="!px-4 !py-8 md:!px-10 flex-1 bg-gray-50/50">
      <Title
        title="Owner Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 !my-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-between !p-5 rounded-xl border border-borderColor bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h1 className="text-xs text-gray-500 uppercase tracking-wide">
                {card.title}
              </h1>
              <p className="text-2xl font-bold text-gray-800 !mt-1">
                {card.value}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <img src={card.icon} alt="" className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 !mb-8 w-full">
        {/* Recent Bookings */}
        <div className="!p-5 md:!p-6 border border-borderColor rounded-xl bg-white shadow-sm flex-1 min-w-[320px]">
          <div className="!mb-4">
            <h1 className="text-lg font-semibold text-gray-800">
              Recent Bookings
            </h1>
            <p className="text-gray-500 text-sm">Latest customer bookings</p>
          </div>
          <div className="space-y-4">
            {data.recentBookings.length > 0 ? (
              data.recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between !p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10">
                      <img
                        src={assets.listIconColored}
                        alt=""
                        className="h-5 w-5"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.createdAt.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-gray-600">
                      {currency}
                      {booking.price}
                    </p>
                    <p
                      className={`!px-3 !py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-400/15 text-green-600"
                          : "bg-red-400/15 text-red-600"
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center !py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center !mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <p className="text-gray-400 text-sm !mt-1">
                  Your recent bookings will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="!p-5 md:!p-6 border border-borderColor rounded-xl bg-white shadow-sm w-full md:max-w-xs">
          <h1 className="text-lg font-semibold text-gray-800">
            Monthly Revenue
          </h1>
          <p className="text-gray-500 text-sm">Revenue for current month</p>
          <div className="!mt-6 !p-4 rounded-lg bg-primary/5">
            <p className="text-3xl font-bold text-primary">
              {currency}
              {data.monthlyRevenue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
