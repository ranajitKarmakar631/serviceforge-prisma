/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { PrismaClient } from "@prisma/client";
/**
 * 🏢 PrismaClientManager
 * A singleton class to manage the Prisma Client instance.
 * Ensures consistent connection pooling and query logging across the microservice.
 */
export declare class PrismaClientManager {
    private static instance;
    private constructor();
    /**
     * Get the singleton PrismaClient instance.
     * @returns The PrismaClient instance.
     */
    static getInstance(): PrismaClient;
    /**
     * Gracefully disconnect from the database.
     */
    static disconnect(): Promise<void>;
}
export declare const db: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
//# sourceMappingURL=PrismaClientManager.d.ts.map