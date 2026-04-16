/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ApiResponse, catchAsync } from "../utils/index.js";
import { BaseService } from "./BaseService.js";
import { Response } from "express";
import { AuthenticatedRequest, RequestWithBody } from "../types.js";

/**
 * 🏛️ BaseController
 * Provides standard CRUD handlers for all modules.
 * Optimized with catchAsync to eliminate try-catch boilerplate.
 * @template T - The entity type
 */
export class BaseController<T extends Record<string, any>> {
  constructor(
    protected service: BaseService<T>,
    protected entityName: string
  ) {}

  /**
   * Create a new record
   */
  handleCreate = catchAsync(async (req: RequestWithBody<Partial<T>>, res: Response) => {
    const result = await this.service.create(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} created successfully`,
      result,
      201
    );
  });

  /**
   * Find a record by ID
   */
  handleFindById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.service.findById(req.params.id as string);
    return ApiResponse.success(
      res,
      `${this.entityName} found successfully`,
      result,
      200
    );
  });

  /**
   * Update a record by ID
   */
  handleUpdateById = catchAsync(async (req: RequestWithBody<Partial<T>>, res: Response) => {
    const result = await this.service.updateById(req.params.id as string, req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} updated successfully`,
      result,
      200
    );
  });

  /**
   * Update records based on filter
   */
  handleUpdate = catchAsync(async (req: RequestWithBody<{ filter: Record<string, any>; data: Partial<T> }>, res: Response) => {
    const { filter, data } = req.body;
    const result = await this.service.update(filter, data);
    return ApiResponse.success(
      res,
      `${this.entityName} updated successfully`,
      result,
      200
    );
  });

  /**
   * Delete a record by ID
   */
  handleDeleteById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.service.deleteById(req.params.id as string);
    return ApiResponse.success(
      res,
      `${this.entityName} deleted successfully`,
      result,
      200
    );
  });

  /**
   * Find many records
   */
  handleFindMany = catchAsync(async (req: RequestWithBody<Record<string, any>>, res: Response) => {
    const result = await this.service.findMany(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} found successfully`,
      result,
      200
    );
  });

  /**
   * Find first record matching query
   */
  handleFindFirst = catchAsync(async (req: RequestWithBody<Record<string, any>>, res: Response) => {
    const result = await this.service.findFirst(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} found successfully`,
      result,
      200
    );
  });

  /**
   * Count records
   */
  handleCount = catchAsync(async (req: RequestWithBody<Record<string, any>>, res: Response) => {
    const result = await this.service.count(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} count retrieved successfully`,
      result,
      200
    );
  });

  /**
   * List records with pagination and filtering
   */
  handleList = catchAsync(async (req: RequestWithBody<Record<string, any>>, res: Response) => {
    const options = req.body;
    const preFilter: Record<string, any> = {};

    // Standard industrial multi-tenancy check
    if (req.user?.tenantId) {
      preFilter.tenantId = req.user.tenantId;
    }

    // Standard soft-delete check if applicable
    preFilter.isDeleted = false;

    const result = await this.service.list(options, preFilter);

    return ApiResponse.success(
      res,
      `${this.entityName} list fetched successfully`,
      result
    );
  });

  /**
   * Bulk Create Records
   */
  handleCreateMany = catchAsync(async (req: RequestWithBody<Partial<T>[]>, res: Response) => {
    const result = await this.service.createMany(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} bulk records created successfully`,
      result,
      201
    );
  });

  /**
   * Bulk Update Records based on filter
   */
  handleUpdateMany = catchAsync(async (req: RequestWithBody<{ filter: Record<string, any>; data: Partial<T> }>, res: Response) => {
    const { filter, data } = req.body;
    const result = await this.service.updateMany(filter, data);
    return ApiResponse.success(
      res,
      `${this.entityName} bulk records updated successfully`,
      result,
      200
    );
  });

  /**
   * Bulk Delete Records based on filter
   */
  handleDeleteMany = catchAsync(async (req: RequestWithBody<Record<string, any>>, res: Response) => {
    const result = await this.service.deleteMany(req.body);
    return ApiResponse.success(
      res,
      `${this.entityName} bulk records deleted successfully`,
      result,
      200
    );
  });
}