export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  // Values sent from browser
  const page = req.query.page || "/";
  const referrer = req.query.ref || "Direct";
  const visitTime = req.query.time || new Date().toISOString();
  const clientTimezone = req.query.tz || null;

  try {
    // 🌍 Geo lookup
    const geoRes = await fetch(`https://ipwho.is/${ip}`);
    const geo = await geoRes.json();

    const country = geo.country || null;
    const region = geo.region || null;
    const city = geo.city || null;
    const isp = geo.connection?.isp || null;
    const latitude = geo.latitude || null;
    const longitude = geo.longitude || null;

    // 🖥 OS detection
    const os = userAgent.includes("Android") ? "Android"
      : userAgent.includes("Windows") ? "Windows"
      : userAgent.includes("iPhone") || userAgent.includes("iOS") ? "iOS"
      : userAgent.includes("Mac") ? "Mac"
      : "Other";

    // 📦 Final data object
    const data = {
      ip,
      country,
      region,
      city,
      timezone: clientTimezone,
      isp,
      latitude,
      longitude,
      os,
      referrer,
      page,
      created_at: visitTime
    };

    // 💾 Save to Supabase
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
