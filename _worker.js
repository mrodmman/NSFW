// --- TEMPORARY DEBUG CODE USING AN EXTERNAL API ---
// --- DO NOT USE THIS FOR YOUR LIVE SITE ---

export default {
  async fetch(request, env) {
    // Get the visitor's IP address from the Cloudflare headers
    const clientIp = request.headers.get('CF-Connecting-IP');

    // Call an external service to get location data
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,region`);
    const geoData = await geoResponse.json();

    // Check if the API call was successful and the region is California ('CA')
    if (geoData.status === 'success' && geoData.region === 'CA') {
      return new Response('Access from your region is not permitted. (External API Block)', {
        status: 403,
      });
    }
    
    // If they are not in CA, or the API fails, load the normal website
    return env.ASSETS.fetch(request);
  },
};
