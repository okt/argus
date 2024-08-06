import chalk from "chalk";
import os from "os";
import type { z } from "zod";
import { statsSchema } from "./schema";

type Stats = z.infer<typeof statsSchema>;

function getStats(): Stats {
	const defaultValues = statsSchema.parse({});
	const keys = Object.keys(defaultValues);
	const stats: { [key: string]: any } = {};

	// Initialize stats with default values
	keys.forEach((key) => {
		stats[key as keyof Stats] = defaultValues[key as keyof Stats];
	});

	try {
		// Setup uptime string
		let ut_sec = os.uptime();
		let ut_min = ut_sec / 60;
		let ut_hour = ut_min / 60;

		ut_sec = Math.floor(ut_sec);
		ut_min = Math.floor(ut_min);
		ut_hour = Math.floor(ut_hour);

		ut_hour = ut_hour % 60;
		ut_min = ut_min % 60;
		ut_sec = ut_sec % 60;

		stats.uptime =
			"Up time: " +
			ut_hour +
			" Hour(s) " +
			ut_min +
			" minute(s) and " +
			ut_sec +
			" second(s)";

		// Get memory usage as percentage
		const mem_percent = Number(
			(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(0),
		);
		stats.memory = mem_percent.toString() + "%";

		// Hostname
		stats.hostname = os.hostname();
	} catch (error: unknown) {
		if (error instanceof Error)
			console.error("Failed to get stats: " + error.message);
	}

	const parsedStats = statsSchema.parse(stats);
	// console.log(parsedStats);
	return parsedStats;
}

async function sendStats() {
	const stats: Stats = getStats();
	const serverIp: string | undefined = process.env.SERVER_IP || "localhost";
	const serverPort: string | undefined = process.env.SERVER_PORT || "3000";

	console.log(`${chalk.yellow("Connecting to:")} ${serverIp}:${serverPort}`);

	if (!serverIp || !serverPort) {
		console.error("Server IP or port is not defined in environment variables.");
		return;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

	try {
		const response = await fetch(`http://${serverIp}:${serverPort}/api/stats`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(stats),
			signal: controller.signal,
		});
		clearTimeout(timeoutId);

		if (response.ok) {
			console.log(`Server responded with: ${chalk.bold("200 OK")}`);
			console.log(stats);
		} else {
			console.error(`Server responded with status: ${response.status}`);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				console.error("Request timed out");
			} else {
				console.error(`Error occurred: ${error.message}`);
			}
		}
	} finally {
		process.exit();
	}
}
// console.log(chalk.yellow.bold("\n═════════════════════════════════════════════════════════"));
console.log(chalk.bold("Starting stats collection..."));
sendStats();
