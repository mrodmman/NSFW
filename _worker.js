// --- PERFORMANCE TEST CODE ---
// This version blocks TEXAS to let you experience the site speed with the API call.

export default {
  async fetch(request, env) {
    // Get the visitor's IP address from the Cloudflare headers
    const clientIp = request.headers.get('CF-Connecting-IP');

    // Call the external service to get location data.
    // THIS IS THE STEP THAT ADDS DELAY.
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,region`);
    const geoData = await geoResponse.json();

    // Check if the API call was successful and the region is Texas ('TX')
    if (geoData.status === 'success' && geoData.region === 'TX') {
      // This block will only run for visitors in Texas.
      return new Response('Access from your region (Texas) is not permitted.', {
        status: 403,
      });
    }
    
    // If you are not in Texas, or the API fails, it will load the normal website.
    // You will experience the delay from the 'await fetch' call above.
    return env.ASSETS.fetch(request);
  },
};
