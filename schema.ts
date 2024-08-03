import { z } from "zod";

export const statsSchema = z.object({
  hostname: z.string().default('test-host'),
  memory: z.string().default(''),
  uptime: z.string().default(''),
});

// SQL schema definition
export const statsTableSchema = `
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY,
    hostname TEXT,
    memory TEXT,
    uptime TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;