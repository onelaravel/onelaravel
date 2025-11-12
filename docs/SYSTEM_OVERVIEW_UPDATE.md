# 📋 Tổng Quan Hệ Thống - Cập Nhật

**Ngày cập nhật**: 2025-01-27  
**Phiên bản**: 2.0

---

## 🏗️ Kiến Trúc Hệ Thống

### 1. Kiến Trúc Modular + Multi-Context

Hệ thống được thiết kế theo kiến trúc **Modular + Multi-Context**, kết hợp Domain-Driven Design (DDD) và Modular Architecture.

#### Cấu Trúc Thư Mục:
```
app/
├── Contexts/           # Các context ở cấp hệ thống (Api, Web, Admin)
├── Modules/            # Các module chức năng (User, Post, etc.)
├── Core/               # AppServiceProvider, middleware global
├── Shared/             # Dùng chung (Traits, Interfaces, Base Classes)
└── Support/            # Helpers, Macros, Custom Validators

src/
├── core/               # Core system files
│   ├── Providers/      # Service providers
│   ├── Services/       # Core services
│   ├── Http/           # Middleware, View Composers
│   └── Support/        # SPA support, ViewState
├── modules/            # Business modules
├── contexts/           # Context definitions
└── templates/          # Template processors
```

### 2. Blade to JavaScript Compiler

Hệ thống compiler chuyển đổi Blade templates sang JavaScript để sử dụng trong SPA context.

#### Cấu Trúc Compiler:
```
scripts/
├── compiler/
│   ├── main_compiler.py          # Main compiler class
│   ├── parsers.py                # Directive parsers
│   ├── template_processor.py     # Template processing
│   ├── directive_processors.py   # Directive handlers
│   ├── declaration_tracker.py    # Track @vars, @let, @const, @useState
│   └── ...
├── build.py                      # Build orchestrator
└── compile.py                    # CLI compiler
```

---

## 🎯 Các Directive Đã Hỗ Trợ

### 1. Directive Cơ Bản (Laravel Standard)

#### @extends
```blade
@extends('layouts.app')
@extends('layouts.app', ['title' => 'Home'])
@extends($layout . 'base')
```
**Output**: Tạo `parent` property và `SPA.View.extendView()` call

#### @section/@endsection
```blade
@section('content')
    <h1>{{ $title }}</h1>
@endsection

@section('title', $pageTitle)  # Short section
```
**Output**: `SPA.View.section('name', content)`

#### @yield
```blade
<h1>@yield('title')</h1>
<p>@yield('content', 'Default')</p>
```
**Output**: `${SPA.View.yield('name', defaultValue)}`

#### @include/@includeIf
```blade
@include('partials.header')
@include('partials.footer', ['year' => 2024])
@includeIf('partials.special', ['data' => $data])
```
**Output**: `${SPA.View.include('name', data)}`

#### @if/@elseif/@else/@endif
```blade
@if($user)
    <h1>Hello {{ $user->name }}</h1>
@elseif($guest)
    <h1>Welcome Guest</h1>
@else
    <h1>Please Login</h1>
@endif
```
**Output**: `${SPA.View.execute(() => { if(...) return ... })`

#### @foreach/@endforeach
```blade
@foreach($users as $id => $user)
    <li>{{ $id }}: {{ $user->name }}</li>
@endforeach
```
**Output**: `${SPA.View.foreach(users, (user, id) => { return ... })}`

#### @for/@endfor
```blade
@for($i = 0; $i < 10; $i++)
    <span>Item {{ $i }}</span>
@endfor
```
**Output**: `${SPA.View.execute(() => { for(...) { ... } })}`

#### @while/@endwhile
```blade
@while($condition)
    <p>Loop content</p>
@endwhile
```
**Output**: `${SPA.View.execute(() => { while(...) { ... } })}`

#### @switch/@case/@default/@endswitch
```blade
@switch($status)
    @case('active')
        <span class="active">Active</span>
        @break
    @default
        <span>Unknown</span>
@endswitch
```
**Output**: `${SPA.View.execute(() => { switch(...) { ... } })}`

#### @php/@endphp
```blade
@php
    $count = count($users);
    $total = $count * 2;
@endphp
```
**Output**: `${SPA.View.execute(() => { ... })}`

---

### 2. Directive Tùy Chỉnh - State Management

#### @vars
```blade
@vars($users = [], $title = 'Test', $abc = 'ABC')
@vars($config = ['host' => 'localhost', 'port' => 3306])
@vars({$user, $title, $count})
```
**Output**: 
```javascript
const { users = [], title = 'Test', abc = 'ABC' } = __$spaViewData$__ || {};
```

