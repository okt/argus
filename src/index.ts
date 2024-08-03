import { serve } from 'bun';
import { insertStats, getStats } from './db';
import { statsSchema } from './schema';
import chalk from 'chalk';

function logRequest(req: Request) {
  const timestamp = new Date().toISOString();
  console.log(chalk.green(`\n[${timestamp}] ${req.method} ${req.url}`));
}

const server = serve({
  port: 3000,
  development: true,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    logRequest(req);

    try {
      console.warn(req.url);
      if (req.method === "GET" && path === "/") {
        try {
          return new Response(Bun.file("public/index.html"));
        } catch (fileError: unknown) {
          if (fileError instanceof Error) console.error("Failed to read index.html: ", fileError.message);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      if (req.method === "GET" && path === "/api/stats") {
        const rows = getStats();
        return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
      }

      if (req.method === "POST" && path === "/api/stats") {
        const stats = await req.json();
        const result = statsSchema.safeParse(stats);
        
        console.log(chalk.yellow.bold(`\nPayload data:`));
        console.log(result);
        if (result.success) {
          insertStats(result.data);
          return new Response("OK");
        } else {
          console.error("Invalid data received", result.error);
          return new Response("Invalid data", { status: 400 });
        }
      }
      console.warn("Resource not found")
      return new Response("Not Found", { status: 404 });
    } catch (error: unknown) {
      if (error instanceof Error) console.error("Error occurred: ", error.message);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});

console.log(chalk.yellow.bold("\n═════════════════════════════════════════════════════════"));
console.log(chalk.bold(`The server is listening on ${server.url}`));