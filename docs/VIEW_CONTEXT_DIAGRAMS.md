# View Context System - Visual Diagrams

## 📊 Case 1: @include Relationship

```
┌─────────────────────────┐
│   web.home.blade.php    │
│  (__VIEW_PATH__: web.home) │
│  (ID: home-123)         │
└───────────┬─────────────┘
            │
            │ @include('partials.header')
            │
            ▼
┌─────────────────────────┐
│  partials.header        │
│  ✅ __PARENT_VIEW_PATH__ = web.home
│  ✅ __PARENT_VIEW_ID__ = home-123
└─────────────────────────┘

Relationship: PARENT-CHILD (từ @include)
```

## 📊 Case 2: @extends Relationship

```
┌─────────────────────────┐
│  web.about.blade.php    │
│  (__VIEW_PATH__: web.about) │
│  (ID: about-456)        │
│  ❌ NO __PARENT_VIEW_PATH__ (vì dùng @extends)
└───────────┬─────────────┘
            │
            │ @extends('layouts.base')
            │
            ▼
┌─────────────────────────┐
│   layouts.base          │
│  ✅ __ORIGIN_VIEW_PATH__ = web.about
│  ✅ __ORIGIN_VIEW_ID__ = about-456
│  ❌ NO children
│  ❌ NO __PARENT_VIEW_PATH__
└─────────────────────────┘

Relationship: ORIGIN (từ @extends)
Note: Không phải parent-child!
```

## 📊 Case 3: Complex (@extends + @include)

### Scenario: Layout @include children

```
Flow:
  web.user-detail @extends('layouts.base')
  layouts.base @include('templates.ga-js')

Laravel render order:
  1. layouts.base (được extends)
  2. templates.ga-js (được include)
  3. web.user-detail
```

### Diagram:

```
┌─────────────────────────┐
│  templates.ga-js        │
│  ❌ NO __PARENT_VIEW_PATH__ (parent là layout)
└─────────────────────────┘
            ↑
            │ @include (SKIPPED - parent is layout being extended)
            │
┌─────────────────────────┐
│   layouts.base          │
│  ✅ __ORIGIN_VIEW_PATH__ = web.user-detail
│  ✅ __ORIGIN_VIEW_ID__ = user-789
│  ❌ NO __PARENT_VIEW_PATH__
│  ❌ NO children
└─────────────────────────┘
            ↑
            │ @extends
            │
┌─────────────────────────┐
│  web.user-detail        │
│  ❌ NO __PARENT_VIEW_PATH__ (có @extends)
└─────────────────────────┘

Key Rule: Layout được extends là "ranh giới"
- Layout KHÔNG nhận parent
- Views include từ layout KHÔNG nhận parent
```

```
┌─────────────────────────┐
│   layouts.base          │
│  ✅ __ORIGIN_VIEW_PATH__ = web.about
│  ✅ __ORIGIN_VIEW_ID__ = about-456
│  ❌ NO children
└─────────────────────────┘
            ▲
            │
            │ @extends
            │
┌───────────┴─────────────┐
│  web.about.blade.php    │
│  ❌ NO __PARENT_VIEW_PATH__ (vì có @extends)
└───────────┬─────────────┘
            │
            │ @include('partials.sidebar')
            │
            ▼
┌─────────────────────────┐
│  partials.sidebar       │
│  ✅ __PARENT_VIEW_PATH__ = web.about
│  ✅ __PARENT_VIEW_ID__ = about-456
└─────────────────────────┘

Relationships:
- web.about → layouts.base: ORIGIN (extends)
- web.about → partials.sidebar: PARENT (include)
```

## 🔄 Flow Diagram: Laravel Render Order

### Scenario: about.blade.php @extends('layouts.base')

