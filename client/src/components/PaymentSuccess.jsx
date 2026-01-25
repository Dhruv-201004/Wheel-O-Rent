import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const PaymentSuccess = ({ isOpen, onClose, booking, carData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center !p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full !p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto !mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* Success Message */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-green-600 !mb-2"
        >
          Payment Successful!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 !mb-6"
        >
          Awaiting owner confirmation
        </motion.p>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-lg !p-4 !mb-6 text-left"
        >
          <div className="flex justify-between !mb-2">
            <span className="text-gray-500">Car:</span>
            <span className="font-semibold">{carData?.name}</span>
          </div>
          <div className="flex justify-between !mb-2">
            <span className="text-gray-500">Location:</span>
            <span className="font-semibold">{carData?.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid:</span>
            <span className="font-semibold text-green-600">
              ₹{booking?.price || "0"}
            </span>
          </div>
        </motion.div>

        {/* Pickup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg !p-4 !mb-6 text-left"
        >
          <h3 className="font-semibold text-blue-800 !mb-2 flex items-center gap-2">
            <span>⏳</span> What's Next?
          </h3>
          <p className="text-sm text-blue-700">
            The car owner will review and confirm your booking. Once confirmed,
            pick up your car at <strong>{carData?.location}</strong> on your
            selected date. You'll receive a full refund if the owner cancels.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate("/my-bookings")}
          className="w-full bg-primary hover:bg-primary-dull text-white font-semibold !py-3 rounded-lg transition-all cursor-pointer"
        >
          View My Bookings
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