#### @let
```blade
@let($count = 0)
@let($user = null, $title = 'Home')
@let([$count, $setCount] = useState(0))
@let({$name, $email} = $user)
```
**Output**: 
```javascript
let count = 0;
let user = null, title = 'Home';
let [count, setCount] = useState(0);
let {name, email} = user;
```

#### @const
```blade
@const($API_URL = 'https://api.example.com')
@const($config = ['env' => 'production'])
```
**Output**: 
```javascript
const API_URL = 'https://api.example.com';
const config = {env: 'production'};
```

#### @useState
```blade
@useState($count = 0)
@useState([$user, $setUser] = useState(null))
```
**Output**: 
```javascript
let [count, setCount] = useState(0);
let [user, setUser] = useState(null);
```

**Lưu ý**: `@useState` được xử lý tương tự `@let` nhưng với `useState()` wrapper.

---

### 3. Directive Tùy Chỉnh - Template & Layout

#### @yieldAttr
```blade
<div @yieldAttr('class', 'containerClass')>
    <input @yieldAttr('value', 'inputValue') @yieldAttr('placeholder', 'inputPlaceholder')>
</div>
```
**Output**: 
```html
<div class="${SPA.View.yield('containerClass')}" spa-yield-attr="class:containerClass">
    <input value="${SPA.View.yield('inputValue')}" spa-yield-attr="value:inputValue" 
           placeholder="${SPA.View.yield('inputPlaceholder')}" spa-yield-attr="placeholder:inputPlaceholder">
</div>
```

#### @subscribe (Simple Syntax)
```blade
<div @subscribe('contentKey', 'content')>
    <span @subscribe('classKey', 'attr', 'class')>
</div>
```
**Output**: 
```html
<div spa-yield-subscribe-key="contentKey" spa-yield-subscribe-target="content">
    <span spa-yield-subscribe-key="classKey" spa-yield-subscribe-target="attr" spa-yield-subscribe-attr="class">
</div>
```

#### @subscribe (Array Syntax)
```blade
<div @subscribe(['class' => 'classKey', '#content' => 'contentKey', '#children' => 'childrenKey'])>
</div>
```
**Output**: 
```html
<div spa-yield-attr="class:classKey" spa-yield-content="contentKey" spa-yield-children="childrenKey">
</div>
```

**Special Keys** (bắt đầu bằng `#`):
- `#content` → `spa-yield-content="key"`
- `#children` → `spa-yield-children="key"`
- `#title` → `spa-yield-title="key"`
- Regular keys → `spa-yield-attr="key1:value1,key2:value2"`

---

### 4. Directive Tùy Chỉnh - Reactive & Events

#### @follow/@watch
```blade
@follow($count, $username)
    <div>Count: {{ $count }}, User: {{ $username }}</div>
@endfollow
```
**Output**: Reactive block tự động re-render khi state thay đổi

#### @block/@endblock
```blade
@block('sidebar')
    <aside>Sidebar content</aside>
@endblock
```
**Output**: Block definition để sử dụng với `@useblock`

#### @useblock
```blade
@useblock('sidebar')
```
**Output**: Sử dụng block đã định nghĩa

#### @onblock
```blade
@onblock('sidebar', function($content) {
    return '<div class="wrapper">' . $content . '</div>';
})
```
**Output**: Wrap block content với function

#### @event/@click/@input/@submit
```blade
<button @click="handleClick($event, 'test')">Click me</button>
<input @input="handleInput($event, 'username')">
<form @submit="handleSubmit($event)">
```
**Output**: Tự động attach event handlers với proper binding

---

### 5. Directive Tùy Chỉnh - Lifecycle & Setup

#### @onInit/@endOnInit
```blade
@onInit($__VIEW_ID__)
<script>
    SPA.query('.' + __VIEW_ID__).forEach(element => {
        console.log('Init', element);
    });
</script>
@endOnInit
```
**Output**: Code được thêm vào `init` function của view object

#### @register/@setup/@script
```blade
@register
<script>
    // Global setup code
    console.log('View registered');
</script>
@endregister
```
**Output**: Code được thêm vào global setup

#### @await
```blade
@await('client')
    <div>Loading...</div>
@endawait
```
**Output**: Tạo `prerender` function cho loading states

---

### 6. Directive Tùy Chỉnh - Server/Client Side

#### @serverside/@endserverside
```blade
@serverside
    <div>Server only content</div>
@endserverside
```
**Output**: Content bị loại bỏ trong JS compilation

#### @clientside/@endclientside
```blade
@clientside
    <div>Client only content</div>
@endclientside
```
**Output**: Content chỉ hiển thị trong client-side rendering

