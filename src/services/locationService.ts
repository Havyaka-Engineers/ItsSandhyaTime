/**
 * Interface for location coordinates
 */
interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Service to handle location-related functionality
 */
export const locationService = {
  /**
   * Check if geolocation is supported by the browser
   * @returns {boolean} Whether geolocation is supported
   */
  isSupported(): boolean {
    return "geolocation" in navigator;
  },

  /**
   * Request location permission and get current position
   * @returns {Promise<Coordinates>} Promise resolving to coordinates
   */
  async getCurrentPosition(): Promise<Coordinates> {
    if (!this.isSupported()) {
      throw new Error("Geolocation is not supported by this browser");
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            throw new Error("Location permission denied");
          case error.POSITION_UNAVAILABLE:
            throw new Error("Location information unavailable");
          case error.TIMEOUT:
            throw new Error("Location request timed out");
          default:
            throw new Error("Unknown location error");
        }
      }
      throw error;
    }
  },
};
