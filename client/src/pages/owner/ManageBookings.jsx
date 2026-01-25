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
    <div className="!px-4 !pt-10 md:!px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve
        or cancel requests, and manage booking status."
      />

      {/* Bookings Table */}
      <div
        className="max-w-3xl w-full rounded-md overflow-hidden border
      border-borderColor !mt-6"
      >
        <table className="w-full border-collapse text-left text-sm text-gray-600 ">
          <thead className="text-gray-500">
            <tr>
              <th className="!p-3 font-medium">Car</th>
              <th className="!p-3 font-medium max-md:hidden">Date Range</th>
              <th className="!p-3 font-medium">Total</th>
              <th className="!p-3 font-medium max-md:hidden">Payment</th>
              <th className="!p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className="border-t border-borderColor text-gray-500"
              >
                {/* Car Info */}
                <td className="!p-3 flex items-center gap-3">
                  <img
                    src={booking.car.image}
                    alt=""
                    className="h-12 w-12
                  aspect-square rounded-md object-cover"
                  />
                  <p className="font-medium">
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>

                {/* Date Range */}
                <td className="!p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} To{" "}
                  {booking.returnDate.split("T")[0]}
                </td>

                {/* Total Price */}
                <td className="!p-3">
                  {currency} {booking.price}
                </td>

                {/* Payment Status */}
                <td className="!p-3 max-md:hidden">
                  <span
                    className={`!py-1 !px-3 rounded-full text-xs ${
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
                <td className="!p-3">
                  {booking.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          changeBookingStatus(booking._id, "confirmed")
                        }
                        disabled={processingId === booking._id}
                        className="!px-3 !py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === booking._id ? "..." : "Confirm"}
                      </button>
                      <button
                        onClick={() =>
                          changeBookingStatus(booking._id, "cancelled")
                        }
                        disabled={processingId === booking._id}
                        className="!px-3 !py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === booking._id ? "..." : "Cancel"}
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`!px-3 !py-1 rounded-full text-xs font-semibold
                      ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
