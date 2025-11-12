# 🔄 SPA Router Flow - Code Examples

## 1. Initial Load Flow

### Step 1: User truy cập URL
```
URL: http://localhost:8000/web
```

### Step 2: Laravel Route Matching
```php
// routes/web.php
Route::get('/web', [WebController::class, 'home'])->name('web.home');
```

### Step 3: Controller Method
```php
// app/Http/Controllers/WebController.php
public function home()
{
    return view('web.home');
}
```

### Step 4: Blade Rendering
```blade
{{-- resources/views/web/home.blade.php --}}
@extends('layouts.base')

@section('document.body')
<div class="container">
    <h1>🏠 Home Page</h1>
    <p>Welcome to the SPA Web Application!</p>
</div>
@endsection
```

### Step 5: HTML Output với SSR
```html
<!DOCTYPE html>
<html>
<head>
    <title>SPA Web Application</title>
</head>
<body>
    <div id="spa-root" data-server-rendered="true">
        <!-- Server-rendered content -->
        <div id="layout-content">
            <h1>🏠 Home Page</h1>
            <p>Welcome to the SPA Web Application!</p>
        </div>
    </div>
    
    <!-- SPA Scripts -->
    <script src="build/spa.js"></script>
    <script src="build/spa.views.js"></script>
    <script src="build/SPARouter.js"></script>
</body>
</html>
```

### Step 6: SPA Initialization
```javascript
// SPARouter constructor
constructor(options = {}) {
    this.routes = options.routes || [];
    this.container = options.container || '#app';
    this.mode = options.mode || 'hash';
    this.isServerRendered = false;
    this.isFirstLoad = true;
    
    this.init();
}

// init() method
init() {
    console.log('🚀 SPARouter: Initializing...');
    
    // Check if page is server-rendered
    this.isServerRendered = this.checkServerRendered();
    
    if (this.isServerRendered) {
        console.log('🔄 SPARouter: Server-rendered page detected, taking over...');
        this.takeOverFromServer();
    }
    
    // Setup event listeners
    this.setupLinkInterception();
    
    // Initial route
    this.handleRouteChange();
}
```

## 2. Navigation Flow

### Step 1: Link Click
```html
<a href="/web/about" class="nav-link">About</a>
```

### Step 2: Event Delegation
```javascript
// setupLinkInterception()
setupLinkInterception() {
    document.addEventListener('click', this.handleLinkClick.bind(this));
}

// handleLinkClick()
handleLinkClick(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    if (this.shouldInterceptLink(link, href)) {
        event.preventDefault();
        this.handleRouterLink(href, link);
    }
}
```

### Step 3: Link Processing
```javascript
// shouldInterceptLink()
shouldInterceptLink(link, href) {
    // Skip if link has data-router="false"
    if (link.getAttribute('data-router') === 'false') return false;
    
    // Skip external URLs
    if (this.isExternalUrl(href)) return false;
    
    // Skip special protocols
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    
    return true;
}

// handleRouterLink()
handleRouterLink(href, link) {
    console.log('🔗 SPARouter: Intercepting link:', href);
    
    const path = this.parseHrefToPath(href); // "/web/about"
    const { route, params, query } = this.matchRoute(path);
    
    if (route) {
        // Check same route logic
        if (this.currentRoute?.path === route.path) {
            const sameParams = JSON.stringify(this.currentParams) === JSON.stringify(params);
            const sameQuery = JSON.stringify(this.currentQuery) === JSON.stringify(query);
            
            if (sameParams && sameQuery) {
                console.log('🔗 SPARouter: Same route with same params, just updating active link');
                this.updateActiveLink(link);
                return;
            }
        }
        
        this.navigate(path);
        this.updateActiveLink(link);
    }
}
```

## 3. Route Matching

