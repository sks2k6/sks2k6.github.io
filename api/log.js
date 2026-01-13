export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    const user_agent = req.headers["user-agent"] || "unknown";
    const referrer = req.query.ref || "Direct";
    const timezone = req.query.tz || "UTC";
    const created_at = new Date().toISOString();

    let city = null;
    let region = null;
    let country = null;
    let isp = null;

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geo = await geoRes.json();

      if (geo.success !== false) {
        city = geo.city || null;
        region = geo.region || null;
        country = geo.country || null;
        isp = geo.connection?.isp || null;
      }
    } catch {}

    let device = "Unknown";
    if (/Android/.test(user_agent)) device = "Android";
    else if (/iPhone/.test(user_agent)) device = "iPhone";
    else if (/Windows/.test(user_agent)) device = "Windows PC";
    else if (/Mac/.test(user_agent)) device = "Mac";
    else if (/Linux/.test(user_agent)) device = "Linux";

    const data = {
      ip,
      city,
      region,
      country,
      isp,
      device,
      user_agent,
      referrer,
      timezone,
      created_at
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
