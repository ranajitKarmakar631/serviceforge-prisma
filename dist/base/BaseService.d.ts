/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { PrismaClient } from "@prisma/client";
/**
 * 🛠️ BaseService
 * Provides common CRUD operations for all services.
 * @template T - The model type
 */
export declare class BaseService<T extends Record<string, any>> {
    protected db: PrismaClient;
    protected modelName: string;
    protected model: any;
    constructor(db: PrismaClient, modelName: string);
    /**
     * Create a new record
     */
    create(data: Partial<T>): Promise<T>;
    /**
     * Find a record by its ID
     */
    findById(id: string | number): Promise<T | null>;
    /**
     * Update a record by its ID
     */
    updateById(id: string | number, data: Partial<T>): Promise<T>;
    /**
     * Update records based on a query
     */
    update(query: any, data: Partial<T>): Promise<any>;
    /**
     * Delete a record by ID
     */
    deleteById(id: string | number): Promise<T>;
    /**
     * Find many records with optional query parameters
     */
    findMany(query?: any): Promise<T[]>;
    /**
     * Find the first record matching the query
     */
    findFirst(query?: any): Promise<T | null>;
    /**
     * Count records matching the query
     */
    count(query?: any): Promise<number>;
    /**
     * List records with pagination, sorting, and advanced filtering
     */
    list(options?: any, preFilter?: Record<string, any>): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    /**
     * Create multiple records at once (High Performance)
     */
    createMany(data: Partial<T>[]): Promise<{
        count: number;
    }>;
    /**
     * Update multiple records matching a query
     */
    updateMany(query: any, data: Partial<T>): Promise<{
        count: number;
    }>;
    /**
     * Delete multiple records matching a query
     */
    deleteMany(query: any): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=BaseService.d.ts.map