### Path to Regex Conversion
```javascript
// pathToRegex()
pathToRegex(path) {
    // "/web/users/:id" → "^/web/users/([^/]+)$"
    const paramNames = this.getParamNames(path);
    const regexPath = path.replace(/:([^/]+)/g, '([^/]+)');
    return new RegExp(`^${regexPath}$`);
}

// getParamNames()
getParamNames(path) {
    const matches = path.match(/:([^/]+)/g);
    return matches ? matches.map(match => match.slice(1)) : [];
}

// matchRoute()
matchRoute(path) {
    for (const route of this.routes) {
        const regex = this.pathToRegex(route.path);
        const match = path.match(regex);
        
        if (match) {
            return {
                route,
                params: this.extractParams(route.path, match),
                query: this.parseQuery(path)
            };
        }
    }
    
    return { route: null, params: {}, query: {} };
}
```

### Parameter Extraction
```javascript
// extractParams()
extractParams(routePath, match) {
    const paramNames = this.getParamNames(routePath);
    const params = {};
    
    paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
    });
    
    return params;
}

// Example:
// routePath: "/web/users/:id"
// path: "/web/users/123"
// match: ["/web/users/123", "123"]
// result: { id: "123" }
```

## 4. View Loading

### Step 1: Route Change Handler
```javascript
// handleRouteChange()
async handleRouteChange() {
    try {
        const path = this.getCurrentPath();
        console.log('🔄 SPARouter: Route change to:', path);
        
        const { route, params, query } = this.matchRoute(path);
        
        if (!route) {
            console.warn('⚠️ SPARouter: No route found for:', path);
            this.handleNotFound(path);
            return;
        }
        
        // Check same route logic
        if (this.currentRoute?.path === route.path) {
            const sameParams = JSON.stringify(this.currentParams) === JSON.stringify(params);
            const sameQuery = JSON.stringify(this.currentQuery) === JSON.stringify(query);
            
            if (sameParams && sameQuery) {
                console.log('🔄 SPARouter: Same route with same params, skipping...');
                return;
            }
        }
        
        // Before each guard
        if (this.beforeEach) {
            const canProceed = await this.beforeEach(route, this.currentRoute);
            if (canProceed === false) {
                console.log('🚫 SPARouter: Navigation cancelled by beforeEach guard');
                return;
            }
        }
        
        // Load view
        await this.loadView(route, params, query);
        
        // Update current route
        this.currentRoute = route;
        this.currentParams = params;
        this.currentQuery = query;
        
        // After each guard
        if (this.afterEach) {
            this.afterEach(route, this.currentRoute);
        }
        
    } catch (error) {
        console.error('❌ SPARouter: Error handling route change:', error);
        if (this.errorHandler) {
            this.errorHandler(error);
        }
    }
}
```

### Step 2: View Loading
```javascript
// loadView()
async loadView(route, params, query) {
    try {
        console.log('📦 SPARouter: Loading view:', route.component);
        
        // Get view from SPA.views
        const view = this.getView(route.component);
        if (!view) {
            throw new Error(`View not found: ${route.component}`);
        }
        
        // Prepare data for view
        const viewData = {
            ...params,
            ...query,
            route: route,
            router: this
        };
        
        // Call onEnter hook
        if (route.onEnter) {
            await route.onEnter(params, query, viewData);
        }
        
        // Render view
        const html = view.render(viewData);
        
        // Update container
        const container = document.querySelector(this.container);
        if (container) {
            // Check if this is server-rendered content
            if (this.isServerRendered && this.isFirstLoad) {
                console.log('🔄 SPARouter: Updating server-rendered content');
                this.updateServerRenderedContent(container, html, viewData);
            } else {
                console.log('🔄 SPARouter: Rendering new content');
                container.innerHTML = html;
            }
            
            // Call init method if exists
            if (view.init) {
                view.init(viewData);
            }
            
            // Store current view
            this.currentView = view;
            
            // Mark first load as complete
            this.isFirstLoad = false;
            
            console.log('✅ SPARouter: View rendered successfully');
        }
        
    } catch (error) {
        console.error('❌ SPARouter: Error loading view:', error);
        throw error;
    }
}
```

### Step 3: View Retrieval
```javascript
// getView()
getView(componentName) {
    if (typeof window !== 'undefined' && window.SPA && window.SPA.views) {
        // Try different scopes
        const scopes = ['web', 'spa', 'admin'];
        for (const scope of scopes) {
            if (window.SPA.views[scope] && window.SPA.views[scope][componentName]) {
                return window.SPA.views[scope][componentName];
            }
        }
    }
    
    console.warn(`⚠️ SPARouter: View not found: ${componentName}`);
    return null;
}
```

