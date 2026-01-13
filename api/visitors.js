export default async function handler(req, res) {
  const SUPABASE_URL = "https://kjyzjgxusouthqxrebdt.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sUEv6TQ39NRzaafzTPGpMQ_zufoSyMX";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/visitors?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Visitors API error:", err);
    return res.status(500).json({ error: err.message });
  }
}
