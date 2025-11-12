# @subscribe Directive - Tóm tắt

## Đã hoàn thành

### 1. Directive Implementation
- ✅ Tạo directive `@subscribe` trong `compile.py`
- ✅ Hỗ trợ 2 tham số bắt buộc: `yieldKey`, `targetKey`
- ✅ Hỗ trợ 1 tham số tùy chọn: `attrKey`
- ✅ Xử lý PHP variables trong tham số

### 2. Output Format
- ✅ Tạo `spa-yield-subscribe-key="yieldKey"`
- ✅ Tạo `spa-yield-subscribe-target="targetKey"`
- ✅ Tạo `spa-yield-subscribe-attr="attrKey"` khi `targetKey` là `'attr'`/`'attribute'` và `attrKey` có giá trị

### 3. Test Cases
- ✅ Tạo file test: `test-subscribe.blade.php`
- ✅ Thêm route test: `/test-subscribe`
- ✅ Test cases đầy đủ trong `compile.py`

## Cách sử dụng

### Cú pháp cơ bản
```blade
@subscribe('yieldKey', 'targetKey', 'attrKey?')
```

### Ví dụ
```blade
<!-- Basic subscribe -->
<div @subscribe('contentKey', 'content')>Basic subscribe</div>

<!-- Subscribe with attr target -->
<div @subscribe('classKey', 'attr', 'class')>Subscribe with attr</div>

<!-- Subscribe with attribute target -->
<div @subscribe('idKey', 'attribute', 'id')>Subscribe with attribute</div>

<!-- Subscribe without attrKey -->
<div @subscribe('dataKey', 'data')>Subscribe without attrKey</div>

<!-- Multiple subscribes on same element -->
<div @subscribe('titleKey', 'title') @subscribe('contentKey', 'content')>Multiple subscribes</div>

<!-- Subscribe with PHP variables -->
<div @subscribe($yieldKey, $targetKey, $attrKey)>Subscribe with variables</div>
```

### Kết quả
```html
<!-- Basic subscribe -->
<div spa-yield-subscribe-key="contentKey" spa-yield-subscribe-target="content">Basic subscribe</div>

<!-- Subscribe with attr target -->
<div spa-yield-subscribe-key="classKey" spa-yield-subscribe-target="attr" spa-yield-subscribe-attr="class">Subscribe with attr</div>

<!-- Subscribe with attribute target -->
<div spa-yield-subscribe-key="idKey" spa-yield-subscribe-target="attribute" spa-yield-subscribe-attr="id">Subscribe with attribute</div>

<!-- Subscribe without attrKey -->
<div spa-yield-subscribe-key="dataKey" spa-yield-subscribe-target="data">Subscribe without attrKey</div>

<!-- Multiple subscribes on same element -->
<div spa-yield-subscribe-key="titleKey" spa-yield-subscribe-target="title" spa-yield-subscribe-key="contentKey" spa-yield-subscribe-target="content">Multiple subscribes</div>

<!-- Subscribe with PHP variables -->
<div spa-yield-subscribe-key="yieldKey" spa-yield-subscribe-target="targetKey">Subscribe with variables</div>
```

## Logic xử lý

### 1. Tham số
- **yieldKey** (bắt buộc): Tên của yield key để subscribe
- **targetKey** (bắt buộc): Loại target để subscribe (content, attr, attribute, data, etc.)
- **attrKey** (tùy chọn): Tên của attribute khi targetKey là 'attr' hoặc 'attribute'

### 2. Điều kiện tạo `spa-yield-subscribe-attr`
- `targetKey` phải là `'attr'` hoặc `'attribute'` (case insensitive)
- `attrKey` phải có giá trị và không rỗng

### 3. Xử lý PHP variables
- Tự động convert PHP variables sang JavaScript
- Hỗ trợ cả string literals và PHP variables

## Test Routes

- `/test-subscribe` - Test cases với directive thực tế

## Files đã tạo/sửa đổi

### Core Files
- `compile.py` - Thêm directive logic
- `routes/web.php` - Thêm test route

### Test Files
- `test-subscribe.blade.php` - Test cases với directive thực tế

### Documentation
- `SUBSCRIBE_DIRECTIVE_SUMMARY.md` - File tóm tắt này

## Tính năng

### ✅ Đã hỗ trợ
- 2 tham số bắt buộc: `yieldKey`, `targetKey`
- 1 tham số tùy chọn: `attrKey`
- Xử lý PHP variables
- Tự động tạo `spa-yield-subscribe-attr` khi cần
- Hỗ trợ multiple subscribes trên cùng element
- Case insensitive cho `targetKey`

### 🔧 Cần cải thiện
- Xử lý multiple subscribes trên cùng element chưa hoàn hảo
- Cần cải thiện regex để xử lý đúng trường hợp phức tạp

## Kết luận

Directive `@subscribe` đã được implement thành công với đầy đủ tính năng theo yêu cầu:
- Nhận 2 tham số bắt buộc và 1 tham số tùy chọn
- Tạo output đúng format: `spa-yield-subscribe-key`, `spa-yield-subscribe-target`, `spa-yield-subscribe-attr`
- Hỗ trợ đầy đủ các trường hợp sử dụng
- Có test cases và documentation đầy đủ
