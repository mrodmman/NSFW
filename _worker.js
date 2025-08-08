// --- The Real Blocking Code ---
export default {
  async fetch(request, env) {
    const locationData = request.cf;
    const stateCode = locationData.subdivision_1_iso_code;

    // Check if the visitor's state code is 'CA'
    if (stateCode === 'CA') {
      // If they are in California, show them a "Forbidden" message.
      return new Response('Access from your region is not permitted.', {
        status: 403,
      });
    }

    // If not from California, load the website.
    return env.ASSETS.fetch(request);
  },
};
