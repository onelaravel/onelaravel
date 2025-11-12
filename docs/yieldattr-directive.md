# @yieldAttr Directive

## Tổng quan

Directive `@yieldAttr` (hoặc `@yieldattr`) cho phép bạn tạo các attribute động cho HTML elements bằng cách sử dụng `yieldContent` của Laravel Blade.

## Cú pháp

```blade
@yieldAttr('attrKey', 'yieldKey', 'defaultValue?')
```

### Tham số

- **attrKey** (bắt buộc): Tên của HTML attribute (ví dụ: 'class', 'id', 'data-value')
- **yieldKey** (bắt buộc): Tên của yield section để lấy giá trị
- **defaultValue** (tùy chọn): Giá trị mặc định nếu yield section không tồn tại

## Kết quả

Directive sẽ tạo ra:

```html
attrKey="<?php echo e($__env->yieldContent('yieldKey', defaultValue));?>" spa-yield-attr="<?php echo 'attrKey' . ':' . 'yieldKey';?>"
```

## Ví dụ sử dụng

### 1. Basic usage với 2 tham số

```blade
<div @yieldAttr('class', 'contentClass')>Content</div>
```

Kết quả:
```html
<div class="<?php echo e($__env->yieldContent('contentClass', null));?>" spa-yield-attr="<?php echo 'class' . ':' . 'contentClass';?>">Content</div>
```

### 2. Với 3 tham số (có defaultValue)

```blade
<div @yieldAttr('class', 'contentClass', 'default-class')>Content</div>
```

Kết quả:
```html
<div class="<?php echo e($__env->yieldContent('contentClass', 'default-class'));?>" spa-yield-attr="<?php echo 'class' . ':' . 'contentClass';?>">Content</div>
```

### 3. Multiple attributes

```blade
<div @yieldAttr('class', 'contentClass', 'default-class') @yieldAttr('id', 'contentId') @yieldAttr('data-test', 'testValue', 'test-default')>Content</div>
```

### 4. Form elements

```blade
<input @yieldAttr('type', 'inputType', 'text') @yieldAttr('name', 'inputName') @yieldAttr('placeholder', 'inputPlaceholder', 'Enter value...') />
```

### 5. Với biến PHP

```blade
<div @yieldAttr('class', $yieldKey, $defaultValue)>Content</div>
```

## Các loại attribute được hỗ trợ

- **HTML attributes**: `class`, `id`, `title`, `style`, `onclick`, etc.
- **Data attributes**: `data-*`
- **ARIA attributes**: `aria-*`
- **Custom attributes**: Bất kỳ attribute nào

## Lưu ý quan trọng

1. **Tham số bắt buộc**: Cần ít nhất 2 tham số (attrKey và yieldKey)
2. **Quotes**: Tham số có thể được bao quanh bởi dấu nháy đơn hoặc kép
3. **Default value**: Nếu không cung cấp, sẽ sử dụng `null`
4. **SPA attribute**: Mỗi directive sẽ tạo thêm attribute `spa-yield-attr` để hỗ trợ SPA

## Error handling

Nếu thiếu tham số bắt buộc, sẽ có lỗi:
```
@yieldAttr directive requires at least 2 parameters: attrKey and yieldKey
```

## Test routes

- `/test-yieldattr` - Test cases với kết quả được render
- `/test-yieldattr-real` - Test cases với directive thực tế
- `/simple-yieldattr-test` - Test đơn giản

## Tương thích

- Laravel Blade
- SPA (Single Page Application) với `spa-yield-attr` attribute
- HTML5 attributes
- Custom attributes
