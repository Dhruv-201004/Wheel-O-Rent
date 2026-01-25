import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

const LocationInput = ({ value, onChange, required = true }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [validationError, setValidationError] = useState("");
  const searchTimer = useRef(null);
  const searchInputRef = useRef(null);
  const additionalInfoRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Extract city name from location input (before comma or "near")
  const extractCityName = (location) => {
    if (!location) return "";
    return location.split(",")[0].split("near")[0].trim();
  };

  // Search for cities using Nominatim API
  const searchCities = async (cityName) => {
    if (!cityName || cityName.trim().length < 2) {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=10&addressdetails=0`,
        {
          headers: {
            "User-Agent": "WheelORent-CarRental (contact@wheelorent.com)",
          },
        },
      );

      const data = await response.json();

      if (data && data.length > 0) {
        // Extract unique city names
        const cities = [
          ...new Set(
            data.map((result) => {
              // Extract city name from display_name
              const parts = result.display_name.split(",");
              return parts[0].trim();
            }),
          ),
        ].slice(0, 8); // Limit to 8 suggestions

        setFilteredCities(cities);
        setShowSuggestions(cities.length > 0);
      } else {
        setFilteredCities([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
      setFilteredCities([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    setValidationError(""); // Clear error when user starts typing

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    if (input.trim().length >= 2) {
      setIsSearching(true);
      searchTimer.current = setTimeout(() => {
        searchCities(input);
      }, 300);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }

    setHighlightedIndex(-1);
  };

  // Handle city selection from suggestions
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchInput("");
    setFilteredCities([]);
    setShowSuggestions(false);
    onChange(city + (additionalInfo ? " " + additionalInfo : ""));
  };

  // Handle additional info change (only allowed after city selection)
  const handleAdditionalInfoChange = (e) => {
    const info = e.target.value;
    setAdditionalInfo(info);
    onChange(selectedCity + (info ? " " + info : ""));
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedCity("");
    setSearchInput("");
    setAdditionalInfo("");
    setValidationError("");
    onChange("");
  };

  // Validate location on form submission
  const validateLocation = () => {
    if (required && !selectedCity) {
      setValidationError("Please select a valid city from suggestions");
      return false;
    }
    return true;
  };

  // Expose validation method to parent
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.validateLocation = validateLocation;
    }
  }, [selectedCity, required]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredCities.length === 0) return;

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
          handleCitySelect(filteredCities[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSuggestions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <label>
          Location
          {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-primary hover:underline"
        >
          {showHelp ? "Hide" : "Show"} help
        </button>
      </div>

      {/* Help text */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="!mt-2 !p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-gray-700"
        >
          <p className="font-semibold !mb-1">Location Selection:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Search for a valid city by typing (e.g., "New York", "London")
            </li>
            <li>Select a city from the suggestions</li>
            <li>
              After selection, you can add details like: ", Sector 5" or " near
              Downtown"
            </li>
            <li>
              You cannot submit without selecting a valid city from suggestions
            </li>
          </ul>
        </motion.div>
      )}

      {/* City not selected - show search field */}
      {!selectedCity && (
        <div className="relative !mt-2">
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchInput.trim().length >= 2 && filteredCities.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search and select a city..."
            className={`w-full !px-3 !py-2 border rounded-md outline-none focus:border-primary transition-colors ${
              validationError
                ? "border-red-500 focus:border-red-600"
                : "border-borderColor"
            }`}
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

          {/* City suggestions dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto"
            >
              {filteredCities.map((city, index) => (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  onClick={() => handleCitySelect(city)}
                  className={`!px-4 !py-3 cursor-pointer transition-colors text-sm font-medium ${
                    index === highlightedIndex
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {city}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No results message */}
          {showSuggestions &&
            filteredCities.length === 0 &&
            searchInput.trim().length >= 2 &&
            !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 !p-4 text-center text-gray-500 text-sm"
              >
                No cities found for "{searchInput}"
              </motion.div>
            )}
        </div>
      )}

      {/* Validation error message */}
      {validationError && !selectedCity && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="!mt-2 text-xs text-red-600 font-medium"
        >
          ✗ {validationError}
        </motion.p>
      )}

      {/* City selected - show selected city and additional info field */}
      {selectedCity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-3 !mt-2"
        >
          {/* Selected city display */}
          <div className="flex items-center justify-between gap-2 !p-3 bg-green-50 border border-green-300 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <p className="text-xs text-gray-500">Selected City</p>
                <p className="font-semibold text-gray-800">{selectedCity}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Change
            </button>
          </div>

          {/* Additional info field */}
          <div>
            <label className="text-xs text-gray-600 block !mb-2">
              Additional Details (Optional)
            </label>
            <input
              ref={additionalInfoRef}
              type="text"
              value={additionalInfo}
              onChange={handleAdditionalInfoChange}
              placeholder="e.g., Sector 5, near Downtown, Manhattan"
              className="w-full !px-3 !py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-colors text-sm"
            />
            <p className="text-xs text-gray-500 !mt-1">
              Add sector, landmark, or district information
            </p>
          </div>

          {/* Full location display */}
          <div className="!p-2 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-600">Final Location:</p>
            <p className="font-medium text-gray-800">
              {selectedCity}
              {additionalInfo && (
                <span className="text-primary"> {additionalInfo}</span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationInput;
