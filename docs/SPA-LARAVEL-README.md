# 🚀 SPA Laravel Integration

Hệ thống SPA (Single Page Application) tích hợp với Laravel Blade, hỗ trợ Server-Side Rendering (SSR) và client-side routing.

## 📁 Cấu trúc Files

```
resources/views/
├── layouts/
│   └── base.blade.php          # Main layout với SPA integration
├── web/
│   ├── home.blade.php          # Home page
│   ├── about.blade.php         # About page
│   ├── users.blade.php         # Users list
│   ├── user-detail.blade.php   # User detail
│   └── contact.blade.php       # Contact page
└── ...

public/static/app/
├── core.js                    # SPA core functions
├── views.js                   # Compiled views
└── main.js                    # Main application bundle

src/modules/Web/
├── Http/Controllers/
│   └── Web/WebController.php  # Web controller
└── Providers/
    └── WebRouteServiceProvider.php  # Route registration
```

## 🚀 Cách sử dụng

### 1. Khởi động Laravel Server

```bash
php artisan serve
```

### 2. Compile Views (nếu cần)

```bash
php artisan blade:compile
# hoặc
php artisan views:compile web resources/views
# hoặc
npm run compile
```

### 3. Truy cập Demo

- **Demo Page**: `http://localhost:8000/spa-laravel-demo.html`
- **Home Page**: `http://localhost:8000/web`
- **About Page**: `http://localhost:8000/web/about`
- **Users Page**: `http://localhost:8000/web/users`
- **User Detail**: `http://localhost:8000/web/users/1`
- **Contact Page**: `http://localhost:8000/web/contact`

## 🔧 Features

### Server-Side Rendering (SSR)
- Laravel renders toàn bộ HTML với `data-server-rendered="true"`
- SPA detects server-rendered content
- SPA takes over và handles routing
- Content updates without page reload

### SPA Router
- History API routing
- Automatic link interception
- Route parameters (`/users/:id`)
- Route guards (beforeEach, afterEach)
- Lifecycle hooks (onEnter, onLeave)

### Subscribe System
- Dynamic content updates
- Sidebar content: `spa-yield-content="sidebar"`
- Dynamic attributes: `spa-yield-attr="class:pageClass,data-theme:theme"`

### Blade Directives
- `@serverside` / `@endserverside`: Server-side rendering
- `@subscribe`: Subscribe to dynamic content
- `@yieldAttr`: Dynamic attributes
- `@viewId`: Unique view ID

## 📝 Tạo View Mới

### 1. Tạo Blade View

```blade
@extends('layouts.base')

@section('document.body')
<div class="container">
    <div class="page">
        <h1>My New Page</h1>
        <p>Content here...</p>
    </div>
</div>
@endsection
```

### 2. Thêm Route trong RouteServiceProvider

```php
// src/modules/Web/Providers/WebRouteServiceProvider.php
use Core\System;
use Modules\Web\Http\Controllers\Web\WebController;

System::context('web')
    ->module(['slug' => 'web', 'prefix' => '/web'])
    ->controller(WebController::class)
    ->group(function ($module) {
        $module->get('/my-page', 'myPage')
            ->name('my-page')
            ->view('web.my-page');
    });
```

### 3. Thêm Controller Method

```php
// src/modules/Web/Http/Controllers/Web/WebController.php
public function myPage()
{
    return view('web.my-page');
}
```

### 4. Compile Views

```bash
php artisan blade:compile
# hoặc
npm run compile
```

### 5. Thêm Route vào SPA Router

```javascript
// resources/views/layouts/base.blade.php
const router = new SPARouter({
    routes: [
        // ... existing routes
        { path: '/web/my-page', component: 'my-page' }
    ],
    // ...
});
```

## 🎯 Test Scenarios

1. **Initial Load**: Truy cập `/web` để xem SSR
2. **Navigation**: Click các nav links để test SPA routing
3. **Dynamic Content**: Xem sidebar và dynamic attributes update
4. **Parameters**: Test `/web/users/1` với route parameters
5. **Back/Forward**: Test browser navigation
6. **Direct URLs**: Test truy cập trực tiếp các URLs

## 🐛 Debug

Mở Developer Tools (F12) để xem:
- Console logs từ SPA Router
- Network requests từ HttpService
- SPA state changes
- Subscribe system updates

## 📚 Documentation

- [SPA Core Functions](public/build/README.md)
- [SPARouter Documentation](public/build/SPARouter-README.md)
- [HttpService Documentation](public/build/HttpService-README.md)

## 🔄 Workflow

1. **Development**: Tạo Blade views với các custom directives (`@vars`, `@subscribe`, `@click`, etc.)
2. **Compilation**: Chạy `php artisan blade:compile` hoặc `npm run compile`
3. **Testing**: Test với Laravel server (`php artisan serve`)
4. **Production**: Deploy với compiled JavaScript trong `public/static/app/`

## ⚡ Performance

- **SSR**: Fast initial page load
- **SPA**: Smooth navigation
- **Hybrid**: Best of both worlds
- **SEO**: Search engine friendly

## 🎨 Styling

- Responsive design
- Modern UI components
- CSS Grid và Flexbox
- Smooth transitions
- Active link highlighting

## 🔐 Security

- CSRF protection
- XSS prevention
- Input validation
- Secure routing

## 📱 Mobile Support

- Responsive design
- Touch-friendly navigation
- Mobile-optimized forms
- Progressive enhancement

## 🚀 Next Steps

1. Add authentication
2. Implement API endpoints
3. Add form validation
4. Implement caching
5. Add testing
6. Deploy to production

---

**Happy Coding! 🎉**
