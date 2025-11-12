# Cấu Trúc Dự Án One Laravel

## 📁 Tổng Quan

Dự án Laravel SPA với kiến trúc Modular + Multi-Context, sử dụng Blade to JavaScript compiler.

## 🗂️ Cấu Trúc Thư Mục Chính

```
one-laravel/
├── app/                          # Laravel Application
│   ├── Console/Commands/         # Artisan Commands
│   ├── Http/Controllers/         # HTTP Controllers
│   ├── Models/                   # Eloquent Models
│   ├── Providers/                # Service Providers
│   └── Services/                 # Application Services
│
├── src/                          # Core Source Code (Modular Architecture)
│   ├── contexts/                 # Context Modules (Admin, Api, Web)
│   │   ├── Admin/                # Admin Context
│   │   ├── Api/                  # API Context
│   │   └── Web/                  # Web Context
│   │
│   ├── core/                     # Core System
│   │   ├── BladeCompiler/        # Blade Compiler Services
│   │   ├── Http/                 # HTTP Layer
│   │   ├── Providers/            # Core Service Providers
│   │   ├── Routing/              # Routing System
│   │   ├── Services/             # Core Services
│   │   │   ├── BladeCompilers/   # Blade Directive Services
│   │   │   │   ├── BindingDirectiveService.php
│   │   │   │   ├── EventDirectiveService.php
│   │   │   │   └── SetupDirectiveService.php
│   │   │   ├── ViewHelperService.php
│   │   │   └── ViewStorageManager.php
│   │   ├── Support/              # Support Classes
│   │   └── View/                 # View System
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   └── Database/             # Database Infrastructure
│   │
│   ├── modules/                  # Business Modules
│   │   ├── Home/                 # Home Module
│   │   ├── PWA/                  # PWA Module
│   │   ├── Setting/              # Settings Module
│   │   ├── Shop/                 # Shop Module
│   │   ├── User/                 # User Module
│   │   └── Web/                  # Web Module
│   │
│   ├── shared/                   # Shared Code
│   │   ├── Interfaces/           # Shared Interfaces
│   │   ├── Repositories/         # Repository Pattern
│   │   ├── Services/             # Shared Services
│   │   └── Traits/               # Shared Traits
│   │
│   ├── support/                  # Support Classes
│   └── templates/                # Template System
│       └── module/               # Module Templates
│
├── resources/                    # Resources
│   ├── views/                    # Blade Templates
│   │   ├── components/           # Blade Components
│   │   ├── layouts/              # Layout Templates
│   │   ├── partials/             # Partial Templates
│   │   └── web/                  # Web Views
│   │
│   ├── js/                       # JavaScript Source
│   │   ├── app/                  # Application JS
│   │   │   ├── core/             # Core JavaScript
│   │   │   │   ├── ViewEngine.js # View Engine
│   │   │   │   ├── View.js       # View Class
│   │   │   │   └── ViewConfig.js # View Configuration
│   │   │   ├── components/       # JS Components
│   │   │   ├── features/         # Feature Modules
│   │   │   ├── helpers/          # Helper Functions
│   │   │   ├── hooks/            # React-like Hooks
│   │   │   ├── plugins/          # Plugins
│   │   │   ├── services/         # JS Services
│   │   │   ├── utils/            # Utilities
│   │   │   └── views/            # Compiled Views
│   │   ├── build/                # Build Output (temp)
│   │   └── templates/            # JS Templates
│   │
│   ├── css/                      # Stylesheets
│   ├── build/                    # Build Artifacts
│   └── output/                   # Output Files
│
├── scripts/                      # Build & Compile Scripts
│   ├── compiler/                 # Python Blade Compiler
│   │   ├── main_compiler.py      # Main Compiler
│   │   ├── event_directive_processor.py
│   │   ├── binding_directive_service.py
│   │   ├── declaration_tracker.py
│   │   ├── parsers.py
│   │   └── template_processor.py
│   │
│   ├── node/                     # Node.js Compiler
│   │   └── compiler/             # Node Compiler
│   │
│   ├── build.py                  # Python Build Script
│   ├── compile.py                # Compile Script
│   └── dev.js                    # Development Script
│
├── public/                       # Public Assets
│   ├── static/                   # Static Assets
│   │   ├── app/                  # Compiled JS/CSS
│   │   ├── assets/               # Other Assets
│   │   └── css/                  # Compiled CSS
│   └── index.php                 # Entry Point
│
├── storage/                      # Storage
│   ├── app/                      # Application Storage
│   ├── framework/                # Framework Storage
│   │   ├── views/                # Compiled Blade Views
│   │   ├── cache/                # Cache Files
│   │   └── sessions/             # Session Files
│   └── logs/                     # Log Files
│
├── config/                       # Configuration Files
│   ├── app.php                   # Application Config
│   ├── spa.php                   # SPA Config
│   └── ...
│
├── routes/                       # Route Definitions
│   ├── web.php                   # Web Routes
│   ├── api.php                   # API Routes
│   └── console.php               # Console Routes
│
├── database/                     # Database
│   ├── migrations/               # Database Migrations
│   ├── seeders/                  # Database Seeders
│   └── factories/                # Model Factories
│
├── tests/                        # Tests
│   ├── Feature/                  # Feature Tests
│   └── Unit/                     # Unit Tests
│
├── docs/                         # Documentation
│   ├── SYSTEM_OVERVIEW_UPDATE.md
│   ├── DIRECTIVES_STATUS.md
│   ├── BLADE_COMPILER_SUMMARY.md
│   └── ...
│
├── docker/                       # Docker Configuration
│   ├── mysql/                    # MySQL Config
│   └── redis/                    # Redis Config
│
└── vendor/                       # Composer Dependencies
```

