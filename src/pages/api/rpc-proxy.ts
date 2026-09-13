import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = req.query.target as string;

  if (!target) {
    return res.status(400).json({ error: "Missing target parameter" });
  }

  if (!target.startsWith("http://")) {
    return res.status(400).json({ error: "Proxy is only for HTTP endpoints" });
  }

  try {
    const response = await fetch(target, {
      method: req.method || "POST",
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: "Failed to reach target endpoint" });
  }
}
