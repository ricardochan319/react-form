// pages/api/writeUrls.ts

import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "components", "urls.ts");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, url } = req.body;
    const data = `export const urls = [\n  { url: "${url}", title: "${title}", seeded: "false", loading: "false" }\n];\n`;

    try {
      fs.writeFileSync(filePath, data);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error writing to file:", error);
      res.status(500).json({ error: "Failed to write to file" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
