export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    const user_agent = req.headers["user-agent"] || "unknown";
    const created_at = new Date().toISOString();

    let city = null;
    let region = null;
    let country = null;

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geo = await geoRes.json();

      if (geo.success !== false) {
        city = geo.city || null;
        region = geo.region || null;
        country = geo.country || null;
      }
    } catch {}

    const data = {
      ip,
      user_agent,
      city,
      region,
      country,
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