**Aliases**: `@serverSide`, `@SSR`, `@useSSR`, `@clientSide`, `@CSR`, `@useCSR`

---

### 7. Directive Tùy Chỉnh - Advanced

#### @wrapper/@wrap
```blade
@wrapper('div', ['class' => 'container'])
    Content here
@endwrapper
```
**Output**: Wrap content với element và attributes

#### @binding
```blade
<input @binding="username" type="text">
```
**Output**: Two-way data binding

#### @viewType
```blade
@viewType('component')
```
**Output**: Set view type (view, component, layout, etc.)

---

## 🔄 View Context System

### Tự Động Inject Biến Context

Hệ thống tự động inject các biến context vào views:

#### Mọi View Nhận:
- `__VIEW_ID__`: Unique ID cho view instance
- `__VIEW_PATH__`: Tên view (VD: 'web.home')
- `__VIEW_NAME__`: Alias của __VIEW_PATH__
- `__VIEW_TYPE__`: Loại view (mặc định: 'view')

#### View Được @include Nhận Thêm:
- `__PARENT_VIEW_PATH__`: Tên view gọi @include
- `__PARENT_VIEW_ID__`: ID của view gọi @include

#### Layout Được @extends Nhận Thêm:
- `__ORIGIN_VIEW_PATH__`: Tên view gọi @extends
- `__ORIGIN_VIEW_ID__`: ID của view gọi @extends

**Lưu ý**: View có `@extends` sẽ KHÔNG nhận parent!

---

## 🎨 Observable System

Hệ thống quản lý dữ liệu reactive giống Vue.js.

### Core Features:
- ✅ **Reactive Data Binding** - Tự động theo dõi và cập nhật
- ✅ **Computed Properties** - Cached computed values
- ✅ **Deep Watching** - Theo dõi nested objects/arrays
- ✅ **Lifecycle Hooks** - created, updated, destroyed
- ✅ **Performance Optimized** - Batched updates, efficient tracking

### Usage:
```javascript
// Create observable
const obs = new Observable({
    message: 'Hello World',
    count: 0,
    user: { name: 'John', age: 25 }
}, {
    name: 'MyStore'
});

// Watch changes
const unwatch = obs.$watch('count', (newVal, oldVal) => {
    console.log(`Count: ${oldVal} -> ${newVal}`);
});

// Make changes - triggers watcher
obs.count = 5;
```

### Computed Properties:
```javascript
const obs = new Observable({
    firstName: 'John',
    lastName: 'Doe'
}, {
    computed: {
        fullName() {
            return `${this.firstName} ${this.lastName}`;
        }
    }
});

console.log(obs.fullName); // "John Doe"
obs.firstName = 'Jane';
console.log(obs.fullName); // "Jane Doe" - auto updated
```

---

## 🚀 SSR Hydration System

### Phase 1: Foundation (✅ Completed)

#### Features:
- ✅ DOM scanning infrastructure
- ✅ Event handler attachment
- ✅ State subscription system
- ✅ Memory management
- ✅ OneMarkup integration

#### Key Methods:
- `__scan(config)` - Main hydration method
- `__scanDOMElements(viewId)` - Find and store DOM elements
- `__attachEventHandlers(events, viewId)` - Attach event listeners
- `__setupFollowingBlocks(following, viewId)` - Setup reactive blocks
- `__storeChildrenReferences(children)` - Store children
- `__rerenderFollowBlock(followId, followBlock)` - Re-render block

### Phase 2: Router Integration (🔄 In Progress)

#### Objectives:
- Complete `hydrateViews()` implementation in Router
- Add SSR detection in `handleRoute()`
- Implement graceful fallback to CSR
- Add view validation
- Handle navigation after hydration

### Critical Fixes (✅ Completed)

#### 1. Event Lifecycle Order
- ✅ Fixed: Bottom-up mounting order (deepest → shallowest)
- ✅ Method: `mountAllViewsBottomUp()` và `mountAllViewsFromStack()`

#### 2. Super View Scanning
- ✅ Fixed: Scan all views in extends chain
- ✅ Layout views now properly scanned and hydrated

---

## 📁 File Structure

### Core System Files:
```
src/core/
├── Providers/
│   ├── BladeDirectiveServiceProvider.php  # Register all directives
│   ├── ViewContextServiceProvider.php     # View context injection
│   └── OneServiceProvider.php
├── Services/
│   ├── BladeCompilers/                    # Directive services
│   │   ├── SubscribeDirectiveService.php
│   │   ├── YieldDirectiveService.php
│   │   ├── BindingDirectiveService.php
│   │   ├── BlockDirectiveService.php
│   │   ├── FollowDirectiveService.php
│   │   └── ...
│   ├── ViewContextService.php             # Context management
│   └── ViewHelperService.php
└── Support/
    ├── SPA.php                            # SPA helper class
    └── ViewState.php                      # State management
```

