import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  // Parse arguments from the GraphQL request
  const { lat, lng, apiKey } = event.arguments || {};

  if (!lat || !lng || !apiKey) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Missing lat, lng, or apiKey parameters' })
    };
  }

  try {
    // Handle preflight requests (for direct HTTP calls)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: ''
      };
    }

    // Construct eBird API URL
    const apiUrl = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&dist=25&maxResults=100&includeProvisional=false&back=30`;

    // Make request to eBird API using fetch (available in Lambda environment)
    const response = await fetch(apiUrl, {
      headers: {
        'x-ebirdapitoken': apiKey
      }
    });

    // Handle case where eBird API returns an error
    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ error: `eBird API Error: ${errorBody}` })
      };
    }

    const data = await response.json();

    const json = {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: data
    };
    return JSON.stringify(json)
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to fetch data from eBird API' })
    };
  }
};