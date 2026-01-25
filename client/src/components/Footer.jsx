import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Scroll to top when link is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Footer container with animation
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="!p-4 sm:!p-6 md:!px-8 lg:!px-16 xl:!px-24 2xl:!px-32 !mt-32 sm:!mt-40 md:!mt-60 text-xs sm:text-sm text-gray-500 bg-light border-t border-borderColor"
    >
      {/* Top section: Logo, description, social links, and navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-between items-start gap-8 !pb-6 border-b border-borderColor"
      >
        {/* Logo and description */}
        <div className="max-w-sm">
          <Link to="/" onClick={scrollToTop}>
            <motion.img
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              src={assets.logo}
              alt="Wheel-O-Rent"
              className="h-10 md:h-12"
            />
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="!mt-4 text-gray-600 leading-relaxed"
          >
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </motion.p>

          {/* Social media icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4 !mt-5"
          >
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors"
            >
              <img
                src={assets.facebook_logo}
                className="w-4 h-4"
                alt="Facebook"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors"
            >
              <img
                src={assets.instagram_logo}
                className="w-4 h-4"
                alt="Instagram"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors"
            >
              <img
                src={assets.twitter_logo}
                className="w-4 h-4"
                alt="Twitter"
              />
            </a>
          </motion.div>
        </div>

        {/* Navigation links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-12 md:gap-16"
        >
          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Quick Links
            </h2>
            <ul className="!mt-4 flex flex-col gap-2.5">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cars"
                  onClick={scrollToTop}
                  className="hover:text-primary transition-colors"
                >
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  onClick={scrollToTop}
                  className="hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Contact Us
            </h2>
            <ul className="!mt-4 flex flex-col gap-2.5">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>123 Main Street, New York</span>
              </li>
              <li>
                <a
                  href="tel:+11234567890"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <span>📞</span>
                  <span>+1 (123) 456-7890</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@example.com"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <span>✉️</span>
                  <span>contact@example.com</span>
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom section: Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col md:flex-row gap-3 items-center justify-between !pt-5"
      >
        <p className="text-gray-500">
          © {new Date().getFullYear()} Wheel-O-Rent. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
