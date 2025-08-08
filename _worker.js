// This code goes inside your _worker.js file

export default {
  async fetch(request, env) {
    // Get the visitor's location data from Cloudflare's request object
    const locationData = request.cf;

    // The two-letter ISO code for the state/region. For California, this is 'CA'.
    const stateCode = locationData.subdivision_1_iso_code;

    // Check if the visitor's state code is 'CA'
    if (stateCode === 'CA') {
      // If they are in California, show them a "Forbidden" message and stop.
      return new Response('Access from your region is not permitted.', {
        status: 403, // 403 Forbidden is the appropriate HTTP status code
      });
    }

    // If the visitor is NOT from California, proceed to load the normal website.
    // This line fetches the assets (your index.html, css, etc.) from your Pages project.
    return env.ASSETS.fetch(request);
  },
};