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
  private static instance: PrismaClient | null = null;

  private constructor() {}

  /**
   * Get the singleton PrismaClient instance.
   * @returns The PrismaClient instance.
   */
  public static getInstance(): PrismaClient {
    if (!PrismaClientManager.instance) {
      PrismaClientManager.instance = new PrismaClient({
        log: [
          { emit: "event", level: "query" },
          { emit: "event", level: "error" },
          { emit: "event", level: "info" },
          { emit: "event", level: "warn" },
        ],
      });
      (PrismaClientManager.instance as any).$on("query", (e: any) => {
        logger.debug(`Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`);
      });

      (PrismaClientManager.instance as any).$on("error", (e: any) => {
        logger.error(`Prisma Error: ${e.message}`);
      });

      logger.info("🚀 Prisma Client initialized");
    }

    return PrismaClientManager.instance;
  }

  /**
   * Gracefully disconnect from the database.
   */
  public static async disconnect(): Promise<void> {
    if (PrismaClientManager.instance) {
      await PrismaClientManager.instance.$disconnect();
      PrismaClientManager.instance = null;
      logger.info("🔌 Prisma Client disconnected");
    }
  }
}

// Shortcut export for easier usage
export const db = PrismaClientManager.getInstance();
