# Kiến Trúc Modular + Multi-Context

## Tổng Quan

Hệ thống được thiết kế theo kiến trúc **Modular + Multi-Context**, kết hợp giữa Domain-Driven Design (DDD) và Modular Architecture để tạo ra một hệ thống có thể phục vụ nhiều context khác nhau (API, Web, Admin) một cách độc lập và dễ mở rộng.

## Cấu Trúc Thư Mục

```
src/                          ← 🏗️ Core Source Code (Modular Architecture)
├── contexts/                 ← 🧠 Multi-Context System
│   ├── Admin/               # Admin Context
│   │   ├── Bootstrap.php    # Context bootstrap
│   │   ├── Controllers/     # Base controllers
│   │   └── Middleware/      # Context middleware
│   ├── Api/                 # API Context
│   │   ├── Bootstrap.php
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Routes/
│   └── Web/                 # Web Context
│       ├── Bootstrap.php
│       ├── Controllers/
│       ├── Middleware/
│       └── Config/
│
├── modules/                  ← 📦 Business Modules
│   ├── User/                # User Management Module
│   │   ├── Models/          # Eloquent Models
│   │   ├── Repositories/    # Data Access Layer
│   │   ├── Services/        # Business Logic
│   │   ├── Http/            # HTTP Layer
│   │   │   ├── Controllers/ # Controllers (không phân context)
│   │   │   ├── Requests/    # Form Requests
│   │   │   └── Resources/   # API Resources
│   │   ├── Masks/           # Data Masks
│   │   ├── Providers/       # Route Service Providers
│   │   └── ModuleServiceProvider.php
│   ├── Home/                # Home Module
│   ├── PWA/                 # Progressive Web App Module
│   ├── Web/                 # Web Module
│   ├── Shop/                # Shop Module
│   └── Setting/             # Settings Module
│
├── core/                     ← ⚙️ Core System
│   ├── System.php           # System Manager
│   ├── Context.php          # Context Handler
│   ├── Providers/           # Core Service Providers
│   │   ├── OneServiceProvider.php
│   │   ├── BladeDirectiveServiceProvider.php
│   │   └── ViewContextServiceProvider.php
│   ├── Routing/             # Custom Routing System
│   │   ├── Router.php
│   │   ├── Module.php
│   │   ├── Action.php
│   │   └── RouteMethods.php
│   ├── Services/            # Core Services
│   │   ├── BladeCompilers/  # Blade Directive Services
│   │   │   ├── EventDirectiveService.php
│   │   │   ├── BindingDirectiveService.php
│   │   │   ├── SubscribeDirectiveService.php
│   │   │   ├── VarsDirectiveService.php
│   │   │   └── ... (12+ directive services)
│   │   ├── ViewHelperService.php
│   │   ├── ViewStorageManager.php
│   │   └── ViewContextService.php
│   ├── Http/                # HTTP Layer
│   │   ├── Middleware/      # Core Middleware
│   │   └── ViewComposers/   # View Composers
│   ├── Support/             # Support Classes
│   │   ├── SPA.php          # SPA Helper
│   │   └── ViewState.php    # View State Management
│   └── View/                # View System (legacy)
│
├── shared/                   ← 🔗 Shared Code
│   ├── BaseController.php   # Base Controller
│   ├── Repositories/        # Base Repository Pattern
│   │   └── BaseRepository.php
│   ├── Services/            # Base Services
│   │   ├── BaseService.php
│   │   ├── BladeToSpaCompiler.php
│   │   └── ViewStorageService.php
│   ├── Traits/              # Reusable Traits
│   │   ├── HasUuid.php
│   │   └── HasTimestamps.php
│   └── Interfaces/          # Contract Interfaces
│       └── AuditableInterface.php
│
├── support/                  ← 🛠️ Utilities & Helpers
│   ├── helpers.php          # Helper Functions
│   └── ValidationRules.php  # Custom Validation Rules
│
├── infrastructure/           ← 🏛️ Infrastructure Layer
│   └── Database/            # Database Services
│       └── DatabaseService.php
│
└── templates/                ← 📋 Module Templates
    └── module/              # Module Generator Templates
        ├── BootstrapProvider.php
        ├── ModuleServiceProvider.php
        ├── Http/Controllers/
        ├── Models/
        ├── Repositories/
        ├── Services/
        └── Providers/
```

## Các Layer Chính

### 1. Contexts Layer (`src/contexts/`)
- **Mục đích**: Quản lý các context riêng biệt (API, Web, Admin)
- **Chức năng**: 
  - Định nghĩa middleware riêng cho từng context
  - Base controllers cho từng context
  - Bootstrap logic để load routes và modules theo context
  - Xử lý authentication/authorization theo context

**Cấu trúc mỗi context:**
```
ContextName/
├── Bootstrap.php          # Khởi tạo context, load routes/modules
├── Controllers/           # Base controllers (BaseAdminController, etc.)
└── Middleware/            # Context-specific middleware
```

### 2. Modules Layer (`src/modules/`)
- **Mục đích**: Chứa các business module độc lập theo DDD
- **Chức năng**:
  - Models, Repositories, Services theo Domain-Driven Design
  - Controllers không phân context (dùng chung)
  - Routes được đăng ký qua RouteServiceProvider
  - ModuleServiceProvider để tự động load module

