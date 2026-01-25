import { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // Fetch all bookings for the owner
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change booking status (Pending, Confirmed, Cancelled)
  const changeBookingStatus = async (bookingId, status) => {
    // Confirm before cancelling (refund will be processed)
    if (status === "cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this booking? A full refund will be issued to the customer.",
      );
      if (!confirmed) return;
    }

    setProcessingId(bookingId);
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings(); // Refresh booking list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="!px-4 !py-8 md:!px-10 w-full bg-gray-50/50">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve
        or cancel requests, and manage booking status."
      />

      {/* Bookings Table */}
      <div
        className="w-full rounded-xl overflow-hidden border
      border-borderColor !mt-8 bg-white shadow-sm"
      >
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="!p-4 font-semibold text-center">Car</th>
              <th className="!p-4 font-semibold text-center max-md:hidden">
                Date Range
              </th>
              <th className="!p-4 font-semibold text-center">Total</th>
              <th className="!p-4 font-semibold text-center max-md:hidden">
                Payment
              </th>
              <th className="!p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="border-t border-borderColor text-gray-500 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Car Info */}
                  <td className="!p-4">
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={booking.car.image}
                        alt=""
                        className="h-14 w-14 aspect-square rounded-lg object-cover shadow-sm"
                      />
                      <p className="font-medium text-gray-800 text-base">
                        {booking.car.brand} {booking.car.model}
                      </p>
                    </div>
                  </td>

                  {/* Date Range */}
                  <td className="!p-4 max-md:hidden text-center">
                    <span className="!px-3 !py-1.5 bg-gray-100 rounded-full text-sm font-medium">
                      {booking.pickupDate.split("T")[0]} →{" "}
                      {booking.returnDate.split("T")[0]}
                    </span>
                  </td>

                  {/* Total Price */}
                  <td className="!p-4 font-semibold text-gray-800 text-center text-base">
                    {currency} {booking.price}
                  </td>

                  {/* Payment Status */}
                  <td className="!p-4 max-md:hidden text-center">
                    <span
                      className={`!py-1.5 !px-3 rounded-full text-sm font-medium ${
                        booking.paymentStatus === "completed"
                          ? "bg-green-100 text-green-600"
                          : booking.paymentStatus === "refunded"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.paymentStatus === "completed"
                        ? "Paid"
                        : booking.paymentStatus === "refunded"
                          ? "Refunded"
                          : "Pending"}
                    </span>
                  </td>

                  {/* Actions / Status */}
                  <td className="!p-4 text-center">
                    {booking.status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            changeBookingStatus(booking._id, "confirmed")
                          }
                          disabled={processingId === booking._id}
                          className="!px-4 !py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {processingId === booking._id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() =>
                            changeBookingStatus(booking._id, "cancelled")
                          }
                          disabled={processingId === booking._id}
                          className="!px-4 !py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {processingId === booking._id ? "..." : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`!px-4 !py-1.5 rounded-full text-xs font-semibold
                        ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="!p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No bookings yet</p>
                    <p className="text-gray-400 text-sm !mt-1">
                      When customers book your cars, they'll appear here
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
