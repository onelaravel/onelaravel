# 🔄 Chuẩn Hóa Namespace và Cấu Trúc Code

## 📋 Tổng Quan

Tài liệu này mô tả kế hoạch chuẩn hóa và đơn giản hóa cấu trúc namespace trong dự án OneLaravel.

## 🎯 Mục Tiêu

1. **Đơn giản hóa**: Gom tất cả namespace vào một namespace chính `One\`
2. **Chuẩn hóa**: Tuân thủ PSR-4 một cách nhất quán
3. **Tên thư mục chuẩn**: Viết hoa chữ cái đầu (Core, Modules, Contexts, etc.)
4. **Dễ bảo trì**: Cấu trúc rõ ràng, dễ tìm và sửa đổi

## 📊 So Sánh Cấu Trúc

### ❌ Cấu Trúc Hiện Tại (Phức Tạp)

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

**Vấn đề:**
- 6 namespace riêng biệt → khó nhớ và quản lý
- Không có namespace chính → khó phân biệt với các package khác
- Không nhất quán với các dự án Laravel khác

### ✅ Cấu Trúc Đề Xuất (Đơn Giản & Chuẩn)

```json
{
  "autoload": {
    "psr-4": {
      "App\\": "app/",
      "One\\": "src/"
    }
  }
}
```

**Lợi ích:**
- 1 namespace chính `One\` → ngắn gọn, dễ nhớ
- Tuân thủ PSR-4 chuẩn → cấu trúc thư mục = namespace
- Tên thư mục viết hoa chữ cái đầu → chuẩn PSR-4
- Nhất quán với Laravel → dễ hiểu cho developer mới

## 🗂️ Mapping Namespace & Thư Mục Mới

| Namespace Cũ | Namespace Mới | Thư Mục Cũ | Thư Mục Mới |
|-------------|--------------|------------|-------------|
| `Core\` | `One\Core\` | `src/core/` | `src/Core/` |
| `Modules\` | `One\Modules\` | `src/modules/` | `src/Modules/` |
| `Contexts\` | `One\Contexts\` | `src/contexts/` | `src/Contexts/` |
| `Shared\` | `One\Shared\` | `src/shared/` | `src/Shared/` |
| `Support\` | `One\Support\` | `src/support/` | `src/Support/` |
| `Infrastructure\` | `One\Infrastructure\` | `src/infrastructure/` | `src/Infrastructure/` |

## 📝 Ví Dụ Migration

### Trước (Cũ):
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

### Sau (Mới):
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

## 🔧 Các Bước Migration

### Bước 1: Đổi Tên Thư Mục
```bash
php scripts/standardize-directories.php
```
- Đổi tên các thư mục: `core` → `Core`, `modules` → `Modules`, etc.

### Bước 2: Cập Nhật composer.json
- Thay đổi PSR-4 autoload từ nhiều namespace → một namespace chính `One\`
- Cập nhật đường dẫn helpers: `src/Support/helpers.php`

### Bước 3: Refactor Code
```bash
php scripts/migrate-namespace.php
```
- Tự động tìm và thay thế tất cả `namespace` declarations
- Tự động tìm và thay thế tất cả `use` statements
- Cập nhật các string references

### Bước 4: Cập Nhật Service Providers
- Cập nhật các class references trong AppServiceProvider
- Cập nhật các middleware aliases
- Cập nhật các đường dẫn trong config files

### Bước 5: Test
- Chạy `composer dump-autoload`
- Chạy tests để đảm bảo không có lỗi
- Test các chức năng chính

## 🚀 Script Migration Tự Động

### Script 1: Chuẩn Hóa Tên Thư Mục
```bash
php scripts/standardize-directories.php
```
- Đổi tên các thư mục để phù hợp với PSR-4 (viết hoa chữ cái đầu)

### Script 2: Migration Namespace
```bash
php scripts/migrate-namespace.php
```
- Tự động tìm và thay thế namespace trong tất cả file PHP
- Hỗ trợ migration từ cả namespace cũ và `OneLaravel\` sang `One\`

## ⚠️ Lưu Ý

1. **Backup**: Luôn backup code trước khi migration
2. **Testing**: Test kỹ lưỡng sau khi migration
3. **Documentation**: Cập nhật tất cả tài liệu
4. **Git**: Commit từng bước để dễ rollback

## 📚 Tài Liệu Tham Khảo

- [PSR-4 Autoloading Standard](https://www.php-fig.org/psr/psr-4/)
- [Laravel Package Development](https://laravel.com/docs/packages)

