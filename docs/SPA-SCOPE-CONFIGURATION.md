# 🔧 SPA Scope Configuration

## Cấu hình Scope từ Server-side

### Cách hoạt động

Thay vì loop qua tất cả scopes, SPA Router sẽ chỉ tìm view trong scope được chỉ định từ server:

1. **Server set scope** trong master view: `window.SPA_SCOPE = 'web'`
2. **SPA Router** chỉ tìm view trong scope được chỉ định
3. **Performance tốt hơn** và logic rõ ràng hơn

### Cấu trúc

```
resources/views/
├── layouts/
│   ├── base.blade.php          # Web scope layout
│   └── admin.blade.php         # Admin scope layout
├── web/
│   ├── home.blade.php          # Web views
│   └── about.blade.php
└── admin/
    ├── dashboard.blade.php     # Admin views
    └── users.blade.php
```

## Master View Configuration

### Web Layout (base.blade.php)

```blade
@serverside
    <!DOCTYPE html>
    <html>
    <head>
        <title>SPA Web Application</title>
    </head>
    <body>
        <div id="spa-root" data-server-rendered="true">
@endserverside
            <!-- Web content -->
            <div id="layout-content" data-spa-content="main">
                @yield('document.body')
            </div>
@serverside
        </div>
        
        <!-- SPA Scripts -->
        <script src="{{ asset('build/spa.js') }}"></script>
        <script src="{{ asset('build/spa.views.js') }}"></script>
        <script src="{{ asset('build/SPARouter.js') }}"></script>
        
        <!-- SPA Configuration -->
        <script>
            // Set SPA scope from server
            window.SPA_SCOPE = '{{ $spa_scope ?? 'web' }}';
            console.log('🔧 SPA: Scope set to:', window.SPA_SCOPE);
        </script>
        
        <!-- SPA Initialization -->
        <script>
            const router = new SPARouter({
                routes: [
                    { path: '/web', component: 'web.home' },
                    { path: '/web/about', component: 'web.about' },
                    // ... web routes
                ],
                container: '#layout-content',
                mode: 'history'
            });
        </script>
    </body>
    </html>
@endserverside
```

### Admin Layout (admin.blade.php)

```blade
@serverside
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin Panel - SPA Application</title>
    </head>
    <body>
        <div id="spa-root" data-server-rendered="true">
@endserverside
            <!-- Admin content -->
            <div id="admin-content" data-spa-content="main">
                @yield('document.body')
            </div>
@serverside
        </div>
        
        <!-- SPA Scripts -->
        <script src="{{ asset('build/spa.js') }}"></script>
        <script src="{{ asset('build/spa.views.js') }}"></script>
        <script src="{{ asset('build/SPARouter.js') }}"></script>
        
        <!-- SPA Configuration -->
        <script>
            // Set SPA scope to admin
            window.SPA_SCOPE = 'admin';
            console.log('🔧 SPA: Scope set to:', window.SPA_SCOPE);
        </script>
        
        <!-- SPA Initialization -->
        <script>
            const router = new SPARouter({
                routes: [
                    { path: '/admin', component: 'admin.dashboard' },
                    { path: '/admin/users', component: 'admin.users' },
                    // ... admin routes
                ],
                container: '#admin-content',
                mode: 'history'
            });
        </script>
    </body>
    </html>
@endserverside
```

## Controller Configuration

### Web Controller

```php
<?php

namespace App\Http\Controllers;

class WebController extends Controller
{
    public function home()
    {
        return view('web.home', ['spa_scope' => 'web']);
    }
    
    public function about()
    {
        return view('web.about', ['spa_scope' => 'web']);
    }
}
```

### Admin Controller

```php
<?php

namespace App\Http\Controllers;

class AdminController extends Controller
{
    public function dashboard()
    {
        return view('admin.dashboard', ['spa_scope' => 'admin']);
    }
    
    public function users()
    {
        return view('admin.users', ['spa_scope' => 'admin']);
    }
}
```

## SPA Router Logic

### getView() Method

```javascript
getView(componentName) {
    if (typeof window !== 'undefined' && window.SPA && window.SPA.views) {
        // Get current scope from window.SPA_SCOPE (set by server)
        const currentScope = window.SPA_SCOPE || 'web';
        
        // Try current scope first
        if (window.SPA.views[currentScope] && window.SPA.views[currentScope][componentName]) {
            return window.SPA.views[currentScope][componentName];
        }
        
        // Fallback: try other scopes if not found in current scope
        const scopes = ['web', 'spa', 'admin'];
        for (const scope of scopes) {
            if (scope !== currentScope && window.SPA.views[scope] && window.SPA.views[scope][componentName]) {
                console.warn(`⚠️ SPARouter: View found in different scope (${scope}): ${componentName}`);
                return window.SPA.views[scope][componentName];
            }
        }
    }
    
    console.warn(`⚠️ SPARouter: View not found: ${componentName}`);
    return null;
}
```

