# Kiến Trúc Modular + Multi-Context

## Tổng Quan

Hệ thống được thiết kế theo kiến trúc **Modular + Multi-Context**, kết hợp giữa Domain-Driven Design (DDD) và Modular Architecture để tạo ra một hệ thống có thể phục vụ nhiều context khác nhau (API, Web, Admin) một cách độc lập và dễ mở rộng.

## Cấu Trúc Thư Mục

```
app/
├── Contexts/           ← 🧠 Nơi định nghĩa các context ở cấp hệ thống
│   ├── Api/
│   │   ├── Routes/
│   │   ├── Middleware/
│   │   └── Bootstrap.php      ← Load route/module theo context
│   ├── Web/
│   │   ├── Routes/
│   │   ├── Middleware/
│   │   └── Bootstrap.php
│   └── Admin/
│       ├── Routes/
│       ├── Middleware/
│       └── Bootstrap.php
├── Modules/            ← Các module chức năng (User, Post, etc.)
│   ├── User/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   ├── Services/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   ├── Web/
│   │   │   │   └── Admin/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── routes/
│   │   │   ├── api.php
│   │   │   ├── web.php
│   │   │   └── admin.php
│   │   └── ModuleServiceProvider.php
│   └── ...
├── Core/               ← AppServiceProvider, middleware global, base route loader
├── Shared/             ← Dùng chung (Traits, Interfaces, Base Classes)
└── Support/            ← Helpers, Macros, Custom Validators
```

## Các Layer Chính

### 1. Contexts Layer
- **Mục đích**: Quản lý các context riêng biệt (API, Web, Admin)
- **Chức năng**: 
  - Định nghĩa middleware riêng cho từng context
  - Load routes và modules theo context
  - Xử lý authentication/authorization theo context

### 2. Modules Layer
- **Mục đích**: Chứa các business module độc lập
- **Chức năng**:
  - Models, Repositories, Services theo DDD
  - Controllers cho từng context (Api/Web/Admin)
  - Routes riêng cho từng context
  - ModuleServiceProvider để tự động load

### 3. Core Layer
- **Mục đích**: Khởi tạo và cấu hình hệ thống
- **Chức năng**:
  - AppServiceProvider chính
  - Register các Context Bootstrap
  - Middleware aliases

### 4. Shared Layer
- **Mục đích**: Chia sẻ code giữa các module
- **Chức năng**:
  - Base classes (BaseController, BaseService, BaseRepository)
  - Traits (HasUuid, HasTimestamps)
  - Interfaces (AuditableInterface)

## Luồng Hoạt Động

### 1. Khởi Tạo
```
AppServiceProvider → Register Context Bootstraps → Load ModuleServiceProviders → Load Routes
```

### 2. Request Processing
```
Request → Context Middleware → Module Route → Controller → Service → Repository → Model
```

### 3. Context Isolation
- **API Context**: JSON responses, API authentication
- **Web Context**: HTML responses, session-based auth
- **Admin Context**: Admin interface, role-based access

## Ưu Điểm

1. **Tách Biệt Hoàn Toàn**: Mỗi context có middleware, routes, và logic riêng
2. **Dễ Mở Rộng**: Thêm context mới chỉ cần tạo thư mục trong Contexts/
3. **Module Độc Lập**: Mỗi module có thể có hoặc không có controller cho từng context
4. **Tái Sử Dụng**: Shared layer cho phép chia sẻ code giữa các module
5. **Dễ Test**: Mỗi layer có thể test độc lập

## Best Practices

1. **Naming Convention**: 
   - Context: PascalCase (Api, Web, Admin)
   - Module: PascalCase (User, Product, Order)
   - File: PascalCase cho class, snake_case cho file

2. **Dependency Injection**: Sử dụng interfaces cho loose coupling

3. **Event-Driven**: Sử dụng events để decouple các module

4. **Repository Pattern**: Tách biệt data access logic

5. **Service Layer**: Encapsulate business logic

## Monitoring & Security

- **Logging**: Mỗi context có thể có logging riêng
- **Security**: Middleware riêng cho từng context
- **Performance**: Lazy loading modules theo context

## Testing Strategy

- **Unit Tests**: Test từng service, repository riêng biệt
- **Feature Tests**: Test theo context (ApiTest, WebTest, AdminTest)
- **Integration Tests**: Test tương tác giữa các module 