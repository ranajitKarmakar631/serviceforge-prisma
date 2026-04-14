/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ApiResponse, catchAsync } from "../utils/index.js";
/**
 * 🏛️ BaseController
 * Provides standard CRUD handlers for all modules.
 * Optimized with catchAsync to eliminate try-catch boilerplate.
 * @template T - The entity type
 */
export class BaseController {
    constructor(service, entityName) {
        this.service = service;
        this.entityName = entityName;
        /**
         * Create a new record
         */
        this.handleCreate = catchAsync(async (req, res) => {
            const result = await this.service.create(req.body);
            return ApiResponse.success(res, `${this.entityName} created successfully`, result, 201);
        });
        /**
         * Find a record by ID
         */
        this.handleFindById = catchAsync(async (req, res) => {
            const result = await this.service.findById(req.params.id);
            return ApiResponse.success(res, `${this.entityName} found successfully`, result, 200);
        });
        /**
         * Update a record by ID
         */
        this.handleUpdateById = catchAsync(async (req, res) => {
            const result = await this.service.updateById(req.params.id, req.body);
            return ApiResponse.success(res, `${this.entityName} updated successfully`, result, 200);
        });
        /**
         * Update records based on filter
         */
        this.handleUpdate = catchAsync(async (req, res) => {
            const { filter, data } = req.body;
            const result = await this.service.update(filter, data);
            return ApiResponse.success(res, `${this.entityName} updated successfully`, result, 200);
        });
        /**
         * Delete a record by ID
         */
        this.handleDeleteById = catchAsync(async (req, res) => {
            const result = await this.service.deleteById(req.params.id);
            return ApiResponse.success(res, `${this.entityName} deleted successfully`, result, 200);
        });
        /**
         * Find many records
         */
        this.handleFindMany = catchAsync(async (req, res) => {
            const result = await this.service.findMany(req.body);
            return ApiResponse.success(res, `${this.entityName} found successfully`, result, 200);
        });
        /**
         * Find first record matching query
         */
        this.handleFindFirst = catchAsync(async (req, res) => {
            const result = await this.service.findFirst(req.body);
            return ApiResponse.success(res, `${this.entityName} found successfully`, result, 200);
        });
        /**
         * Count records
         */
        this.handleCount = catchAsync(async (req, res) => {
            const result = await this.service.count(req.body);
            return ApiResponse.success(res, `${this.entityName} count retrieved successfully`, result, 200);
        });
        /**
         * List records with pagination and filtering
         */
        this.handleList = catchAsync(async (req, res) => {
            const options = req.body;
            const preFilter = {};
            // Standard industrial multi-tenancy check
            if (req.user?.tenantId) {
                preFilter.tenantId = req.user.tenantId;
            }
            // Standard soft-delete check if applicable
            preFilter.isDeleted = false;
            const result = await this.service.list(options, preFilter);
            return ApiResponse.success(res, `${this.entityName} list fetched successfully`, result);
        });
        /**
         * Bulk Create Records
         */
        this.handleCreateMany = catchAsync(async (req, res) => {
            const result = await this.service.createMany(req.body);
            return ApiResponse.success(res, `${this.entityName} bulk records created successfully`, result, 201);
        });
        /**
         * Bulk Update Records based on filter
         */
        this.handleUpdateMany = catchAsync(async (req, res) => {
            const { filter, data } = req.body;
            const result = await this.service.updateMany(filter, data);
            return ApiResponse.success(res, `${this.entityName} bulk records updated successfully`, result, 200);
        });
        /**
         * Bulk Delete Records based on filter
         */
        this.handleDeleteMany = catchAsync(async (req, res) => {
            const result = await this.service.deleteMany(req.body);
            return ApiResponse.success(res, `${this.entityName} bulk records deleted successfully`, result, 200);
        });
    }
}
//# sourceMappingURL=BaseController.js.map