 export function extractAirportCode(location: string): string {
    try {
      if (location.includes('(') && location.includes(')')) {
        return location.split('(')[1].split(')')[0]; // Fixed: properly extract code between parentheses
      }
      // If the format is not as expected, return the original string
      // This assumes the input might already be an airport code
      return location;
    } catch (error) {
      console.error("Error extracting airport code:", error);
      return location;
    }
  }