## 🔧 Các Thành Phần Chính

### 1. **Core System** (`src/core/`)
- **BladeCompiler**: Xử lý biên dịch Blade directives
- **Services**: Core services (ViewHelper, ViewStorageManager)
- **Routing**: Hệ thống routing tùy chỉnh
- **View**: Hệ thống view engine

### 2. **Blade Compiler** (`scripts/compiler/`)
- **Python Compiler**: Biên dịch Blade → JavaScript
- **Event Directive Processor**: Xử lý event directives
- **Binding Directive Service**: Xử lý `@val` và `@bind`
- **Declaration Tracker**: Theo dõi khai báo biến

### 3. **JavaScript Core** (`resources/js/app/core/`)
- **ViewEngine.js**: View engine chính
- **View.js**: View class
- **ViewConfig.js**: View configuration

### 4. **Blade Directives** (`src/core/Services/BladeCompilers/`)
- **EventDirectiveService.php**: Xử lý `@click`, `@keyup`, etc.
- **BindingDirectiveService.php**: Xử lý `@val`, `@bind`
- **SetupDirectiveService.php**: Xử lý setup directives

## 📝 File Quan Trọng

### PHP
- `src/core/Services/BladeCompilers/EventDirectiveService.php` - Event directive processor
- `src/core/Services/ViewHelperService.php` - View helper
- `src/core/Services/ViewStorageManager.php` - View storage manager

### JavaScript
- `resources/js/app/core/ViewEngine.js` - View engine
- `resources/js/app/core/View.js` - View class
- `resources/js/app/views/*.js` - Compiled views

### Python
- `scripts/compiler/main_compiler.py` - Main compiler
- `scripts/compiler/event_directive_processor.py` - Event processor
- `scripts/compiler/template_processor.py` - Template processor

## 🚀 Build Process

1. **Blade Templates** → `resources/views/*.blade.php`
2. **PHP Compiler** → Compile directives (SSR)
3. **Python Compiler** → Compile to JavaScript
4. **Output** → `resources/js/app/views/*.js`

## 📚 Documentation

Xem thêm trong thư mục `docs/`:
- `SYSTEM_OVERVIEW_UPDATE.md` - Tổng quan hệ thống
- `DIRECTIVES_STATUS.md` - Trạng thái directives
- `BLADE_COMPILER_SUMMARY.md` - Tóm tắt compiler