```
Step 1: Laravel detects @extends
┌──────────────────────────┐
│ Parse: web.about         │
│ Found: @extends('layouts.base') │
└──────────┬───────────────┘
           │
           ▼
Step 2: Laravel renders LAYOUT FIRST
┌──────────────────────────┐
│ Render: layouts.base     │
│ Stack: [layouts.base]    │
│ Current view: layouts.base │
└──────────┬───────────────┘
           │
           ▼
Step 3: Render child view
┌──────────────────────────┐
│ Render: web.about        │
│ Stack: [layouts.base, web.about] │
│ Current view: web.about  │
│                          │
│ Check: Has @extends? YES │
│ → Skip set parent ✅     │
│ → Set origin for layout ✅ │
└──────────────────────────┘
```

## 🎯 Decision Flow

```
┌─────────────────────┐
│  View được render   │
└──────────┬──────────┘
           │
           ▼
    ┌─────────────┐
    │ Có @extends? │
    └──────┬──────┘
           │
     ┌─────┴─────┐
     │YES        │NO
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ Skip    │  │ Có current   │
│ parent  │  │ view?        │
└────┬────┘  └──────┬───────┘
     │              │
     │         ┌────┴────┐
     │         │YES     │NO
     │         ▼        ▼
     │    ┌────────┐ ┌─────────┐
     │    │ Set    │ │ Root    │
     │    │ parent │ │ view    │
     │    └────────┘ └─────────┘
     │
     ▼
┌─────────────┐
│ Set origin  │
│ cho layout  │
└─────────────┘
```

## 📝 Variables Comparison Table

| View Type | @include | @extends | Layout được extends |
|-----------|----------|----------|---------------------|
| `__VIEW_ID__` | ✅ | ✅ | ✅ |
| `__VIEW_PATH__` | ✅ | ✅ | ✅ |
| `__PARENT_VIEW_PATH__` | ✅ | ❌ | ❌ |
| `__PARENT_VIEW_ID__` | ✅ | ❌ | ❌ |
| `__ORIGIN_VIEW_PATH__` | ❌ | ❌ | ✅ |
| `__ORIGIN_VIEW_ID__` | ❌ | ❌ | ✅ |
| Children tracking | ✅ | ❌ | ❌ |

## 🔍 Example Real Use Cases

### Use Case 1: Track component hierarchy
```php
// header.blade.php
@if(isset($__PARENT_VIEW_PATH__))
    <div class="breadcrumb">
        {{ $__PARENT_VIEW_PATH__ }} > {{ $__VIEW_PATH__ }}
    </div>
@endif
```

### Use Case 2: Layout-specific behavior
```php
// layouts/base.blade.php
@if(isset($__ORIGIN_VIEW_PATH__))
    <title>{{ ucfirst($__ORIGIN_VIEW_PATH__) }}</title>
    
    <!-- Load page-specific assets based on origin -->
    @if(str_contains($__ORIGIN_VIEW_PATH__, 'admin'))
        <link href="/css/admin.css" rel="stylesheet">
    @endif
@endif
```

### Use Case 3: Conditional rendering
```php
// sidebar.blade.php
@if(isset($__PARENT_VIEW_PATH__))
    @if($__PARENT_VIEW_PATH__ === 'web.home')
        <!-- Show home-specific sidebar -->
    @elseif($__PARENT_VIEW_PATH__ === 'web.about')
        <!-- Show about-specific sidebar -->
    @endif
@endif
```

## 🎨 Visual Summary

```
┌─────────────────────────────────────────────┐
│           VIEW CONTEXT SYSTEM                │
├─────────────────────────────────────────────┤
│                                             │
│  @include      →    PARENT-CHILD           │
│  ✅ Child nhận parent                       │
│  ✅ Parent có children list                 │
│                                             │
│  @extends      →    ORIGIN (not parent!)   │
│  ❌ Child KHÔNG nhận parent                 │
│  ✅ Layout nhận origin                      │
│  ❌ Layout KHÔNG có children                │
│                                             │
└─────────────────────────────────────────────┘
```
