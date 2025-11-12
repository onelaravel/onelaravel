# Blade Compiler JavaScript Structure

## Cấu trúc thư mục

```
resources/js/
├── app/                    # Runtime modules (ES6)
│   ├── app.js             # Core App object
│   ├── HttpService.js     # HTTP client
│   ├── api.js             # API utilities
│   ├── view.js            # View system
│   ├── router.js          # Router system
│   ├── init.js            # Initialization
│   ├── seo-config.js      # SEO configuration
│   ├── event-manager.js   # Event management
│   ├── module-standard.js # Module standards
│   ├── index.js           # Auto-generated entry point
│   ├── build.config.json  # Auto-generated build config
│   └── view.templates.js  # Generated templates (runtime)
├── templates/             # Build-time templates
│   ├── view.tpl-raw.js    # Template for build process
│   └── wraper.js          # Wrapper function
├── build/                 # Build output
│   └── main.js           # Combined modules
└── bootstrap.js          # Bootstrap entry
```

## Module Types

### 1. Runtime Modules (`app/`)
- **Purpose**: Modules that run in the browser
- **Format**: ES6 modules with import/export
- **Build**: Included in `main.js`
- **Examples**: `HttpService.js`, `api.js`, `view.js`

### 2. Build-time Modules (`templates/`)
- **Purpose**: Templates used during build process
- **Format**: Legacy JavaScript
- **Build**: Used to generate `view.templates.js`
- **Examples**: `view.tpl-raw.js`, `wraper.js`

### 3. Generated Modules (`app/view.templates.js`)
- **Purpose**: Compiled Blade templates
- **Format**: Generated JavaScript
- **Build**: Copied from `build/` to `app/`
- **Usage**: Runtime template functions

## Build Process

### 1. Auto-Discovery (Recommended)
```bash
npm run build:auto
# or: node scripts/auto-build.js
```
- **Automatically discovers** all `.js` files in `app/` and subdirectories
- **No configuration needed** - just add files and they're included
- **Recursive scanning** - supports nested directories
- **Smart filtering** - excludes build-time files automatically

### 2. Template Compilation (Python)
```bash
npm run build:templates
# or: python3 build.py
```
- Compiles Blade templates → `build/view.templates.js`
- Uses `templates/view.tpl-raw.js` as template
- Copies to `app/view.templates.js`

### 3. Module Building (npm)
```bash
npm run build:main
# or: node scripts/build-main.js
```
- Combines runtime modules → `build/main.js`
- Uses `build.config.json` if available
- Falls back to auto-discovery if config missing

### 4. Complete Build (Recommended)
```bash
npm run compile
# or: npm run build:templates && npm run build:auto
```
- **Full automated build** - templates + auto-discovered modules
- **Zero configuration** - just add files and compile
- **Perfect for development** - always up-to-date

## Benefits

- ✅ **Zero Configuration**: Just add files and compile
- ✅ **Auto-Discovery**: Automatically finds all modules
- ✅ **Recursive Scanning**: Supports nested directories
- ✅ **Smart Filtering**: Excludes build-time files
- ✅ **Separation**: Runtime vs Build-time modules
- ✅ **Optimization**: No unnecessary files in main.js
- ✅ **Organization**: Clear module categorization
- ✅ **ES6 Standards**: Modern module system
- ✅ **Compatibility**: Works with existing code

## Development

### Adding New Runtime Module
1. Create `.js` file in `app/` (or any subdirectory)
2. Use ES6 import/export syntax
3. Run `npm run compile` to build
4. **That's it!** - Auto-discovered automatically

### Adding New Build-time Template
1. Create `.js` file in `templates/`
2. Use legacy JavaScript syntax
3. Update build process if needed

### Module Standards
```javascript
/**
 * Module Name
 * ES6 Module for Blade Compiler
 */

import { Dependency } from './dependency.js';

// Initialize global App object
if (typeof window !== 'undefined') {
    if (!window.App) {
        window.App = {};
    }
}

export class ModuleClass {
    // ... implementation
}

// Register with global App object
if (typeof window !== 'undefined') {
    window.App.ModuleClass = ModuleClass;
}

// Export for ES6 modules
export default ModuleClass;
```
