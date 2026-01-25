import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const LocationSearch = ({
  value,
  onChange,
  placeholder = "Search location...",
}) => {
  const { axios } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimer = useRef(null);

  // Search for available locations
  const searchLocations = async (query) => {
    if (!query || query.trim().length < 2) {
      setFilteredCities([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await axios.get("/api/user/locations", {
        params: { searchQuery: query },
      });

      if (data.success && data.locations.length > 0) {
        setFilteredCities(data.locations);
        setIsOpen(true);
      } else {
        setFilteredCities([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setFilteredCities([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter cities based on input with debounce
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    if (value.trim().length >= 2) {
      setIsSearching(true);
      searchTimer.current = setTimeout(() => {
        searchLocations(value);
      }, 300);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const selectedCity = filteredCities[highlightedIndex];
          onChange(selectedCity);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (value.trim().length >= 2 && filteredCities.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full !px-3 md:!px-4 !py-2 md:!py-2.5 border border-gray-300 rounded-lg md:rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs md:text-sm text-gray-700 transition-all"
      />

      {/* Loading indicator */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Dropdown suggestions */}
      {isOpen && filteredCities.length > 0 && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto"
        >
          {filteredCities.map((city, index) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              onClick={() => {
                onChange(city);
                setIsOpen(false);
              }}
              className={`!px-4 !py-3 cursor-pointer transition-colors text-sm ${
                index === highlightedIndex
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {city}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No cars available message */}
      {isOpen &&
        filteredCities.length === 0 &&
        value.trim().length >= 2 &&
        !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 !p-4 text-center text-gray-500 text-sm"
          >
            No cars available in this area
          </motion.div>
        )}
    </div>
  );
};

export default LocationSearch;
