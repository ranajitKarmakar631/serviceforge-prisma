import { PrismaClient } from "@prisma/client";
/**
 * 🏢 PrismaModelDelegate
 * Generic interface for Prisma model delegates to ensure type safety without 'any'.
 */
export interface PrismaModelDelegate<T> {
    create(args: {
        data: Partial<T>;
    }): Promise<T>;
    findUnique(args: {
        where: any;
    }): Promise<T | null>;
    findFirst(args?: any): Promise<T | null>;
    findMany(args?: any): Promise<T[]>;
    update(args: {
        where: any;
        data: Partial<T>;
    }): Promise<T>;
    updateMany(args: {
        where: any;
        data: Partial<T>;
    }): Promise<{
        count: number;
    }>;
    delete(args: {
        where: any;
    }): Promise<T>;
    deleteMany(args: {
        where: any;
    }): Promise<{
        count: number;
    }>;
    count(args?: any): Promise<number>;
    createMany?(args: {
        data: Partial<T>[];
    }): Promise<{
        count: number;
    }>;
}
/**
 * 🛠️ BaseService
 * Provides common CRUD operations for all services.
 * @template T - The model type
 */
export declare class BaseService<T extends Record<string, any>> {
    protected db: PrismaClient;
    protected modelName: string;
    protected model: PrismaModelDelegate<T>;
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
    update(query: Record<string, any>, data: Partial<T>): Promise<{
        count: number;
    }>;
    /**
     * Delete a record by ID
     */
    deleteById(id: string | number): Promise<T>;
    /**
     * Find many records with optional query parameters
     */
    findMany(query?: Record<string, any>): Promise<T[]>;
    /**
     * Find the first record matching the query
     */
    findFirst(query?: Record<string, any>): Promise<T | null>;
    /**
     * Count records matching the query
     */
    count(query?: Record<string, any>): Promise<number>;
    /**
     * List records with pagination, sorting, and advanced filtering
     */
    list(options?: any, preFilter?: Record<string, any>): Promise<{
        data: T[];
        meta: {
            total: number;
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
    updateMany(query: Record<string, any>, data: Partial<T>): Promise<{
        count: number;
    }>;
    /**
     * Delete multiple records matching a query
     */
    deleteMany(query: Record<string, any>): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=BaseService.d.ts.map