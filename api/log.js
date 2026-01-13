export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const ua = req.headers["user-agent"] || "";

  const page = req.query.page || "/";
  const referrer = req.query.ref || "Direct";
  const created_at = req.query.time || new Date().toISOString();

  const data = {
    ip,
    page,
    referrer,
    created_at,
    timezone: req.query.tz || null,
    language: req.query.lang || null,
    screen: req.query.screen || null,
    viewport: req.query.viewport || null,
    pixel_ratio: req.query.pixelRatio || null,
    memory_gb: req.query.memory || null,
    cpu_cores: req.query.cores || null,
    connection: req.query.connection || null,
    user_agent: ua
  };

  try {
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
