/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { BaseService } from "./BaseService.js";
import { Request, Response } from "express";
/**
 * 🏛️ BaseController
 * Provides standard CRUD handlers for all modules.
 * Optimized with catchAsync to eliminate try-catch boilerplate.
 * @template T - The entity type
 */
export declare class BaseController<T extends Record<string, any>> {
    protected service: BaseService<T>;
    protected entityName: string;
    constructor(service: BaseService<T>, entityName: string);
    /**
     * Create a new record
     */
    handleCreate: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find a record by ID
     */
    handleFindById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update a record by ID
     */
    handleUpdateById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update records based on filter
     */
    handleUpdate: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Delete a record by ID
     */
    handleDeleteById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find many records
     */
    handleFindMany: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find first record matching query
     */
    handleFindFirst: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Count records
     */
    handleCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * List records with pagination and filtering
     */
    handleList: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Create Records
     */
    handleCreateMany: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Update Records based on filter
     */
    handleUpdateMany: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Delete Records based on filter
     */
    handleDeleteMany: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=BaseController.d.ts.map