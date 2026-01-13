export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  try {
    // Get IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    // Get user agent
    const userAgent = req.headers["user-agent"] || "unknown";

    // Timestamp
    const created_at = new Date().toISOString();

    // Optional: basic geo lookup (city + region)
    let city = null;
    let region = null;

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geo = await geoRes.json();
      city = geo.city || null;
      region = geo.region || null;
    } catch {
      // ignore geo errors safely
    }

    // Data matches your Supabase columns
    const data = {
      ip,
      user_agent: userAgent,
      created_at,
      city,
      region
    };

    // Insert into Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(data)
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
