let visitors = [];

export default function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const time = new Date().toLocaleString();

  visitors.push({ ip, time });

  res.status(200).json({ success: true });
}
