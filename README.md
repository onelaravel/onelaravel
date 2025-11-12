# One Laravel

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/onelaravel/onelaravel"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"></a>
<a href="https://github.com/onelaravel/onelaravel/blob/main/LICENSE"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
<a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-11.x-red.svg" alt="Laravel Version"></a>
</p>

## 📖 Giới thiệu

**One Laravel** là một framework Laravel SPA (Single Page Application) tiên tiến với kiến trúc **Modular + Multi-Context**, sử dụng **Blade to JavaScript compiler** độc đáo để tạo ra các ứng dụng web hiện đại, reactive và hiệu suất cao.

Dự án này kết hợp sức mạnh của Laravel backend với trải nghiệm người dùng mượt mà của SPA, đồng thời giữ được sự đơn giản và quen thuộc của Blade templates.

## ✨ Tính năng nổi bật

### 🎯 Kiến trúc Modular
- **Tổ chức code theo module**: Mỗi module là một đơn vị độc lập, dễ bảo trì và mở rộng
- **Hot reload**: Tự động reload khi code thay đổi
- **Dependency management**: Quản lý phụ thuộc giữa các module
- **Lazy loading**: Tải module theo nhu cầu để tối ưu hiệu suất

### 🔄 Multi-Context System
Hỗ trợ nhiều context khác nhau trong cùng một ứng dụng:
- **Web Context**: Giao diện người dùng chính
- **Admin Context**: Trang quản trị
- **API Context**: RESTful API endpoints
- **Custom Context**: Tạo context riêng theo nhu cầu

### ⚡ Blade to JavaScript Compiler
Công nghệ độc quyền biên dịch Blade templates thành JavaScript:
- Viết view bằng Blade syntax quen thuộc
- Tự động compile thành JavaScript reactive components
- Hỗ trợ tất cả Blade directives (`@if`, `@foreach`, `@component`, etc.)
- Custom directives (`@val`, `@bind`, `@subscribe`, `@yieldattr`, etc.)
- Server-Side Rendering (SSR) và Client-Side Hydration

### 🚀 Reactive System
Hệ thống reactive mạnh mẽ giống Vue.js:
- **Observable data**: Tự động cập nhật UI khi data thay đổi
- **Two-way binding**: `@bind` directive cho form inputs
- **Computed properties**: Tính toán tự động dựa trên data
- **Watchers**: Theo dõi sự thay đổi của data
- **Event system**: Pub/Sub pattern cho component communication

### 📦 Component-Based Architecture
- Tạo và tái sử dụng components dễ dàng
- Props và slots system
- Component lifecycle hooks
- Scoped styles và isolated state

### 🎨 Developer Experience
- **TypeScript support**: Type-safe JavaScript code
- **Hot Module Replacement (HMR)**: Cập nhật code không reload page
- **DevTools**: Debug tools cho reactive system
- **Comprehensive documentation**: Tài liệu chi tiết và ví dụ

## 🏗️ Kiến trúc hệ thống

```
onelaravel/
├── src/                      # Core source code
│   ├── core/                 # Core framework files
│   │   ├── Blade/           # Blade compiler engine
│   │   ├── Observable/      # Reactive system
│   │   └── View/            # View rendering engine
│   ├── contexts/            # Multi-context system
│   │   ├── Web/
│   │   ├── Admin/
│   │   └── Api/
│   ├── modules/             # Application modules
│   ├── templates/           # Base templates
│   └── shared/              # Shared utilities
├── resources/
│   ├── views/               # Blade templates
│   └── js/                  # JavaScript files
├── scripts/                 # Build scripts
│   ├── compiler/            # Python-based compiler
│   └── node/                # Node.js build tools
├── public/
│   └── static/              # Compiled static assets
└── docs/                    # Documentation
```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL >= 8.0 hoặc PostgreSQL >= 13
- Redis (optional, cho caching)

### Các bước cài đặt

1. **Clone repository**
```bash
git clone git@github.com:onelaravel/onelaravel.git
cd onelaravel
```

2. **Cài đặt PHP dependencies**
```bash
composer install
```

3. **Cài đặt Node.js dependencies**
```bash
npm install
```

4. **Cấu hình môi trường**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Cấu hình database trong `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=onelaravel
DB_USERNAME=root
DB_PASSWORD=
```

6. **Chạy migrations**
```bash
php artisan migrate
```

7. **Compile Blade templates**
```bash
php artisan blade:compile
# hoặc
npm run compile
```

8. **Start development server**
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Asset watcher
npm run dev
```

9. **Truy cập ứng dụng**
```
http://localhost:8000
```

## 🛠️ Sử dụng

### Tạo Component mới

1. **Tạo Blade component**
```blade
{{-- resources/views/components/counter.blade.php --}}
<div>
    <h2>Counter: {{$count}}</h2>
    <button @click(increment())>Increment</button>
    <button @click(decrement())>Decrement</button>
</div>

