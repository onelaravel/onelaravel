# 🔄 Hướng Dẫn Migration Namespace

## 📋 Tổng Quan

Hướng dẫn này giúp bạn migrate từ cấu trúc namespace cũ sang cấu trúc mới đã được chuẩn hóa.

## ⚡ Quick Start

### Bước 1: Backup Code
```bash
git add .
git commit -m "Backup before namespace migration"
```

### Bước 2: Đổi Tên Thư Mục (Chuẩn Hóa PSR-4)
```bash
php scripts/standardize-directories.php
```

### Bước 3: Chạy Script Migration Namespace
```bash
php scripts/migrate-namespace.php
```

### Bước 4: Cập Nhật Autoload
```bash
composer dump-autoload
```

### Bước 5: Test
```bash
php artisan test
php artisan serve  # Test thủ công
```

## 📝 Chi Tiết Migration

### Thay Đổi Trong composer.json

**Trước:**
```json
{
  "autoload": {
    "psr-4": {
      "App\\": "app/",
      "Core\\": "src/core/",
      "Modules\\": "src/modules/",
      "Contexts\\": "src/contexts/",
      "Shared\\": "src/shared/",
      "Support\\": "src/support/",
      "Infrastructure\\": "src/infrastructure/"
    }
  }
}
```

**Sau:**
```json
{
  "autoload": {
    "psr-4": {
      "App\\": "app/",
      "One\\": "src/"
    },
    "files": [
      "src/Support/helpers.php"
    ]
  }
}
```

### Mapping Namespace & Thư Mục

| Namespace Cũ | Namespace Mới | Thư Mục Cũ | Thư Mục Mới |
|---|---|---|---|
| `Core\` | `One\Core\` | `src/core/` | `src/Core/` |
| `Modules\` | `One\Modules\` | `src/modules/` | `src/Modules/` |
| `Contexts\` | `One\Contexts\` | `src/contexts/` | `src/Contexts/` |
| `Shared\` | `One\Shared\` | `src/shared/` | `src/Shared/` |
| `Support\` | `One\Support\` | `src/support/` | `src/Support/` |
| `Infrastructure\` | `One\Infrastructure\` | `src/infrastructure/` | `src/Infrastructure/` |

### Ví Dụ Code Migration

**Trước:**
```php
<?php

namespace Core\Services;

use Modules\User\Services\UserServiceInterface;
use Shared\BaseService;

class ViewHelperService extends BaseService
{
    // ...
}
```

**Sau:**
```php
<?php

namespace One\Core\Services;

use One\Modules\User\Services\UserServiceInterface;
use One\Shared\BaseService;

class ViewHelperService extends BaseService
{
    // ...
}
```

## 🔍 Kiểm Tra Sau Migration

### 1. Kiểm Tra Namespace Declarations
```bash
grep -r "namespace Core\\\\" src/
grep -r "namespace Modules\\\\" src/
grep -r "namespace OneLaravel\\\\" src/
# Nếu còn kết quả, cần kiểm tra lại
```

### 2. Kiểm Tra Use Statements
```bash
grep -r "use Core\\\\" src/
grep -r "use Modules\\\\" src/
grep -r "use OneLaravel\\\\" src/
# Nếu còn kết quả, cần kiểm tra lại
```

### 3. Kiểm Tra String References
```bash
grep -r '"Core\\\\' src/
grep -r "'Core\\\\" src/
grep -r '"OneLaravel\\\\' src/
# Kiểm tra các string references trong code
```

### 4. Kiểm Tra Tên Thư Mục
```bash
# Kiểm tra xem còn thư mục chữ thường không
ls -la src/ | grep -E "^d.*[a-z]$"
# Nếu còn, cần chạy lại script standardize-directories.php
```

## ⚠️ Lưu Ý Quan Trọng

1. **Service Providers**: Cần cập nhật các class references trong `AppServiceProvider`
2. **Config Files**: Kiểm tra các file config có reference đến namespace cũ
3. **Route Files**: Kiểm tra route files có sử dụng namespace cũ
4. **Tests**: Đảm bảo tất cả tests vẫn chạy được

## 🐛 Troubleshooting

### Lỗi: Class not found
```bash
# Chạy lại autoload
composer dump-autoload

# Clear cache
php artisan config:clear
php artisan cache:clear
```

### Lỗi: Namespace không khớp
- Kiểm tra lại file đã được migrate chưa
- Chạy lại script migration
- Kiểm tra thủ công các file còn sót

## 📚 Tài Liệu Liên Quan

- [NAMESPACE_STANDARDIZATION.md](./NAMESPACE_STANDARDIZATION.md) - Chi tiết về chuẩn hóa namespace
- [src/README.md](../src/README.md) - Cấu trúc hệ thống

