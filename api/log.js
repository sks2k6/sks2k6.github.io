export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";
  const referrer = req.headers["referer"] || "Direct";
  const page = req.query.page || "/";
  const time = new Date().toISOString();

  try {
    // 🌍 Get geo + ISP data
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoRes.json();

    const data = {
      ip,
      country: geo.country_name,
      region: geo.region,
      city: geo.city,
      timezone: geo.timezone,
      isp: geo.org,
      latitude: geo.latitude,
      longitude: geo.longitude,
      os: userAgent.includes("Android") ? "Android"
         : userAgent.includes("Windows") ? "Windows"
         : userAgent.includes("iPhone") ? "iOS"
         : "Other",
      referrer,
      page
    };

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
 _toggle;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
