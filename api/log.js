export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  const page = req.query.page || "/";
  const referrer = req.query.ref || "Direct";
  const visitTime = req.query.time || new Date().toISOString();
  const clientTimezone = req.query.tz || null;

  try {
    // ============ GEO LOOKUP ============
    let geo = null;

    // Try ipwho.is first
    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geoData = await geoRes.json();
      if (geoData.success !== false) geo = geoData;
    } catch {}

    // Fallback to ipinfo.io if ipwho fails
    if (!geo) {
      const res2 = await fetch(`https://ipinfo.io/${ip}/json`);
      const data2 = await res2.json();
      geo = {
        country: data2.country,
        region: data2.region,
        city: data2.city,
        connection: { isp: data2.org },
        loc: data2.loc
      };
    }

    const country = geo?.country || null;
    const region = geo?.region || null;
    const city = geo?.city || null;
    const isp = geo?.connection?.isp || null;

    let latitude = null;
    let longitude = null;

    if (geo?.latitude && geo?.longitude) {
      latitude = geo.latitude;
      longitude = geo.longitude;
    } else if (geo?.loc) {
      const [lat, lon] = geo.loc.split(",");
      latitude = lat;
      longitude = lon;
    }

    // ============ DEVICE + OS ============
    const os =
      userAgent.includes("Android") ? "Android" :
      userAgent.includes("Windows") ? "Windows" :
      userAgent.includes("iPhone") || userAgent.includes("iOS") ? "iOS" :
      userAgent.includes("Mac") ? "Mac" :
      "Other";

    const device =
      /mobile/i.test(userAgent) ? "Mobile" :
      /tablet/i.test(userAgent) ? "Tablet" :
      "Desktop";

    const browser =
      userAgent.includes("Chrome") ? "Chrome" :
      userAgent.includes("Firefox") ? "Firefox" :
      userAgent.includes("Safari") ? "Safari" :
      userAgent.includes("Edge") ? "Edge" :
      "Other";

    // ============ FINAL DATA ============
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
      device,
      browser,
      referrer,
      page,
      created_at: visitTime
    };

    // ============ SAVE TO SUPABASE ============
    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(data)
    });

    res.status(200).json({ success: true, data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
