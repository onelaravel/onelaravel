# View Context System - Documentation

## 📋 Tổng quan

Hệ thống tự động inject các biến context vào views dựa trên cách chúng được gọi:
- **@include/@includeIf/...**: View được include nhận `__PARENT_VIEW_PATH__` và `__PARENT_VIEW_ID__`
- **@extends**: Layout được extends nhận `__ORIGIN_VIEW_PATH__` và `__ORIGIN_VIEW_ID__`

## ⚠️ Quan trọng: Phân biệt @include và @extends

### @include vs @extends:

1. **View được @include**:
   - ✅ Nhận `__PARENT_VIEW_PATH__` và `__PARENT_VIEW_ID__`
   - ❌ KHÔNG nhận origin

2. **View có @extends**:
   - ❌ KHÔNG nhận parent (vì không phải included, mà là extending)
   - ❌ KHÔNG set children cho layout

3. **Layout được @extends**:
   - ✅ Nhận `__ORIGIN_VIEW_PATH__` và `__ORIGIN_VIEW_ID__`
   - ❌ KHÔNG nhận parent
   - ❌ KHÔNG nhận children

## 🔧 Cách hoạt động

### 1. @include Relationship

Khi một view include view khác:

```php
// web/home.blade.php
<div>
    @include('partials.header')
</div>
```

**Kết quả:**
- `partials.header` nhận:
  - `__PARENT_VIEW_PATH__ = 'web.home'`
  - `__PARENT_VIEW_ID__ = 'home-123'` (ID của web.home)

**Logic:**
- Khi view được render, current view trong stack là parent
- Parent được set trước khi push view mới vào stack

### 2. @extends Relationship

Khi một view extends layout:

```php
// web/about.blade.php
@extends('layouts.base')

@section('content')
    <h1>About</h1>
@endsection
```

**Kết quả:**
- `layouts.base` nhận:
  - `__ORIGIN_VIEW_PATH__ = 'web.about'`
  - `__ORIGIN_VIEW_ID__ = 'about-456'` (ID của web.about)
- `web.about` **KHÔNG** nhận parent (vì dùng @extends, không phải @include)

**Logic:**
1. System detect `@extends('layouts.base')` trong `web.about`
2. Laravel render `layouts.base` trước
3. Khi render `web.about`:
   - Check: có @extends? → YES
   - Skip set parent (vì @extends, không phải @include)
4. Set origin cho `layouts.base`
5. `layouts.base` nhận được thông tin về view gọi @extends

### 3. Complex Case: @extends + @include

```php
// web/about.blade.php
@extends('layouts.base')

@section('content')
    <h1>About</h1>
    @include('partials.sidebar')
@endsection
```

**Kết quả:**
- `layouts.base` nhận:
  - `__ORIGIN_VIEW_PATH__ = 'web.about'`
  - `__ORIGIN_VIEW_ID__ = 'about-456'`
  - **KHÔNG** nhận children từ `web.about`
  
- `web.about`:
  - **KHÔNG** nhận parent (vì dùng @extends)
  
- `partials.sidebar` nhận:
  - `__PARENT_VIEW_PATH__ = 'web.about'`
  - `__PARENT_VIEW_ID__ = 'about-456'`

## 📊 Các biến được inject

### Mọi view đều nhận:
- `__VIEW_ID__`: Unique ID cho view instance
- `__VIEW_PATH__`: Tên view (VD: 'web.home')
- `__VIEW_NAME__`: Alias của __VIEW_PATH__
- `__VIEW_TYPE__`: Loại view (mặc định: 'view')

### View được @include nhận thêm:
- `__PARENT_VIEW_PATH__`: Tên view gọi @include
- `__PARENT_VIEW_ID__`: ID của view gọi @include

**Lưu ý:** View có `@extends` sẽ KHÔNG nhận parent!

### Layout được @extends nhận thêm:
- `__ORIGIN_VIEW_PATH__`: Tên view gọi @extends
- `__ORIGIN_VIEW_ID__`: ID của view gọi @extends

**Lưu ý:** Layout KHÔNG nhận parent hay children!

## 🎯 Logic Decision Tree

```
View được render:
├─ Có @extends?
│  ├─ YES → Skip set parent (không phải @include)
│  │       → Set origin cho layout
│  └─ NO → Có current view?
│          ├─ YES → Set parent (đây là @include)
│          └─ NO → Root view, không có parent
│
└─ Là layout được extends?
   └─ YES → Nhận origin, KHÔNG nhận children
```

## 🚀 Performance

### Caching Strategy:
- **Static cache**: Kết quả parse `@extends` được cache trong static array
- **Laravel Octane**: Cache tồn tại giữa các requests
- **First request**: Parse file (~0.02ms overhead)
- **Subsequent requests**: Load từ cache (~0ms overhead)

### Benchmarks:
- Without cache: 0.019 ms/request
- With cache: 0.000 ms/request
- **Speed improvement: 317x faster**
- **Memory overhead: ~2KB cho 100 views**

## 💻 Implementation

### Files:
- `src/core/Providers/ViewContextServiceProvider.php`: Main logic
- `src/core/Services/ViewContextService.php`: Context management

### Key Methods:

#### ViewContextService:
```php
// Set extends relationship
$context->setExtendsForView('web.about', 'layouts.base');

// Get extends info
$extendsView = $context->getExtendsForView('web.about');

// Set origin for layout
$context->setOriginForExtends('layouts.base', 'web.about', 'about-456');

// Get origin view
$origin = $context->getOriginView('layouts.base');
```

## ✅ Features

1. **Tự động**: Không cần thay đổi code views hiện tại
2. **Không override**: Không override Laravel directives
3. **Performance**: Highly optimized với static cache
4. **Octane-ready**: Perfect cho Laravel Octane
5. **Minimal overhead**: ~0ms sau first request

## 📝 Examples

### Example 1: Simple Include

```php
// home.blade.php
<div>
    @include('header')
</div>

// header.blade.php
<header>
    Parent: {{ $__PARENT_VIEW_PATH__ }}
    Parent ID: {{ $__PARENT_VIEW_ID__ }}
</header>
```

Output:
```
Parent: web.home
Parent ID: home-123
```

### Example 2: Layout with Origin

```php
// about.blade.php
@extends('layouts.app')
@section('content')
    <h1>About</h1>
@endsection

// layouts/app.blade.php
<html>
<head>
    <title>{{ $__ORIGIN_VIEW_PATH__ }}</title>
</head>
<body>
    @yield('content')
</body>
</html>
```

Output:
```html
<title>web.about</title>
```

## 🔍 Debugging

Để debug view context:

```php
// In any view
<pre>
View: {{ $__VIEW_PATH__ }}
ID: {{ $__VIEW_ID__ }}
Parent: {{ $__PARENT_VIEW_PATH__ ?? 'N/A' }}
Origin: {{ $__ORIGIN_VIEW_PATH__ ?? 'N/A' }}
</pre>
```

## 🎯 Use Cases

1. **Conditional rendering**: Hiển thị khác nhau dựa trên parent view
2. **Component tracking**: Track component hierarchy
3. **Debug info**: Hiển thị view hierarchy để debug
4. **Analytics**: Track view usage patterns
5. **Dynamic behavior**: Views có thể adapt dựa trên context