@script
export default {
    data() {
        return {
            count: 0
        }
    },
    methods: {
        increment() {
            this.count++
        },
        decrement() {
            this.count--
        }
    }
}
@endscript
```

2. **Compile component**
```bash
php artisan blade:compile
```

3. **Sử dụng component**
```blade
@component('components.counter')
@endcomponent
```

### Custom Directives

#### Event Directives
Xử lý các sự kiện DOM với syntax: `@event(handler(...))`

```blade
{{-- Click event --}}
<button @click(handleClick())>Click Me</button>

{{-- Event với tham số --}}
<button @click(deleteItem($item->id))>Delete</button>

{{-- Multiple events --}}
<input 
    @input(handleInput($event))
    @blur(validateField())
    @keyup(checkEnter($event))
/>

{{-- Các event khác --}}
<form @submit(handleSubmit($event))>
    <input @change(updateValue($event.target.value)) />
    <div @mouseenter(showTooltip()) @mouseleave(hideTooltip())>
        Hover me
    </div>
</form>
```

#### Data Binding Directives

**@bind** - Two-way data binding cho form inputs:
```blade
<input type="text" @bind($username) />
<input type="email" @bind($email) />
<textarea @bind($description)></textarea>
<select @bind($category)>
    <option value="1">Category 1</option>
    <option value="2">Category 2</option>
</select>

{{-- Hiển thị giá trị --}}
<p>Username: {{$username}}</p>
<p>Email: {{$email}}</p>
```

**@val** - Render reactive value (chỉ hiển thị):
```blade
<div>Count: @val($count)</div>
<span>Total: @val($total)</span>
```

#### Reactive Directives

**@subscribe** - Subscribe to data changes và re-render khi data thay đổi:
```blade
@subscribe($user->name)
    <span>User name: {{$user->name}}</span>
@endsubscribe

@subscribe($products)
    <ul>
        @foreach($products as $product)
            <li>{{$product->name}}</li>
        @endforeach
    </ul>
@endsubscribe
```

**@yieldattr** - Dynamic attributes:
```blade
<button @yieldattr('disabled', $isLoading)>Submit</button>
<input @yieldattr('readonly', $isReadOnly) />
<div @yieldattr('class', $dynamicClass)>Content</div>
```

#### Conditional & Loop Directives

```blade
{{-- Conditional rendering --}}
@if($isLoggedIn)
    <p>Welcome back!</p>
@else
    <p>Please login</p>
@endif

{{-- Loops --}}
@foreach($items as $item)
    <div @click(selectItem($item->id))>
        {{$item->name}}
    </div>
@endforeach
```

### Tạo Module mới

```bash
php artisan make:module Blog
```

Structure của module:
```
src/modules/Blog/
├── Controllers/
├── Models/
├── Views/
├── Routes/
└── Providers/
```

## 📚 Tài liệu

Tài liệu chi tiết được lưu trong thư mục `docs/`:

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Blade Compiler](docs/BLADE_COMPILER_SUMMARY.md)
- [Observable System](docs/OBSERVABLE_SYSTEM_README.md)
- [View Context System](docs/VIEW_CONTEXT_SYSTEM.md)
- [Custom Directives](docs/CUSTOM_DIRECTIVES.md)
- [Module Architecture](docs/module-architecture.txt)
- [Performance Analysis](docs/PERFORMANCE_ANALYSIS_AND_IMPROVEMENT_PLAN.md)

## 🧪 Testing

```bash
# Chạy tất cả tests
php artisan test

# hoặc dùng Pest
./vendor/bin/pest

# Test một file cụ thể
php artisan test --filter=TestClassName
```

## 🐳 Docker Support

Project có sẵn Docker configuration:

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

Services:
- **app**: Laravel application (PHP 8.2)
- **mysql**: MySQL 8.0
- **redis**: Redis 7.x

## 📊 Performance

- **First Load**: < 2s (với cache)
- **Subsequent Navigation**: < 100ms (SPA routing)
- **Build Time**: < 30s (full compile)
- **Bundle Size**: ~ 150KB (gzipped)

## 🔒 Security

- CSRF Protection
- XSS Prevention
- SQL Injection Protection (Eloquent ORM)
- Authentication & Authorization (Laravel Sanctum)
- Rate Limiting
- Secure Headers

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Changelog

Xem [CHANGELOG.md](CHANGELOG.md) để biết lịch sử thay đổi.

## 📄 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

One Laravel is also open-source software licensed under the MIT license.

## 👥 Team

- **Creator & Lead Developer**: Lê Ngọc Doãn
- **Contributors**: See [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 🙏 Acknowledgments

Cảm ơn tới:
- [Laravel](https://laravel.com) - The PHP Framework
- [Vue.js](https://vuejs.org) - Inspiration for reactive system
- [Alpine.js](https://alpinejs.dev) - Lightweight reactive framework
- Tất cả contributors và supporters

## 📞 Liên hệ

- Website: [https://onelaravel.com](https://onelaravel.com)
- GitHub: [https://github.com/onelaravel/onelaravel](https://github.com/onelaravel/onelaravel)
- Email: oneaicoder@gmail.com

## ⭐ Show your support

Nếu bạn thấy project này hữu ích, hãy cho chúng tôi một ⭐ trên GitHub!

---

Made with ❤️ by One Laravel Team
