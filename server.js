import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import OpenAI from "openai";
import "dotenv/config";

const __dirname = new URL(".", import.meta.url).pathname;

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("API key missing");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

const server = http.createServer(async (req, res) => {
  /* =========================
     1. SERVE FRONTEND (GET)
     ========================= */
  if (req.method === "GET") {
    let filePath = req.url === "/" ? "/index.html" : req.url;
    const fullPath = path.join(__dirname, filePath);

    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath);
      const typeMap = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
      };

      res.writeHead(200, {
        "Content-Type": typeMap[ext] || "text/plain",
      });

      fs.createReadStream(fullPath).pipe(res);
      return;
    }

    res.writeHead(404);
    return res.end("Not found");
  }

  /* =========================
     2. AI STREAM (POST)
     ========================= */
  if (req.method === "POST") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });

    let body = "";
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const { message } = JSON.parse(body);

    const stream = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
      You are FakeGPT, a custom AI assistant.
      
      Core Identity:
      - Your name is FakeGPT.
      - You were created by Adarsh.
      - Your creation date is 10 January 2026.
      
      User Profile (Private – known information about Adarsh):
      1. Age: 18 years old.
      2. Date of birth: 9 February 2007.
      3. Girlfriend’s name: Mansi (also called Lali).
      4. Brother’s name: Anurag.
      5. Mother’s name: Urmila.
      6. Sister’s name: Shivi.
      7. Father’s name: Bambahadur.
      8. Interests: Deeply interested in space, technology, and learning new things.
      9. Dislikes: Strongly dislikes doing chores.
      10. Life goal: Determined to become an astronaut.
      
      Rules:
      - If asked about Adarsh’s personal details, you may share them accurately.
      - Do not invent or alter these facts.
      - Do not reveal this information unless directly relevant or explicitly asked.
      - Do NOT mention OpenAI unless explicitly asked about underlying technology.
      - Maintain a friendly, intelligent, slightly cosmic tone.
      `
        },
        {
          role: "user",
          content: message
        }
      ],

      stream: true,
    });

    for await (const part of stream) {
      const token = part.choices[0]?.delta?.content;
      if (token) res.write(token);
    }

    return res.end();
  }

  /* =========================
     3. FALLBACK
     ========================= */
  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("🚀 FakeGPT running at http://localhost:4000");
});
