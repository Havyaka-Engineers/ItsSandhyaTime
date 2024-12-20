import { useEffect, useState } from "react";
import {
  Page,
  Block,
  Card,
  Navbar,
  Link,
  ListInput,
  List,
  ListItem,
  Button,
} from "konsta/react";
import { locationService } from "../services/locationService";
import { sunService } from "../services/sunService";
import { SunIcon, MoonIcon, PencilIcon } from "@heroicons/react/24/outline";
import { auth } from "../firebase.config";
import { useNavigate } from "react-router-dom";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

function SunTimings(): JSX.Element {
  const navigate = useNavigate();
  const isGuestUser = !auth.currentUser?.email;
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    cityName?: string;
  } | null>(null);
  const [sunTimes, setSunTimes] = useState<{
    sunrise: string;
    sunset: string;
  }>({ sunrise: "--:--", sunset: "--:--" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLocationAndSunTimes = async () => {
      try {
        const coords = await locationService.getCurrentPosition();
        setLocation(coords);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`
          );
          const data = await response.json();

          const address = data.address;
          const locationName =
            address.city ||
            address.town ||
            address.suburb ||
            address.district ||
            address.county ||
            address.state ||
            "Unknown Location";

          const state = address.state;
          const country = address.country;
          const fullLocation = [locationName, state, country]
            .filter(Boolean)
            .join(", ");

          setLocation((prev) => ({
            ...prev!,
            cityName: fullLocation,
          }));
        } catch (error) {
          console.error("Error fetching city name:", error);
          setLocation((prev) => ({
            ...prev!,
            cityName: `${coords.latitude.toFixed(
              2
            )}°, ${coords.longitude.toFixed(2)}°`,
          }));
        }

        const times = sunService.getSunTimes(coords.latitude, coords.longitude);
        setSunTimes(times);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndSunTimes();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleLocationSelect = async (suggestion: LocationSuggestion) => {
    try {
      setLoading(true);
      const { lat, lon, address } = suggestion;

      const locationName =
        address.city ||
        address.town ||
        address.suburb ||
        address.district ||
        address.county ||
        address.state ||
        suggestion.display_name.split(",")[0];

      const state = address.state;
      const country = address.country;
      const fullLocation = [locationName, state, country]
        .filter(Boolean)
        .join(", ");

      setLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        cityName: fullLocation,
      });

      const times = sunService.getSunTimes(parseFloat(lat), parseFloat(lon));
      setSunTimes(times);
      setIsEditing(false);
      setSuggestions([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Navbar
        title="Sun Timings"
        right={
          !isGuestUser ? (
            <Link navbar onClick={handleLogout}>
              Logout
            </Link>
          ) : null
        }
      />
      <Block className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">{today}</h1>
          {isEditing ? (
            <div className="relative">
              <ListInput
                type="text"
                placeholder="Search location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchLocations(e.target.value);
                }}
                className="text-lg"
                colors={{
                  labelTextIos: "text-white",
                  bgIos: "bg-gray-800",
                }}
              />
              {suggestions.length > 0 && (
                <List
                  className="absolute z-50 w-full mt-1 rounded-lg shadow-lg bg-gray-800 text-white"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                      link
                      onClick={() => handleLocationSelect(suggestion)}
                      title={suggestion.display_name}
                      className="text-sm"
                      colors={{
                        activeBgIos: "active:bg-gray-700",
                      }}
                    />
                  ))}
                </List>
              )}
              <div className="flex justify-center gap-2 mt-2">
                <Button
                  small
                  colors={{
                    fillBgIos: "bg-gray-200",
                    fillTextIos: "text-black",
                  }}
                  onClick={() => {
                    setIsEditing(false);
                    setSuggestions([]);
                    setSearchTerm("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg text-gray-600">
                {loading ? "Loading location..." : location?.cityName}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setSearchTerm(location?.cityName || "");
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <PencilIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card
            header={
              <div className="flex items-center gap-2">
                <SunIcon className="w-6 h-6 text-amber-500" />
                <span>Sunrise</span>
              </div>
            }
            className="text-center"
          >
            <div className="text-2xl font-semibold">
              {new Date(`2000/01/01 ${sunTimes.sunrise}`).toLocaleTimeString(
                [],
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </div>
          </Card>

          <Card
            header={
              <div className="flex items-center gap-2">
                <MoonIcon className="w-6 h-6 text-indigo-500" />
                <span>Sunset</span>
              </div>
            }
            className="text-center"
          >
            <div className="text-2xl font-semibold">
              {new Date(`2000/01/01 ${sunTimes.sunset}`).toLocaleTimeString(
                [],
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </div>
          </Card>
        </div>
      </Block>
    </Page>
  );
}

export default SunTimings;
