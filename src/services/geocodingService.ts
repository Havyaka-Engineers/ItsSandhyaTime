/**
 * Service to handle location search and geocoding
 */
export const geocodingService = {
  /**
   * Search for locations by query string
   */
  async searchLocations(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            format: "json",
            q: query,
            addressdetails: "1",
            limit: "5",
          }),
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "SandhyaTime/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  },
};
