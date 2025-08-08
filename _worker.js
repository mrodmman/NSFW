// --- TEMPORARY DEBUG CODE ---
export default {
  async fetch(request) {
    const cf = request.cf;
    const responseText = `DEBUG INFO:\nYour Country: ${cf.country}\nYour State Code: ${cf.subdivision_1_iso_code}`;
    return new Response(responseText, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
