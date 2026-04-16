import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";

/**
 * 🏢 PrismaModelDelegate
 * Generic interface for Prisma model delegates to ensure type safety without 'any'.
 */
export interface PrismaModelDelegate<T> {
    create(args: { data: Partial<T> }): Promise<T>;
    findUnique(args: { where: any }): Promise<T | null>;
    findFirst(args?: any): Promise<T | null>;
    findMany(args?: any): Promise<T[]>;
    update(args: { where: any; data: Partial<T> }): Promise<T>;
    updateMany(args: { where: any; data: Partial<T> }): Promise<{ count: number }>;
    delete(args: { where: any }): Promise<T>;
    deleteMany(args: { where: any }): Promise<{ count: number }>;
    count(args?: any): Promise<number>;
    createMany?(args: { data: Partial<T>[] }): Promise<{ count: number }>;
}

/**
 * 🛠️ BaseService
 * Provides common CRUD operations for all services.
 * @template T - The model type
 */
export class BaseService<T extends Record<string, any>> {
    protected model: PrismaModelDelegate<T>;

    constructor(
        protected db: PrismaClient,
        protected modelName: string
    ) {
        this.model = (this.db as any)[modelName] as PrismaModelDelegate<T>;

        if (!this.model) {
            logger.error(`Model ${modelName} not found in Prisma Client`);
            throw new AppError(`Model ${modelName} not found`, 500);
        }
    }

    /**
     * Create a new record
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            logger.info(`Creating ${this.modelName} record`);
            return await this.model.create({ data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error creating ${this.modelName}: ${message}`);
            throw error;
        }
    }

    /**
     * Find a record by its ID
     */
    async findById(id: string | number): Promise<T | null> {
        try {
            return await this.model.findUnique({ where: { id } });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error finding ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }

    /**
     * Update a record by its ID
     */
    async updateById(id: string | number, data: Partial<T>): Promise<T> {
        try {
            logger.info(`Updating ${this.modelName} ID: ${id}`);
            return await this.model.update({ where: { id }, data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error updating ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }

    /**
     * Update records based on a query
     */
    async update(query: Record<string, any>, data: Partial<T>): Promise<{ count: number }> {
        try {
            return await this.model.updateMany({ where: query, data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error updating ${this.modelName} with query: ${message}`);
            throw error;
        }
    }

    /**
     * Delete a record by ID
     */
    async deleteById(id: string | number): Promise<T> {
        try {
            logger.info(`Deleting ${this.modelName} ID: ${id}`);
            return await this.model.delete({ where: { id } });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error deleting ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }

    /**
     * Find many records with optional query parameters
     */
    async findMany(query: Record<string, any> = {}): Promise<T[]> {
        try {
            return await this.model.findMany(query);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} findMany: ${message}`);
            throw error;
        }
    }

    /**
     * Find the first record matching the query
     */
    async findFirst(query: Record<string, any> = {}): Promise<T | null> {
        try {
            return await this.model.findFirst(query);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} findFirst: ${message}`);
            throw error;
        }
    }

    /**
     * Count records matching the query
     */
    async count(query: Record<string, any> = {}): Promise<number> {
        try {
            return await this.model.count({ where: query });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} count: ${message}`);
            throw error;
        }
    }

    /**
     * List records with pagination, sorting, and advanced filtering
     */
    async list(options: any = {}, preFilter: Record<string, any> = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            filters = [],
            search = "",
            searchFields = ["id"],
            include,
            select,
        } = options;

        if (include && select) {
            throw new AppError("Cannot use both include and select together", 400);
        }

        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const skip = (safePage - 1) * safeLimit;

        const where: any = { ...preFilter };
        const andConditions: any[] = [];

        // Handle text search
        if (search && searchFields.length > 0) {
            const searchConditions = searchFields.map((field: string) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            }));
            andConditions.push({ OR: searchConditions });
        }

        // Handle specific filters
        filters.forEach((filter: any) => {
            const key = Object.keys(filter)[0];
            const value = filter[key];

            if (!key || value === undefined) return;

            if (typeof value === "string") {
                andConditions.push({
                    [key]: {
                        contains: value,
                        mode: "insensitive",
                    },
                });
            } else if (value?.min !== undefined || value?.max !== undefined) {
                where[key] = {
                    ...(value.min !== undefined && { gte: value.min }),
                    ...(value.max !== undefined && { lte: value.max }),
                };
            } else if (value?.from || value?.to) {
                where[key] = {
                    ...(value.from && { gte: new Date(value.from) }),
                    ...(value.to && { lte: new Date(value.to) }),
                };
            } else {
                where[key] = value;
            }
        });

        if (andConditions.length) {
            where.AND = andConditions;
        }

        const queryOptions: any = {
            where,
            skip,
            take: safeLimit,
            orderBy: {
                [sortBy]: order,
            },
        };

        if (include) queryOptions.include = include;
        if (select) queryOptions.select = select;

        try {
            const [data, total] = await Promise.all([
                this.model.findMany(queryOptions),
                this.model.count({ where }),
            ]);

            const totalPages = Math.ceil(total / safeLimit);

            return {
                data,
                meta: {
                    total,
                    page: safePage,
                    limit: safeLimit,
                    totalPages,
                    hasNextPage: safePage < totalPages,
                    hasPrevPage: safePage > 1,
                },
            };
        } catch (error: any) {
            logger.error(`Error in ${this.modelName} list: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create multiple records at once (High Performance)
     */
    async createMany(data: Partial<T>[]): Promise<{ count: number }> {
        try {
            if (!this.model.createMany) {
                throw new AppError(`createMany NOT supported for model ${this.modelName}`, 400);
            }
            logger.info(`Bulk creating ${data.length} ${this.modelName} records`);
            return await this.model.createMany({ data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk creating ${this.modelName}: ${message}`);
            throw error;
        }
    }

    /**
     * Update multiple records matching a query
     */
    async updateMany(query: Record<string, any>, data: Partial<T>): Promise<{ count: number }> {
        try {
            logger.info(`Bulk updating ${this.modelName} records`);
            return await this.model.updateMany({ where: query, data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk updating ${this.modelName}: ${message}`);
            throw error;
        }
    }

    /**
     * Delete multiple records matching a query
     */
    async deleteMany(query: Record<string, any>): Promise<{ count: number }> {
        try {
            logger.info(`Bulk deleting ${this.modelName} records`);
            return await this.model.deleteMany({ where: query });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk deleting ${this.modelName}: ${message}`);
            throw error;
        }
    }
}
