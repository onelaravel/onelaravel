# BladeCompiler Services

Cấu trúc service cho Blade compiler, được tổ chức theo từng chức năng riêng biệt.

## Cấu trúc thư mục

```
src/core/Services/BladeCompilers/
├── CommonDirectiveService.php      # Logic dùng chung
├── SubscribeDirectiveService.php   # Xử lý @subscribe/@watch
├── YieldDirectiveService.php       # Xử lý @yield/@yieldAttr
├── WrapDirectiveService.php        # Xử lý @wrap/@wrapAttr
├── OnYieldDirectiveService.php     # Xử lý @onyield/@yieldOn
├── WrapperDirectiveService.php     # Xử lý @wrapper/@wrapperAttr
├── ClientSideDirectiveService.php  # Xử lý @clientside/@serverside
├── EventDirectiveService.php       # Xử lý các directive event
├── LetConstDirectiveService.php    # Xử lý @let/@const
├── TemplateDirectiveService.php    # Xử lý template directives
├── VarsDirectiveService.php        # Xử lý @vars
├── PhpStructureParserService.php   # Parser PHP phức tạp
└── SimplePhpStructureParserService.php # Parser PHP đơn giản
```

## Services

### CommonDirectiveService
Chứa các logic dùng chung cho tất cả directive:
- `extractStateKey()` - Loại bỏ prefix `$` từ biến state
- `parseYieldAttrParams()` - Parse tham số cho yield attributes
- `parseArrayContent()` - Parse nội dung array
- `isArraySyntax()` - Kiểm tra cú pháp array
- `hasKeyValuePairs()` - Kiểm tra key-value pairs
- `generateHelperEcho()` - Tạo PHP echo statement

### SubscribeDirectiveService
Xử lý directive `@subscribe/@watch` với tư duy mới:
- `processSubscribeDirective()` - Xử lý chính
- `parseStateArray()` - Parse array state variables
- `processSubscribeArrayKeyValue()` - Xử lý array key-value pairs

**Output format:**
```php
<?php echo $__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, ['#all' => ['stateKey']]);?>
```

### YieldDirectiveService
Xử lý directive `@yield/@yieldAttr`:
- `processYieldDirective()` - Xử lý chính
- `processYieldArray()` - Xử lý array syntax

**Output format:**
```html
data-yield-stateKey="#all"
```

### WrapDirectiveService
Xử lý directive `@wrap/@wrapAttr/@wrapattr`:
- `processWrapDirective()` - Xử lý chính

**Output format:**
```php
<?php echo $__helper->wrapattr();?>
```

### OnYieldDirectiveService
Xử lý directive `@onyield/@yieldOn/@yieldListen/@yieldWatch`:
- `processOnYieldDirective()` - Xử lý chính
- `processOnYieldArray()` - Xử lý array syntax

**Output format:**
```html
data-onyield-stateKey="#all"
```

### WrapperDirectiveService
Xử lý directive `@wrapper/@wrapperAttr`:
- `processWrapperDirective()` - Xử lý @wrapper
- `processWrapperAttrDirective()` - Xử lý @wrapperAttr
- `parseWrapperParams()` - Parse parameters

**Output format:**
```php
<?php echo $__helper->startWrapper($tag, $attributes, $__VIEW_ID__); ?>
```

### ClientSideDirectiveService
Xử lý directive `@clientside/@serverside` và aliases:
- `processClientSideDirective()` - Xử lý @clientside
- `processEndClientSideDirective()` - Xử lý @endclientside
- `processServerSideDirective()` - Xử lý @serverside
- `processEndServerSideDirective()` - Xử lý @endserverside

**Output format:**
```php
<?php if(isset($_______show_client_side______) && $_______show_client_side______): ?>
```

### EventDirectiveService
Xử lý các directive liên quan đến events:
- `processEventDirective()` - Xử lý event directives
- `processOnEventDirective()` - Xử lý @on* directives

### LetConstDirectiveService
Xử lý directive `@let/@const`:
- `processLetDirective()` - Xử lý @let
- `processConstDirective()` - Xử lý @const

### TemplateDirectiveService
Xử lý các directive template:
- `openTemplate()` - Mở template
- `closeTemplate()` - Đóng template

### VarsDirectiveService
Xử lý directive `@vars`:
- `processVarsDirective()` - Xử lý chính
- `parseVarsExpression()` - Parse expression

### PhpStructureParserService
Parser PHP phức tạp:
- `parsePhpStructure()` - Parse cấu trúc PHP
- `detectPhpPatterns()` - Nhận diện pattern PHP

### SimplePhpStructureParserService
Parser PHP đơn giản (tránh vòng lặp vô hạn):
- `parseSimplePhpStructure()` - Parse đơn giản
- `detectSimplePatterns()` - Nhận diện pattern đơn giản

## Cách sử dụng

Các service được khởi tạo trong `BladeDirectiveServiceProvider`:

```php
// Initialize Blade compiler services
$this->commonService = new CommonDirectiveService();
$this->subscribeService = new SubscribeDirectiveService();
$this->yieldService = new YieldDirectiveService($this->commonService);
$this->wrapService = new WrapDirectiveService();
```

## Lợi ích

1. **Tách biệt trách nhiệm**: Mỗi service xử lý một nhóm directive riêng
2. **Tái sử dụng**: `CommonDirectiveService` cung cấp logic dùng chung
3. **Dễ bảo trì**: Code được tổ chức rõ ràng, dễ tìm và sửa
4. **Mở rộng**: Dễ dàng thêm service mới cho directive mới
5. **Test**: Có thể test từng service riêng biệt
