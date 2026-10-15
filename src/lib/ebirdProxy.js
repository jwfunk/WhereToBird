// Proxy function for eBird API calls
export const fetchEbirdData = async (latitude, longitude) => {
  try {
    // This will be replaced with your actual backend function call
    const response = await fetch('/api/ebird', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: latitude,
        lng: longitude
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};