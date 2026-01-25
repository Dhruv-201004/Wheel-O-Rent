import Banner from "../components/Banner";
import FeaturedSection from "../components/FeaturedSection";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const Home = () => {
  const { axios } = useAppContext();
  const [hasAvailableCars, setHasAvailableCars] = useState(false);

  // Check if there are available cars for today
  useEffect(() => {
    const checkAvailableCars = async () => {
      try {
        const { data } = await axios.get("/api/bookings/today-bookings");
        const todayBookedCarIds = data.success
          ? data.bookings.map((booking) => booking.car)
          : [];

        // Fetch all public cars
        const carsResponse = await axios.get("/api/user/cars-public");
        if (carsResponse.data.success) {
          const availableCars = carsResponse.data.cars.filter(
            (car) => !todayBookedCarIds.includes(car._id),
          );
          setHasAvailableCars(availableCars.length > 0);
        }
      } catch (error) {
        // If there's an error, show the section
        setHasAvailableCars(true);
      }
    };

    checkAvailableCars();
  }, [axios]);

  return (
    <>
      <Hero />
      {hasAvailableCars && <FeaturedSection />}
      <Banner />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
