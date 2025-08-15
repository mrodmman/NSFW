export default {
  async fetch(request, env) {
    // --- Step 1: Check Kill Switch ---
    console.log("BLOCKING_MODE:", env.BLOCKING_MODE);

    if (env.BLOCKING_MODE === 'off') {
      console.log("Kill switch is OFF — allowing all traffic.");
      return env.ASSETS.fetch(request);
    }

    console.log("Kill switch is ON — running blocking checks...");

    // --- Step 2: Cloudflare native geo lookup ---
    const nativeStateCode = request.cf?.subdivision_1_iso_code;
    console.log("Cloudflare detected state:", nativeStateCode);

    if (nativeStateCode === 'CA') {
      console.log("Blocked by Cloudflare native detection (CA).");
      return new Response('Access from your region is not permitted. (Native)', { status: 403 });
    }

    // --- Step 3: External API lookup ---
    const clientIp = request.headers.get('CF-Connecting-IP');
    console.log("Client IP:", clientIp);

    if (clientIp) {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,region`);
        const geoData = await geoResponse.json();
        console.log("ip-api.com response:", geoData);

        if (geoData.status === 'success' && geoData.region === 'CA') {
          console.log("Blocked by ip-api.com detection (CA).");
          return new Response('Access from your region is not permitted. (API)', { status: 403 });
        }
      } catch (error) {
        console.error("External GeoIP API failed:", error);
      }
    }

    // --- Step 4: If not blocked, allow through ---
    console.log("No blocking conditions met — allowing access.");
    return env.ASSETS.fetch(request);
  },
};
