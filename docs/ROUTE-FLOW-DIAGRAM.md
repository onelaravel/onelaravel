# 🔄 SPA Router Flow Diagram

## Luồng Route trong SPA System

### 1. Initial Load (Server-Side Rendering)

```
User truy cập URL
    ↓
Laravel Server nhận request
    ↓
Route matching trong routes/web.php
    ↓
Controller method được gọi
    ↓
Blade view được render với data
    ↓
HTML được trả về với data-server-rendered="true"
    ↓
Browser hiển thị page
    ↓
SPA Scripts được load
    ↓
SPARouter khởi tạo
```

### 2. SPA Initialization

```
SPARouter constructor
    ↓
init() method
    ↓
checkServerRendered() - Kiểm tra data-server-rendered
    ↓
takeOverFromServer() - Nếu có SSR
    ↓
markAsClientRendered() - Remove data-server-rendered
    ↓
setupSPAMode() - Add SPA classes
    ↓
setupLinkInterception() - Setup click listeners
    ↓
handleRouteChange() - Initial route
```

### 3. Route Change Flow

```
User clicks link
    ↓
handleLinkClick() - Event delegation
    ↓
shouldInterceptLink() - Check if should intercept
    ↓
handleRouterLink() - Process link
    ↓
parseHrefToPath() - Convert href to path
    ↓
matchRoute() - Find matching route
    ↓
Check same route logic
    ↓
navigate() - Programmatic navigation
    ↓
handleRouteChange() - Process route change
```

### 4. Route Processing

```
handleRouteChange()
    ↓
getCurrentPath() - Get current URL path
    ↓
matchRoute() - Find route definition
    ↓
Check same route with same params
    ↓
beforeEach guard - Route guard
    ↓
loadView() - Load and render view
    ↓
getView() - Get view from SPA.views
    ↓
view.render() - Render view function
    ↓
Update DOM - Replace content
    ↓
view.init() - Initialize view
    ↓
afterEach guard - Post-route guard
    ↓
updateActiveLink() - Update navigation
```

### 5. View Loading Process

```
loadView(route, params, query)
    ↓
getView(componentName) - Find view in SPA.views
    ↓
Prepare viewData - Merge params, query, route
    ↓
route.onEnter() - Route lifecycle hook
    ↓
view.render(viewData) - Execute view function
    ↓
Update container.innerHTML - Replace DOM
    ↓
view.init(viewData) - Initialize view
    ↓
Store currentView - Save reference
```

### 6. Smart Navigation Logic

```
handleRouterLink(href, link)
    ↓
parseHrefToPath(href) - Convert to path
    ↓
matchRoute(path) - Find route
    ↓
Check if same route:
    - Same path?
    - Same params?
    - Same query?
    ↓
If same: updateActiveLink() only
    ↓
If different: navigate() → loadView()
```

## Code Flow Examples

### Example 1: Initial Load

```javascript
// 1. User visits /web
// 2. Laravel renders home.blade.php
// 3. Browser loads HTML with data-server-rendered="true"
// 4. SPA scripts load

const router = new SPARouter({
    routes: [
        { path: '/web', component: 'web.home' }
    ]
});

// 5. Router detects SSR
if (this.checkServerRendered()) {
    this.takeOverFromServer();
}

// 6. Take over from server
this.markAsClientRendered();
this.setupSPAMode();
this.handleRouteChange();
```

### Example 2: Navigation

```javascript
// 1. User clicks <a href="/web/about">
// 2. Event delegation catches click

document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (this.shouldInterceptLink(link, href)) {
        this.handleRouterLink(href, link);
    }
});

// 3. Handle router link
const path = this.parseHrefToPath(href); // "/web/about"
const { route, params, query } = this.matchRoute(path);

// 4. Check same route
if (this.currentRoute?.path === route.path) {
    // Same route logic
    return;
}

// 5. Navigate
this.navigate(path);
```

### Example 3: View Rendering

```javascript
// 1. Navigate calls handleRouteChange
async handleRouteChange() {
    const path = this.getCurrentPath();
    const { route, params, query } = this.matchRoute(path);
    
    // 2. Load view
    await this.loadView(route, params, query);
}

// 3. Load view
async loadView(route, params, query) {
    const view = this.getView(route.component); // "web.about"
    const viewData = { ...params, ...query, route };
    
    // 4. Render view
    const html = view.render(viewData);
    
    // 5. Update DOM
    container.innerHTML = html;
    
    // 6. Initialize view
    view.init(viewData);
}
```

## Route Matching Logic

### Path Matching

```javascript
matchRoute(path) {
    // path: "/web/users/123"
    // routes: [
    //   { path: '/web', component: 'web.home' },
    //   { path: '/web/users', component: 'web.users' },
    //   { path: '/web/users/:id', component: 'web.user-detail' }
    // ]
    
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
// route.path: "/web/users/:id"
// path: "/web/users/123"
// result: { id: "123" }

extractParams(routePath, match) {
    const paramNames = this.getParamNames(routePath);
    const params = {};
    
    paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
    });
    
    return params;
}
```

## Error Handling

### Route Not Found

```javascript
if (!route) {
    console.warn('⚠️ SPARouter: No route found for:', path);
    this.handleNotFound(path);
    return;
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
}
```

## Performance Optimizations

### 1. Smart Navigation

```javascript
// Skip loading if same route
if (this.currentRoute?.path === route.path) {
    const sameParams = JSON.stringify(this.currentParams) === JSON.stringify(params);
    const sameQuery = JSON.stringify(this.currentQuery) === JSON.stringify(query);
    
    if (sameParams && sameQuery) {
        console.log('Same route, skipping...');
        return;
    }
}
```

### 2. Event Delegation

```javascript
// Single event listener for all links
document.addEventListener('click', this.handleLinkClick.bind(this));
```

### 3. Lazy Loading

```javascript
// Only load view when needed
const view = this.getView(route.component);
if (!view) {
    // Load view dynamically
    await this.loadViewAsync(route.component);
}
```

## Debug Information

### Console Logs

```
🚀 SPARouter: Initializing...
🔄 SPARouter: Server-rendered page detected, taking over...
✅ SPARouter: Marked as client-rendered
🔗 SPARouter: Intercepting link: /web/about
🔄 SPARouter: Route change to: /web/about
📦 SPARouter: Loading view: web.about
✅ SPARouter: View rendered successfully
```

### Route Info

```javascript
// Current route information
{
    path: "/web/about",
    route: { path: "/web/about", component: "web.about" },
    params: {},
    query: {},
    view: { render: function, init: function, destroy: function }
}
```

## Summary

SPA Router flow bao gồm:

1. **Initialization**: SSR detection và takeover
2. **Link Interception**: Event delegation cho navigation
3. **Route Matching**: Path matching với parameters
4. **Smart Navigation**: Skip loading cho same route
5. **View Loading**: Render và initialize view
6. **Error Handling**: Graceful error recovery
7. **Performance**: Optimizations cho speed

Luồng này đảm bảo smooth navigation với performance tối ưu và user experience tốt.