### Compiler Files:
```
scripts/compiler/
├── main_compiler.py                       # Main compiler
├── parsers.py                             # Directive parsers
├── template_processor.py                  # Template processing
├── directive_processors.py                # Directive handlers
├── declaration_tracker.py                 # Track declarations
├── binding_directive_service.py           # Binding handler
├── event_directive_processor.py           # Event handler
└── ...
```

### JavaScript Core:
```
resources/js/app/core/
├── View.js                                # Main view system
├── ViewEngine.js                          # View engine
├── Observable.js                          # Reactive system
└── ...
```

---

## 🔧 Build & Compilation

### Compile Views:
```bash
# Compile views for web scope
python3 build.py web resources/views

# Compile views for admin scope
python3 build.py admin resources/views

# Compile views for spa scope
python3 build.py spa resources/views
```

### Output Files:
- `public/static/spa/scopes/web.js` - Web scope
- `public/static/spa/scopes/admin.js` - Admin scope
- `public/static/spa/spa.view.templates.js` - Final merged output

### Laravel Command:
```bash
# Compile views using Laravel command
php artisan views:compile {scope} {path} [--output=path]

# Example
php artisan views:compile web resources/views
```

---

## 📊 Directive Summary Table

| Directive | Type | Status | Description |
|-----------|------|--------|-------------|
| `@extends` | Layout | ✅ | Extend layout |
| `@section` | Layout | ✅ | Define section |
| `@yield` | Layout | ✅ | Yield section |
| `@include` | Include | ✅ | Include view |
| `@if/@else` | Control | ✅ | Conditional |
| `@foreach` | Loop | ✅ | Loop through array |
| `@for` | Loop | ✅ | For loop |
| `@while` | Loop | ✅ | While loop |
| `@switch` | Control | ✅ | Switch statement |
| `@php` | Code | ✅ | PHP code block |
| `@vars` | State | ✅ | Variable declarations |
| `@let` | State | ✅ | Let declarations |
| `@const` | State | ✅ | Const declarations |
| `@useState` | State | ✅ | React-like state |
| `@yieldAttr` | Template | ✅ | Yield attribute |
| `@subscribe` | Template | ✅ | Subscribe to yield |
| `@follow` | Reactive | ✅ | Reactive block |
| `@block` | Template | ✅ | Block definition |
| `@useblock` | Template | ✅ | Use block |
| `@onblock` | Template | ✅ | Wrap block |
| `@event/@click` | Event | ✅ | Event handlers |
| `@onInit` | Lifecycle | ✅ | Init code |
| `@register` | Setup | ✅ | Global setup |
| `@await` | Async | ✅ | Async loading |
| `@serverside` | Render | ✅ | Server-only |
| `@clientside` | Render | ✅ | Client-only |
| `@wrapper` | Template | ✅ | Wrap content |
| `@binding` | Data | ✅ | Two-way binding |
| `@viewType` | Meta | ✅ | Set view type |

---

## 🎯 Next Steps

### Immediate Tasks:
1. ✅ Complete directive documentation
2. 🔄 Router hydration integration
3. 🔄 Testing và validation
4. 🔄 Performance optimization

### Future Enhancements:
- [ ] TypeScript support
- [ ] Source maps
- [ ] Hot module replacement
- [ ] Advanced caching strategies
- [ ] Progressive hydration
- [ ] Partial hydration

---

## 📚 Documentation Files

### Main Documentation:
- `ARCHITECTURE.md` - System architecture
- `BLADE_TO_JS_COMPILER_REQUIREMENTS.md` - Compiler requirements
- `VIEW_CONTEXT_SYSTEM.md` - View context system
- `OBSERVABLE_SYSTEM_README.md` - Observable system
- `CRITICAL_FIXES_COMPLETION.md` - Critical fixes report
- `PHASE_1_COMPLETION_REPORT.md` - Phase 1 completion

### Directive Documentation:
- `directive.md` - Directive examples
- `SUBSCRIBE_DIRECTIVE_SUMMARY.md` - @subscribe directive
- `SUBSCRIBE_ARRAY_DIRECTIVE_SUMMARY.md` - @subscribe array syntax
- `YIELDATTR_DIRECTIVE_SUMMARY.md` - @yieldAttr directive
- `BLADE_COMPILER_SUMMARY.md` - Compiler summary

---

**Tài liệu này được cập nhật thường xuyên để phản ánh các thay đổi trong hệ thống.**



