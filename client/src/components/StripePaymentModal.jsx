import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

// Inner Payment Form Component
const PaymentForm = ({
  carData,
  pickupDate,
  returnDate,
  price,
  days,
  onPaymentSuccess,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { axios } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system not ready");
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      // Confirm payment on backend
      if (paymentIntent.status === "succeeded") {
        const response = await axios.post("/api/bookings/confirm-payment", {
          car: carData._id,
          pickupDate,
          returnDate,
          stripePaymentIntentId: paymentIntent.id,
        });

        if (response.data.success) {
          onPaymentSuccess(response.data.booking);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <div className="border border-borderColor rounded-lg !p-4">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full !py-3 rounded-lg font-semibold transition-all ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dull text-white cursor-pointer"
        }`}
      >
        {isProcessing ? "Processing..." : `Pay ₹${price}`}
      </button>
    </form>
  );
};

// Main Modal Component
const StripePaymentModal = ({
  isOpen,
  onClose,
  carData,
  pickupDate,
  returnDate,
  price,
  days,
  onPaymentSuccess,
}) => {
  const { axios } = useAppContext();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset and fetch payment intent when modal opens
  useEffect(() => {
    if (isOpen && carData && !clientSecret) {
      setIsLoading(true);
      axios
        .post("/api/bookings/create-payment-intent", {
          car: carData._id,
          pickupDate,
          returnDate,
        })
        .then((res) => {
          if (res.data.success) {
            setClientSecret(res.data.clientSecret);
          } else {
            toast.error(res.data.message);
            onClose();
          }
        })
        .catch((err) => {
          toast.error("Failed to initialize payment");
          onClose();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, carData]);

  // Reset client secret when modal closes
  useEffect(() => {
    if (!isOpen) {
      setClientSecret("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#4F46E5",
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center !p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full !p-4 sm:!p-6 my-4 sm:my-0 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center !mb-4 sm:!mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg !p-3 sm:!p-4 !mb-4 sm:!mb-6">
          <div className="flex justify-between !mb-3">
            <span className="text-gray-600">Car:</span>
            <span className="font-semibold">{carData?.name}</span>
          </div>
          <div className="flex justify-between !mb-3">
            <span className="text-gray-600">Days:</span>
            <span className="font-semibold">{days}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 !pt-3">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary">₹{price}</span>
          </div>
        </div>

        {/* Payment Form with Stripe Elements */}
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <PaymentForm
              carData={carData}
              pickupDate={pickupDate}
              returnDate={returnDate}
              price={price}
              days={days}
              onPaymentSuccess={onPaymentSuccess}
              onClose={onClose}
            />
          </Elements>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 !mt-3">Initializing payment...</p>
          </div>
        )}

        {/* Security Note */}
        <p className="text-xs text-center text-gray-500 !mt-3 sm:!mt-4">
          🔒 Your payment is secured by Stripe
        </p>
      </motion.div>
    </div>
  );
};

export default StripePaymentModal;
