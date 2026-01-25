import { assets } from "../assets/assets";
import Title from "./Title";
import { motion } from "motion/react";

const Testimonials = () => {
  // Testimonials data
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: assets.testimonial_image_1,
      testimonial:
        "I've rented cars from various companies, but the experience with CarRental was exceptional.",
    },
    {
      name: "Liam Johnson",
      location: "New York, USA",
      image: assets.testimonial_image_2,
      testimonial:
        "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
    },
    {
      name: "Sophia Lee",
      location: "Seoul, South Korea",
      image: assets.testimonial_image_3,
      testimonial:
        "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
    },
  ];

  return (
    <div className="!py-12 sm:!py-20 md:!py-28 !px-4 sm:!px-6 md:!px-8 lg:!px-16 xl:!px-24 2xl:!px-32">
      {/* Section title */}
      <Title
        title="What Our Customers Say"
        subTitle="Discover why smart travelers choose CarRental for stress-free car rentals and exceptional service across the country."
      />

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 !mt-10 md:!mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
            // Card animation with staggered delay
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            key={index}
            className="bg-white !p-4 sm:!p-5 md:!p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            {/* User profile */}
            <div className="flex items-center gap-3">
              <img
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>

            {/* Rating stars */}
            <div className="flex items-center gap-1 !mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img key={index} src={assets.star_icon} alt="star-icon" />
                ))}
            </div>

            {/* Testimonial text */}
            <p className="text-gray-500 !mt-3 md:!mt-4 font-light text-sm md:text-base">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
