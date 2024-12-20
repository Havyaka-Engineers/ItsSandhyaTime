import SunCalc from "suncalc";

/**
 * Service to handle sunrise/sunset calculations
 */
export const sunService = {
  /**
   * Get sunrise, sunset and twilight times for a location
   * @param latitude - Location latitude
   * @param longitude - Location longitude
   * @returns Object with various sun times
   */
  getSunTimes(
    latitude: number,
    longitude: number
  ): {
    sunrise: string;
    sunset: string;
    dawn: string; // Civil dawn
    dusk: string; // Civil dusk
    solarNoon: string;
  } {
    try {
      const times = SunCalc.getTimes(new Date(), latitude, longitude);

      const formatTime = (date: Date) =>
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      return {
        sunrise: formatTime(times.sunrise),
        sunset: formatTime(times.sunset),
        dawn: formatTime(times.dawn),
        dusk: formatTime(times.dusk),
        solarNoon: formatTime(times.solarNoon),
      };
    } catch (error) {
      console.error("Error calculating sun times:", error);
      return {
        sunrise: "--:--",
        sunset: "--:--",
        dawn: "--:--",
        dusk: "--:--",
        solarNoon: "--:--",
      };
    }
  },

  /**
   * Get sun position
   * @param latitude - Location latitude
   * @param longitude - Location longitude
   * @returns Object with sun altitude and azimuth
   */
  getSunPosition(
    latitude: number,
    longitude: number
  ): {
    altitude: number;
    azimuth: number;
  } {
    try {
      const position = SunCalc.getPosition(new Date(), latitude, longitude);
      return {
        altitude: position.altitude * (180 / Math.PI), // Convert to degrees
        azimuth: position.azimuth * (180 / Math.PI), // Convert to degrees
      };
    } catch (error) {
      console.error("Error calculating sun position:", error);
      return {
        altitude: 0,
        azimuth: 0,
      };
    }
  },
};
