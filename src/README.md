# 🏗️ Cấu Trúc Hệ Thống

## 📁 Tổng Quan

Thư mục `src/` chứa toàn bộ business logic và architecture của hệ thống, được thiết kế theo mô hình **Modular + Multi-Context** với Domain-Driven Design (DDD).

## 🗂️ Cấu Trúc Thư Mục

```
src/
├── Contexts/           # Multi-Context Architecture
│   ├── Api/           # API Context
│   ├── Web/           # Web Context  
│   └── Admin/         # Admin Context
├── Modules/            # Business Modules
│   ├── User/          # User Management
│   ├── PWA/           # Progressive Web App
│   └── Setting/       # System Settings
├── Core/               # Core System
│   ├── System.php     # System Manager
│   ├── Context.php    # Context Handler
│   └── Routing/       # Custom Router
├── Shared/             # Shared Components
│   ├── BaseController.php
│   ├── BaseService.php
│   ├── BaseRepository.php
│   ├── Traits/        # Reusable Traits
│   ├── Interfaces/    # Contract Interfaces
│   └── Repositories/  # Base Repository
├── Support/            # Utilities & Helpers
│   ├── helpers.php    # Helper Functions
│   └── ValidationRules.php
└── Infrastructure/     # Infrastructure Layer
    └── Database/      # Database Services
```

## 📦 Namespace Structure

Tất cả code trong `src/` sử dụng namespace chính `One\`:

- `One\Core\` - Core system (System, Context, Routing, Services)
- `One\Modules\` - Business modules (User, Home, PWA, etc.)
- `One\Contexts\` - Multi-context (Api, Web, Admin)
- `One\Shared\` - Shared components (BaseController, BaseService, etc.)
- `One\Support\` - Utilities & helpers
- `One\Infrastructure\` - Infrastructure layer

**Lưu ý**: Tên thư mục đã được chuẩn hóa theo PSR-4 (viết hoa chữ cái đầu):
- `src/Core/`, `src/Modules/`, `src/Contexts/`, `src/Shared/`, `src/Support/`, `src/Infrastructure/`

## 🔧 Cách Sử Dụng

### 1. **Contexts** - Đa ngữ cảnh
Mỗi context (API, Web, Admin) có:
- **Middleware** riêng biệt
- **Routes** độc lập  
- **Controllers** theo context
- **Bootstrap** để khởi tạo

```php
// Sử dụng context
use One\Core\System;

$adminContext = System::admin();
$webContext = System::web();
$apiContext = System::api();
```

### 2. **Modules** - Module chức năng
Mỗi module có cấu trúc:
```
ModuleName/
├── Models/             # Eloquent Models
├── Repositories/       # Data Access Layer
├── Services/           # Business Logic
├── Http/               # HTTP Layer
│   ├── Controllers/    # Controllers theo context
│   ├── Requests/       # Form Requests
│   └── Resources/      # API Resources
├── Masks/              # Data Masks
└── ModuleServiceProvider.php
```

### 3. **Shared Components** - Thành phần dùng chung

#### BaseController
```php
use One\Shared\BaseController;

class UserController extends BaseController
{
    public function index()
    {
        $users = $this->userService->getAll();
        return $this->successResponse($users);
    }
}
```

#### BaseService
```php
use One\Shared\Services\BaseService;

class UserService extends BaseService
{
    public function createUser(array $data)
    {
        return $this->create($data);
    }
}
```

#### BaseRepository
```php
use One\Shared\Repositories\BaseRepository;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }
}
```

### 4. **Support** - Tiện ích

#### Helper Functions
```php
// Format tiền tệ
format_currency(1000000); // 1.000.000 ₫

// Generate slug
generate_slug('Hello World'); // hello-world

// Mask thông tin
mask_phone('0123456789'); // 012****789
```

#### Validation Rules
```php
use One\Support\ValidationRules;

$rules = [
    'phone' => ValidationRules::vietnamesePhone(),
    'password' => ValidationRules::strongPassword(),
    'id_card' => ValidationRules::vietnameseIdCard(),
];
```

### 5. **Infrastructure** - Hạ tầng

#### Database Service
```php
use One\Infrastructure\Database\DatabaseService;

$dbService = app(DatabaseService::class);

// Kiểm tra bảng
$exists = $dbService->tableExists('users');

// Lấy cấu trúc bảng
$columns = $dbService->getTableColumns('users');

// Tối ưu bảng
$dbService->optimizeTable('users');
```

## 🚀 Best Practices

### 1. **Naming Convention**
- **Contexts**: PascalCase (Api, Web, Admin)
- **Modules**: PascalCase (User, Product, Order)
- **Files**: PascalCase cho class, snake_case cho file
- **Namespaces**: `One\{Layer}\{Component}` (One\Modules\User, One\Contexts\Api)

### 2. **Dependency Injection**
```php
// Sử dụng interfaces
public function __construct(
    private UserServiceInterface $userService,
    private UserRepositoryInterface $userRepository
) {}
```

### 3. **Error Handling**
```php
try {
    $result = $this->service->create($data);
    return $this->successResponse($result);
} catch (\Exception $e) {
    return $this->errorResponse($e->getMessage());
}
```

### 4. **Validation**
```php
// Sử dụng Form Requests
use One\Modules\User\Http\Requests\CreateUserRequest;

public function store(CreateUserRequest $request)
{
    $validated = $request->validated();
    // Process data...
}
```

## 📚 Tài Liệu Tham Khảo

- [Laravel Documentation](https://laravel.com/docs)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)

## 🔄 Cập Nhật Autoload

Sau khi thay đổi cấu trúc, chạy:
```bash
composer dump-autoload
```

## 🧪 Testing

```bash
# Chạy tests
php artisan test

# Chạy tests với coverage
php artisan test --coverage
```

## 📝 Ghi Chú

- **KHÔNG** sửa đổi trực tiếp các base classes
- **LUÔN** extend từ base classes khi tạo mới
- **TUÂN THỦ** naming convention
- **TEST** tất cả business logic
- **DOCUMENT** các API và business rules
