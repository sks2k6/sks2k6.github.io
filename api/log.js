export default function handler(req, res) {
  if (!globalThis.visitors) {
    globalThis.visitors = [];
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const time = new Date().toLocaleString();

  globalThis.visitors.push({ ip, time });

  res.status(200).json({ success: true });
}
