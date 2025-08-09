// --- FINAL CODE WITH KILL SWITCH ---
// This version can be turned on/off from the Cloudflare dashboard.

export default {
  async fetch(request, env) {
    // --- Step 1: Check for the Kill Switch ---
    // Reads an environment variable named BLOCKING_MODE from your dashboard.
    // If the variable is set to 'off', skip all blocking and load the site.
    if (env.BLOCKING_MODE === 'off') {
      return env.ASSETS.fetch(request);
    }

    // --- Step 2: If the switch is on, proceed with the hybrid blocking logic ---
    const nativeStateCode = request.cf?.subdivision_1_iso_code;

    if (nativeStateCode === 'CA') {
      return new Response('Access from your region is not permitted. (Native)', {
        status: 403,
      });
    }

    const clientIp = request.headers.get('CF-Connecting-IP');

    if (clientIp) {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,region`);
        const geoData = await geoResponse.json();

        if (geoData.status === 'success' && geoData.region === 'CA') {
          return new Response('Access from your region is not permitted. (API)', {
            status: 403,
          });
        }
      } catch (error) {
        console.error("External GeoIP API failed:", error);
      }
    }

    // --- Step 3: If not blocked, let the user through. ---
    return env.ASSETS.fetch(request);
  },
};