**Cấu trúc mỗi module:**
```
ModuleName/
├── Models/                # Eloquent Models
├── Repositories/          # Data Access Layer
│   ├── ModuleRepository.php
│   └── ModuleRepositoryInterface.php
├── Services/              # Business Logic
│   ├── ModuleService.php
│   └── ModuleServiceInterface.php
├── Http/
│   ├── Controllers/       # Controllers (không phân Api/Web/Admin)
│   ├── Requests/          # Form Requests
│   └── Resources/         # API Resources
├── Masks/                 # Data Masks
├── Providers/             # Route Service Providers
│   └── ModuleRouteServiceProvider.php
└── ModuleServiceProvider.php
```

### 3. Core Layer (`src/core/`)
- **Mục đích**: Khởi tạo và cấu hình hệ thống
- **Chức năng**:
  - System.php: Quản lý hệ thống
  - Context.php: Xử lý context switching
  - Service Providers: Đăng ký services, directives
  - Routing: Custom routing system
  - Blade Compilers: Xử lý tất cả custom directives
  - View Services: View helper, storage, context

**Các thành phần chính:**
- **BladeCompilers/**: 12+ directive services xử lý `@click`, `@bind`, `@vars`, `@subscribe`, etc.
- **Routing/**: Custom router với module support
- **Services/**: Core services cho view, storage, context

### 4. Shared Layer (`src/shared/`)
- **Mục đích**: Chia sẻ code giữa các module
- **Chức năng**:
  - Base classes: BaseController, BaseService, BaseRepository
  - Traits: HasUuid, HasTimestamps
  - Interfaces: AuditableInterface
  - Shared Services: BladeToSpaCompiler, ViewStorageService

### 5. Support Layer (`src/support/`)
- **Mục đích**: Utilities và helpers
- **Chức năng**:
  - Helper functions
  - Custom validation rules

### 6. Infrastructure Layer (`src/infrastructure/`)
- **Mục đích**: Infrastructure concerns
- **Chức năng**:
  - Database services
  - External service integrations

## Luồng Hoạt Động

### 1. Khởi Tạo
```
AppServiceProvider (app/Providers/)
  → OneServiceProvider (src/core/Providers/)
    → Register Context Bootstraps (src/contexts/*/Bootstrap.php)
      → Load ModuleServiceProviders (src/modules/*/ModuleServiceProvider.php)
        → Load RouteServiceProviders (src/modules/*/Providers/*RouteServiceProvider.php)
          → Register Routes
```

### 2. Request Processing
```
HTTP Request
  → Context Middleware (src/contexts/{Context}/Middleware/)
    → Module Route (đăng ký bởi RouteServiceProvider)
      → Controller (src/modules/{Module}/Http/Controllers/)
        → Service (src/modules/{Module}/Services/)
          → Repository (src/modules/{Module}/Repositories/)
            → Model (src/modules/{Module}/Models/)
```

### 3. Context Isolation
- **API Context**: JSON responses, API authentication, API middleware
- **Web Context**: HTML responses, session-based auth, SPA support
- **Admin Context**: Admin interface, role-based access, admin middleware

## Ưu Điểm

1. **Tách Biệt Hoàn Toàn**: Mỗi context có middleware, base controllers, và logic riêng
2. **Dễ Mở Rộng**: 
   - Thêm context mới: tạo thư mục trong `src/contexts/`
   - Thêm module mới: tạo thư mục trong `src/modules/` hoặc dùng `php artisan make:module`
3. **Module Độc Lập**: Mỗi module là một đơn vị độc lập, có thể test riêng
4. **Tái Sử Dụng**: Shared layer cho phép chia sẻ code giữa các module
5. **Dễ Test**: Mỗi layer có thể test độc lập
6. **Blade to JS**: Core system hỗ trợ compile Blade templates thành JavaScript

## Best Practices

1. **Naming Convention**: 
   - Context: PascalCase (Api, Web, Admin)
   - Module: PascalCase (User, Product, Order)
   - File: PascalCase cho class, snake_case cho file

2. **Dependency Injection**: Sử dụng interfaces cho loose coupling

3. **Repository Pattern**: Tách biệt data access logic trong Repositories/

4. **Service Layer**: Encapsulate business logic trong Services/

5. **Module Structure**: Mỗi module nên có đầy đủ Models, Repositories, Services, Controllers

6. **Route Registration**: Routes được đăng ký trong RouteServiceProvider, không phải trong routes/

## Monitoring & Security

- **Logging**: Mỗi context có thể có logging riêng
- **Security**: Middleware riêng cho từng context
- **Performance**: Lazy loading modules theo context

## Testing Strategy

- **Unit Tests**: Test từng service, repository riêng biệt
- **Feature Tests**: Test theo context (ApiTest, WebTest, AdminTest)
- **Integration Tests**: Test tương tác giữa các module

## Tạo Module Mới

Sử dụng Artisan command:
```bash
php artisan make:module ModuleName
```

Command này sẽ tạo cấu trúc module đầy đủ trong `src/modules/ModuleName/` dựa trên template trong `src/templates/module/`.
