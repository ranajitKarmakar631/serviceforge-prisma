/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger.js";
/**
 * 🏢 PrismaClientManager
 * A singleton class to manage the Prisma Client instance.
 * Ensures consistent connection pooling and query logging across the microservice.
 */
export class PrismaClientManager {
    constructor() { }
    /**
     * Get the singleton PrismaClient instance.
     * @returns The PrismaClient instance.
     */
    static getInstance() {
        if (!PrismaClientManager.instance) {
            PrismaClientManager.instance = new PrismaClient({
                log: [
                    { emit: "event", level: "query" },
                    { emit: "event", level: "error" },
                    { emit: "event", level: "info" },
                    { emit: "event", level: "warn" },
                ],
            });
            PrismaClientManager.instance.$on("query", (e) => {
                logger.debug(`Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`);
            });
            PrismaClientManager.instance.$on("error", (e) => {
                logger.error(`Prisma Error: ${e.message}`);
            });
            logger.info("🚀 Prisma Client initialized");
        }
        return PrismaClientManager.instance;
    }
    /**
     * Gracefully disconnect from the database.
     */
    static async disconnect() {
        if (PrismaClientManager.instance) {
            await PrismaClientManager.instance.$disconnect();
            PrismaClientManager.instance = null;
            logger.info("🔌 Prisma Client disconnected");
        }
    }
}
PrismaClientManager.instance = null;
// Shortcut export for easier usage
export const db = PrismaClientManager.getInstance();
//# sourceMappingURL=PrismaClientManager.js.map