## 5. Smart Navigation Logic

### Same Route Detection
```javascript
// Check if same route with same params
if (this.currentRoute && this.currentRoute.path === route.path) {
    const sameParams = JSON.stringify(this.currentParams) === JSON.stringify(params);
    const sameQuery = JSON.stringify(this.currentQuery) === JSON.stringify(query);
    
    if (sameParams && sameQuery) {
        console.log('🔄 SPARouter: Same route with same params, skipping...');
        return; // Skip loading
    } else {
        console.log('🔄 SPARouter: Same route but different params, updating...');
    }
}
```

### Examples

#### Same Route (Skip)
```javascript
// Current: { path: "/web", params: {}, query: {} }
// Click: <a href="/web">Home</a>
// Result: Skip loading, just update active link
```

#### Different Route (Load)
```javascript
// Current: { path: "/web", params: {}, query: {} }
// Click: <a href="/web/about">About</a>
// Result: Load new view
```

#### Same Route, Different Params (Load)
```javascript
// Current: { path: "/web/users", params: { id: "1" }, query: {} }
// Click: <a href="/web/users/2">User 2</a>
// Result: Load new view with different params
```

## 6. Error Handling

### Route Not Found
```javascript
if (!route) {
    console.warn('⚠️ SPARouter: No route found for:', path);
    this.handleNotFound(path);
    return;
}

// handleNotFound()
handleNotFound(path) {
    console.error('❌ SPARouter: 404 - Route not found:', path);
    
    // Call error handler if exists
    if (this.errorHandler) {
        this.errorHandler(new Error(`Route not found: ${path}`));
    }
    
    // Show 404 page or redirect
    // this.navigate('/404');
}
```

### View Not Found
```javascript
const view = this.getView(route.component);
if (!view) {
    throw new Error(`View not found: ${route.component}`);
}
```

### Error Recovery
```javascript
try {
    await this.loadView(route, params, query);
} catch (error) {
    console.error('❌ SPARouter: Error loading view:', error);
    
    if (this.errorHandler) {
        this.errorHandler(error);
    }
    
    // Fallback to previous route or error page
    // this.navigate(this.previousRoute);
}
```

## 7. Performance Optimizations

### Event Delegation
```javascript
// Single event listener for all links
document.addEventListener('click', this.handleLinkClick.bind(this));
```

### Smart Navigation
```javascript
// Skip loading for same route
if (sameRoute && sameParams && sameQuery) {
    return; // Skip
}
```

### Lazy Loading
```javascript
// Only load view when needed
const view = this.getView(route.component);
if (!view) {
    await this.loadViewAsync(route.component);
}
```

## 8. Debug Information

### Console Logs
```javascript
console.log('🚀 SPARouter: Initializing...');
console.log('🔄 SPARouter: Server-rendered page detected, taking over...');
console.log('🔗 SPARouter: Intercepting link: /web/about');
console.log('🔄 SPARouter: Route change to: /web/about');
console.log('📦 SPARouter: Loading view: web.about');
console.log('✅ SPARouter: View rendered successfully');
```

### Route Info
```javascript
// Current route information
{
    path: "/web/about",
    route: { 
        path: "/web/about", 
        component: "web.about",
        onEnter: function,
        onLeave: function
    },
    params: {},
    query: {},
    view: { 
        render: function, 
        init: function, 
        destroy: function,
        parent: "layouts.base"
    }
}
```

## Summary

Luồng route trong SPA system bao gồm:

1. **Initialization**: SSR detection và takeover
2. **Link Interception**: Event delegation cho navigation
3. **Route Matching**: Path matching với parameters
4. **Smart Navigation**: Skip loading cho same route
5. **View Loading**: Render và initialize view
6. **Error Handling**: Graceful error recovery
7. **Performance**: Optimizations cho speed

Mỗi bước đều có error handling và logging để debug dễ dàng.
