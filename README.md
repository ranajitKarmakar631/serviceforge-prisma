# ServiceForge Prisma 

![NPM Version](https://img.shields.io/npm/v/serviceforge-prisma)
![License](https://img.shields.io/npm/l/serviceforge-prisma)

An industrialized, high-performance Prisma ORM utility toolkit specifically designed for scalable **microservice** architectures. 

`serviceforge-prisma` acts as a centralized data-access and routing framework. Instead of re-writing boilerplate CRUD endpoints across dozens of Node/Express microservices, pull in this package to instantly inherit:
- **Connection Pooling**: Safely manages `PrismaClient` as a singleton to prevent TCP port exhaustion when 15+ microservices attempt to query identical Mongo/PostgreSQL clusters.
- **Strict Base Controllers**: Extensible router handlers strictly typed against your models capable of instantly processing pagination, sorting, and bulk manipulations out-of-the-box.
- **Global Middlewares**: Centralized Express request parsers injecting standardized response interceptors via schemas using Zod (`validateMiddleware`), and intercepting Prisma error codes to sanitize errors cleanly (`errorMiddleware`).
- **Unified Authentication Logic**: Cross-service JWT extraction and enforcement strategies guaranteeing session signatures are parsed correctly domain-wide.

## Quick Start

### Installation
```bash
npm install serviceforge-prisma @prisma/client
```

### 1. Initialize Prisma
Leverage the singleton pattern to ensure you aren't leaking connections when scaling container pods.

```typescript
import { PrismaClientManager } from "serviceforge-prisma";
const prisma = PrismaClientManager.getInstance().getClient();
```

### 2. Scaffold a REST Endpoint instantly
Eliminate try-catch chains and duplicate logic. Build your entities rapidly:

```typescript
// user.controller.ts
import { BaseController } from "serviceforge-prisma";
import { userService } from "./user.service.js"; // Standard extension of BaseService

export class UserController extends BaseController {
    constructor() {
        super(userService, "User");
    }
}

const userController = new UserController();

// Automatically mapped natively 
router.post("/", userController.handleCreate);
router.get("/:id", userController.handleFindById);
router.post("/list", userController.handleList);
```

### 3. Guarantee Standard Shapes globally
Inject our operational response pipelines onto all custom routers:

```typescript
import { ApiResponse, AppError, catchAsync } from "serviceforge-prisma";

export const performCustomAction = catchAsync(async (req, res, next) => {
    if (!req.user) {
        throw new AppError("Invalid Permissions", 401);
    }
    
    // Dispatches standard: { success, message, result, timestamp }
    return ApiResponse.success(res, "Successful Operation", data, 200);
});
```

## Why ServiceForge?
Microservices often fall into the trap of drifting standardizations. Some teams might return `{ data: [...] }` while others return `{ payload: [...] }`. Some services handle Prisma unique constraint violations natively returning 400 Bad Requests, while others crash entirely resulting in 500s. 

`serviceforge-prisma` behaves as the central enforcer resolving these drifts natively by encapsulating them inside an industrial ORM wrapper package.

---

### License
MIT 
© 2026 Ranajit Karmakar
