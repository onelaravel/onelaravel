# Fix: View Context - @extends và @include Logic

## 🐛 Vấn đề ban đầu

View có `@extends` đang **SAI** nhận `__PARENT_VIEW_PATH__` và layout cũng bị add children.

### Ví dụ vấn đề:

```php
// web/about.blade.php
@extends('layouts.base')
```

**SAI (trước khi fix):**
- ❌ `web.about` nhận `__PARENT_VIEW_PATH__ = 'layouts.base'`
- ❌ `layouts.base` nhận children là `web.about`

**ĐÚNG (sau khi fix):**
- ✅ `web.about` KHÔNG nhận parent (vì dùng @extends, không phải @include)
- ✅ `layouts.base` chỉ nhận `__ORIGIN_VIEW_PATH__ = 'web.about'`, không nhận children

## 🔧 Nguyên nhân

Khi Laravel render view có `@extends`, nó render **layout TRƯỚC**, rồi mới render **child view**:

1. Render `layouts.base` → Push vào stack
2. Render `web.about` → Current view = `layouts.base`
3. Logic cũ: Set `web.about.__PARENT_VIEW_PATH__ = layouts.base` ❌

Đây là SAI vì `web.about` **extend** layout, không phải **include** layout!

## ✅ Giải pháp

### 1. Skip set parent nếu view có @extends

```php
// TRƯỚC (SAI):
if ($currentView) {
    $view->with('__PARENT_VIEW_PATH__', $currentView['view']);
}

// SAU (ĐÚNG):
if ($currentView && !$extendsView) {
    // Chỉ set parent nếu KHÔNG có @extends
    $view->with('__PARENT_VIEW_PATH__', $currentView['view']);
}
```

### 2. Layout không nhận children

```php
// Layout chỉ nhận ORIGIN, không nhận parent/children
$origin = $context->getOriginView($viewName);
if ($origin) {
    $view->with('__ORIGIN_VIEW_PATH__', $origin['view']);
    $view->with('__ORIGIN_VIEW_ID__', $origin['id']);
    // KHÔNG set parent/children cho layout
}
```

## 📊 Logic Decision Tree

```
View được render:
├─ Có @extends?
│  ├─ YES → Skip set parent ✅
│  │       → Set origin cho layout ✅
│  └─ NO → Có current view?
│          ├─ YES → Set parent (đây là @include) ✅
│          └─ NO → Root view, không có parent ✅
│
└─ Là layout được extends?
   └─ YES → Nhận origin, KHÔNG nhận children ✅
```

## 🧪 Test Cases

### ✅ Test 1: View có @extends KHÔNG nhận parent
```php
// web/about.blade.php
@extends('layouts.base')

// Kết quả:
// web.about: KHÔNG có __PARENT_VIEW_PATH__ ✅
// layouts.base: có __ORIGIN_VIEW_PATH__ = 'web.about' ✅
```

### ✅ Test 2: View được @include nhận parent
```php
// web/home.blade.php
@include('partials.header')

// Kết quả:
// partials.header: có __PARENT_VIEW_PATH__ = 'web.home' ✅
```

### ✅ Test 3: Layout KHÔNG nhận children
```php
// web/about.blade.php
@extends('layouts.base')

// Kết quả:
// layouts.base: KHÔNG có children ✅
// layouts.base: chỉ có __ORIGIN_VIEW_PATH__ ✅
```

### ✅ Test 4: Complex - @extends + @include
```php
// web/about.blade.php
@extends('layouts.base')
@include('partials.sidebar')

// Kết quả:
// web.about: KHÔNG có parent ✅
// layouts.base: có origin = 'web.about', KHÔNG có children ✅
// partials.sidebar: có parent = 'web.about' ✅
```

## 📝 Code Changes

### File: `src/core/Providers/ViewContextServiceProvider.php`

**Change 1: Skip parent nếu có @extends**
```php
// Line 63: Thêm check !$extendsView
if ($currentView && !$extendsView) {
    // Chỉ set parent cho @include, không phải @extends
    $view->with('__PARENT_VIEW_PATH__', $currentView['view']);
    $view->with('__PARENT_VIEW_ID__', $currentView['id']);
}
```

**Change 2: Layout không nhận children**
```php
// Line 77-87: Thêm comment rõ ràng
$origin = $context->getOriginView($viewName);
if ($origin) {
    $view->with('__ORIGIN_VIEW_PATH__', $origin['view']);
    $view->with('__ORIGIN_VIEW_ID__', $origin['id']);
    // KHÔNG set parent/children cho layout
}
```

## ✨ Kết quả

### Trước khi fix:
- ❌ View với @extends nhận parent (sai)
- ❌ Layout nhận children (sai)
- ❌ Logic không phân biệt @include và @extends

### Sau khi fix:
- ✅ View với @extends KHÔNG nhận parent (đúng)
- ✅ Layout chỉ nhận origin, không nhận children (đúng)
- ✅ Logic phân biệt rõ ràng @include và @extends
- ✅ All tests passed!

## 🎯 Tóm tắt Rules

1. **@include**: View được include → Nhận parent
2. **@extends**: View có extends → KHÔNG nhận parent
3. **Layout**: Được extends → Nhận origin, KHÔNG nhận children
4. **Root view**: View đầu tiên → KHÔNG có parent

**→ Hệ thống hoạt động chính xác theo yêu cầu!** ✅
