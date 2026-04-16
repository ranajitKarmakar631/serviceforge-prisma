import logger from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";
/**
 * 🛠️ BaseService
 * Provides common CRUD operations for all services.
 * @template T - The model type
 */
export class BaseService {
    constructor(db, modelName) {
        this.db = db;
        this.modelName = modelName;
        this.model = this.db[modelName];
        if (!this.model) {
            logger.error(`Model ${modelName} not found in Prisma Client`);
            throw new AppError(`Model ${modelName} not found`, 500);
        }
    }
    /**
     * Create a new record
     */
    async create(data) {
        try {
            logger.info(`Creating ${this.modelName} record`);
            return await this.model.create({ data });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error creating ${this.modelName}: ${message}`);
            throw error;
        }
    }
    /**
     * Find a record by its ID
     */
    async findById(id) {
        try {
            return await this.model.findUnique({ where: { id } });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error finding ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }
    /**
     * Update a record by its ID
     */
    async updateById(id, data) {
        try {
            logger.info(`Updating ${this.modelName} ID: ${id}`);
            return await this.model.update({ where: { id }, data });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error updating ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }
    /**
     * Update records based on a query
     */
    async update(query, data) {
        try {
            return await this.model.updateMany({ where: query, data });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error updating ${this.modelName} with query: ${message}`);
            throw error;
        }
    }
    /**
     * Delete a record by ID
     */
    async deleteById(id) {
        try {
            logger.info(`Deleting ${this.modelName} ID: ${id}`);
            return await this.model.delete({ where: { id } });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error deleting ${this.modelName} by ID: ${message}`);
            throw error;
        }
    }
    /**
     * Find many records with optional query parameters
     */
    async findMany(query = {}) {
        try {
            return await this.model.findMany(query);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} findMany: ${message}`);
            throw error;
        }
    }
    /**
     * Find the first record matching the query
     */
    async findFirst(query = {}) {
        try {
            return await this.model.findFirst(query);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} findFirst: ${message}`);
            throw error;
        }
    }
    /**
     * Count records matching the query
     */
    async count(query = {}) {
        try {
            return await this.model.count({ where: query });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in ${this.modelName} count: ${message}`);
            throw error;
        }
    }
    /**
     * List records with pagination, sorting, and advanced filtering
     */
    async list(options = {}, preFilter = {}) {
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", filters = [], search = "", searchFields = ["id"], include, select, } = options;
        if (include && select) {
            throw new AppError("Cannot use both include and select together", 400);
        }
        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const skip = (safePage - 1) * safeLimit;
        const where = { ...preFilter };
        const andConditions = [];
        // Handle text search
        if (search && searchFields.length > 0) {
            const searchConditions = searchFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            }));
            andConditions.push({ OR: searchConditions });
        }
        // Handle specific filters
        filters.forEach((filter) => {
            const key = Object.keys(filter)[0];
            const value = filter[key];
            if (!key || value === undefined)
                return;
            if (typeof value === "string") {
                andConditions.push({
                    [key]: {
                        contains: value,
                        mode: "insensitive",
                    },
                });
            }
            else if (value?.min !== undefined || value?.max !== undefined) {
                where[key] = {
                    ...(value.min !== undefined && { gte: value.min }),
                    ...(value.max !== undefined && { lte: value.max }),
                };
            }
            else if (value?.from || value?.to) {
                where[key] = {
                    ...(value.from && { gte: new Date(value.from) }),
                    ...(value.to && { lte: new Date(value.to) }),
                };
            }
            else {
                where[key] = value;
            }
        });
        if (andConditions.length) {
            where.AND = andConditions;
        }
        const queryOptions = {
            where,
            skip,
            take: safeLimit,
            orderBy: {
                [sortBy]: order,
            },
        };
        if (include)
            queryOptions.include = include;
        if (select)
            queryOptions.select = select;
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
        }
        catch (error) {
            logger.error(`Error in ${this.modelName} list: ${error.message}`);
            throw error;
        }
    }
    /**
     * Create multiple records at once (High Performance)
     */
    async createMany(data) {
        try {
            if (!this.model.createMany) {
                throw new AppError(`createMany NOT supported for model ${this.modelName}`, 400);
            }
            logger.info(`Bulk creating ${data.length} ${this.modelName} records`);
            return await this.model.createMany({ data });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk creating ${this.modelName}: ${message}`);
            throw error;
        }
    }
    /**
     * Update multiple records matching a query
     */
    async updateMany(query, data) {
        try {
            logger.info(`Bulk updating ${this.modelName} records`);
            return await this.model.updateMany({ where: query, data });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk updating ${this.modelName}: ${message}`);
            throw error;
        }
    }
    /**
     * Delete multiple records matching a query
     */
    async deleteMany(query) {
        try {
            logger.info(`Bulk deleting ${this.modelName} records`);
            return await this.model.deleteMany({ where: query });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Error in bulk deleting ${this.modelName}: ${message}`);
            throw error;
        }
    }
}
//# sourceMappingURL=BaseService.js.map