/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { BaseService } from "./BaseService.js";
import { Response } from "express";
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
    handleCreate: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find a record by ID
     */
    handleFindById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update a record by ID
     */
    handleUpdateById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update records based on filter
     */
    handleUpdate: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Delete a record by ID
     */
    handleDeleteById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find many records
     */
    handleFindMany: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Find first record matching query
     */
    handleFindFirst: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Count records
     */
    handleCount: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * List records with pagination and filtering
     */
    handleList: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Create Records
     */
    handleCreateMany: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Update Records based on filter
     */
    handleUpdateMany: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Bulk Delete Records based on filter
     */
    handleDeleteMany: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=BaseController.d.ts.map