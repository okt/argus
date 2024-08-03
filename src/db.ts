import chalk from 'chalk';
import { Database } from 'bun:sqlite';
import { statsTableSchema, statsSchema } from './schema';

const db = new Database("stats.db");
db.run(statsTableSchema);

const statsKeys = Object.keys(statsSchema.shape);
const insertQuery = `INSERT INTO stats (${statsKeys.join(", ")}) VALUES (${statsKeys.map(() => "?").join(", ")})`;


export function insertStats(stats: Record<string, any>) {
  const values = statsKeys.map(key => stats[key]);
  // console.log(chalk.cyan.bold("\n▆▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗▗"));
  console.log(chalk.bgGreen.bold(`LOGGING TO DATABASE             ...OK`));

  db.run(insertQuery, ...values);
}

export function getStats() {
  return db.query("SELECT * FROM stats ORDER BY timestamp DESC").all();
}