## Compilation Process

### Build Commands

```bash
# Compile web scope
python3 build.py web resources/views

# Compile admin scope
python3 build.py admin resources/views

# Compile all scopes
python3 build.py web resources/views
python3 build.py admin resources/views
```

### Output Structure

```
public/build/
├── spa.views.js               # Combined views
└── scopes/
    ├── web.js                 # Web scope views
    └── admin.js               # Admin scope views
```

## Route Configuration

### Web Routes

```php
// routes/web.php
Route::prefix('web')->group(function () {
    Route::get('/', [WebController::class, 'home'])->name('web.home');
    Route::get('/about', [WebController::class, 'about'])->name('web.about');
    Route::get('/users', [WebController::class, 'users'])->name('web.users');
    Route::get('/users/{id}', [WebController::class, 'userDetail'])->name('web.user.detail');
    Route::get('/contact', [WebController::class, 'contact'])->name('web.contact');
});
```

### Admin Routes

```php
// routes/web.php
Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
});
```

## Benefits

### Performance

```javascript
// Before (loop through all scopes)
const scopes = ['web', 'spa', 'admin'];
for (const scope of scopes) {
    if (window.SPA.views[scope] && window.SPA.views[scope][componentName]) {
        return window.SPA.views[scope][componentName];
    }
}

// After (direct scope access)
const currentScope = window.SPA_SCOPE || 'web';
if (window.SPA.views[currentScope] && window.SPA.views[currentScope][componentName]) {
    return window.SPA.views[currentScope][componentName];
}
```

### Clarity

- **Server-side**: Scope được set rõ ràng trong master view
- **Client-side**: SPA Router biết chính xác scope nào để tìm
- **Maintainability**: Logic đơn giản và dễ hiểu

### Flexibility

- **Multiple Layouts**: Mỗi layout có thể set scope khác nhau
- **Dynamic Scope**: Scope có thể được set động từ controller
- **Fallback**: Vẫn có fallback nếu view không tìm thấy trong scope chính

## Examples

### Web Scope

```html
<!-- URL: /web -->
<!-- Layout: base.blade.php -->
<!-- Scope: web -->
<!-- Views: web.home, web.about, etc. -->
```

### Admin Scope

```html
<!-- URL: /admin -->
<!-- Layout: admin.blade.php -->
<!-- Scope: admin -->
<!-- Views: admin.dashboard, admin.users, etc. -->
```

## Debug Information

### Console Logs

```
🔧 SPA: Scope set to: web
🚀 SPARouter: Initializing...
🔄 SPARouter: Server-rendered page detected, taking over...
✅ SPARouter: View rendered successfully

// Hoặc cho admin:
🔧 SPA: Scope set to: admin
🚀 SPARouter: Initializing...
🔄 SPARouter: Server-rendered page detected, taking over...
✅ SPARouter: View rendered successfully
```

### Scope Detection

```javascript
// Check current scope
console.log('Current scope:', window.SPA_SCOPE);

// Check available views
console.log('Available views:', window.SPA.views);

// Check specific scope views
console.log('Web views:', window.SPA.views.web);
console.log('Admin views:', window.SPA.views.admin);
```

## Best Practices

### 1. Set Scope Early

```blade
<!-- Set scope before loading SPA scripts -->
<script>
    window.SPA_SCOPE = '{{ $spa_scope ?? 'web' }}';
</script>
<script src="{{ asset('build/spa.js') }}"></script>
<script src="{{ asset('build/SPARouter.js') }}"></script>
```

### 2. Use Consistent Naming

```php
// Controller
return view('admin.dashboard', ['spa_scope' => 'admin']);

// Layout
window.SPA_SCOPE = 'admin';

// Views
admin.dashboard, admin.users, admin.settings
```

### 3. Fallback Strategy

```javascript
// Always have fallback for missing views
if (!view) {
    console.warn(`View not found: ${componentName}`);
    // Show error page or redirect
}
```

## Summary

SPA Scope Configuration cho phép:

1. **Server-side scope setting** trong master views
2. **Direct scope access** thay vì loop qua tất cả scopes
3. **Better performance** và logic rõ ràng
4. **Flexible configuration** cho multiple layouts
5. **Easy maintenance** và debugging

Cách tiếp cận này đơn giản, hiệu quả và dễ hiểu hơn so với việc loop qua tất cả scopes.
