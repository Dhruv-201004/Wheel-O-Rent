import { motion } from "motion/react";

const Newsletter = () => {
  return (
    <motion.div
      // Container animation on scroll
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center justify-center text-center space-y-2 !my-10 !mb-20 md:!mb-40 !px-4 sm:!px-6"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold"
      >
        Never Miss a Deal!
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm md:text-lg text-gray-500/70 !pb-4 md:!pb-8"
      >
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </motion.p>

      {/* Subscription Form */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center w-full sm:max-w-2xl gap-0 md:h-13 h-12"
      >
        {/* Email Input */}
        <input
          className="border border-gray-300 rounded-t-md sm:rounded-t-none sm:rounded-l-md h-full border-b-0 sm:border-r-0 outline-none w-full !px-3 text-sm md:text-base text-gray-500"
          type="text"
          placeholder="Enter your email id"
          required
        />

        {/* Subscribe Button */}
        <button
          type="submit"
          className="sm:!px-8 md:!px-12 !px-6 h-full text-sm md:text-base text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-b-md sm:rounded-b-none sm:rounded-r-md"
        >
          Subscribe
        </button>
      </motion.form>
    </motion.div>
  );
};

export default Newsletter;
