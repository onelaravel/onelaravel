# Web Channel Middleware

Tài liệu này mô tả các middleware được sử dụng trong Web Channel của Leanez Chat App.

## 🏗️ Cấu trúc Middleware

```
app/Channels/Web/Middleware/
├── WebMiddleware.php          # Main Web Channel middleware
├── NextMiddleware.php         # Advanced Web Channel logic
└── README.md                  # Hướng dẫn sử dụng
```

## 🚀 WebMiddleware

Middleware chính của Web Channel, xử lý các tác vụ cơ bản.

### Tính năng:
- Thêm headers cho Web Channel
- Quản lý middleware stack
- Cung cấp middleware aliases

### Sử dụng:
```php
// Trong routes hoặc controllers
Route::middleware('web.channel')->group(function () {
    // Routes của bạn
});
```

## ⚡ NextMiddleware

Middleware nâng cao xử lý logic phức tạp cho Web Channel.

### 🎯 Tính năng chính:

#### 1. **Request Pre-Processing**
- Set Web Channel context
- Share common data với views
- Handle PWA requests
- Handle SPA fallback requests
- Set locale
- Handle maintenance mode

#### 2. **Response Post-Processing**
- Add response metadata
- Cache responses
- Log responses
- Add security headers

#### 3. **Smart Request Detection**
- PWA manifest requests
- SPA fallback requests
- Localization requests
- Maintenance mode requests

### 🔧 Cách hoạt động:

```php
public function handle(Request $request, Closure $next)
{
    // 1. Log request
    $this->logWebChannelRequest($request);
    
    // 2. Pre-process request
    $this->preProcessRequest($request);
    
    // 3. Continue to next middleware/controller
    $response = $next($request);
    
    // 4. Post-process response
    $this->postProcessResponse($request, $response);
    
    // 5. Add headers
    $this->addWebChannelHeaders($response);
    
    return $response;
}
```

### 📋 Request Attributes được set:

```php
// Web Channel context
$request->attributes->set('channel', 'web');
$request->attributes->set('channel_type', 'web');

// PWA requests
$request->attributes->set('is_pwa_request', true);
$request->attributes->set('pwa_type', 'manifest');

// SPA requests
$request->attributes->set('is_spa_request', true);
$request->attributes->set('spa_fallback', true);

// Localization
$request->attributes->set('locale', 'vi');

// Maintenance mode
$request->attributes->set('maintenance_mode', true);
$request->attributes->set('maintenance_allowed', false);
```

### 🌐 View Data được share:

```php
// Trong tất cả views
View::share('web_channel', true);
View::share('current_channel', 'web');
View::share('channel_config', $this->getChannelConfig());
```

### 🔒 Security Headers:

```php
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
X-Channel: web
X-Web-Version: 1.0.0
```

## ⚙️ Cấu hình

### Environment Variables:

```env
# Web Channel
WEB_CHANNEL_ENABLED=true
WEB_CHANNEL_LOGGING=true
WEB_CHANNEL_CACHING=true

# Logging
WEB_CHANNEL_LOG_CHANNEL=web
WEB_CHANNEL_LOG_LEVEL=info
WEB_CHANNEL_REQUEST_LOGGING=true
WEB_CHANNEL_RESPONSE_LOGGING=true

# Caching
WEB_CHANNEL_CACHE_TTL=300
WEB_CHANNEL_RESPONSE_CACHING=true

# Security
WEB_CHANNEL_CSP_ENABLED=false
WEB_CHANNEL_CSP_POLICY="default-src 'self'"

# PWA
WEB_CHANNEL_PWA_ENABLED=true

# SPA
WEB_CHANNEL_SPA_ENABLED=true
WEB_CHANNEL_SPA_FALLBACK=true

# Localization
WEB_CHANNEL_LOCALIZATION=true
WEB_CHANNEL_DEFAULT_LOCALE=en
WEB_CHANNEL_SUPPORTED_LOCALES=en,vi,ja,ko,zh

# Maintenance
WEB_CHANNEL_MAINTENANCE_ENABLED=false
WEB_CHANNEL_MAINTENANCE_ALLOWED_PATHS=/admin,/api/health,/health

# Debug
WEB_CHANNEL_DEBUG=false
WEB_CHANNEL_PROFILING=false
WEB_CHANNEL_VERBOSE_LOGGING=false
```

### Configuration File:

```php
// config/web-channel.php
return [
    'enabled' => true,
    'middleware' => [
        'stack' => [
            'web',
            'throttle:60,1',
            'Contexts\Web\Middleware\NextMiddleware',
        ],
    ],
    'logging' => [
        'enabled' => true,
        'channel' => 'web',
        'level' => 'info',
    ],
    // ... more config
];
```

## 🧪 Sử dụng trong Routes

### 1. Sử dụng middleware stack đầy đủ:

```php
// Trong SPARouteServiceProvider
System::channel('web')->module(['slug' => 'spa', 'priority' => 99999])
    ->controller(WebSPAController::class)
    ->middleware([
        'web',                    // Laravel web middleware
        'throttle:60,1',          // Rate limiting
        'Contexts\Web\Middleware\NextMiddleware', // Web Channel logic
    ])
    ->group(function ($module) {
        // Routes của bạn
    });
```

### 2. Sử dụng middleware aliases:

```php
Route::middleware('web.channel')->group(function () {
    Route::middleware('web.next')->group(function () {
        // Routes với NextMiddleware
    });
});
```

### 3. Sử dụng trong controllers:

```php
class YourController extends Controller
{
    public function __construct()
    {
        $this->middleware('web.next');
    }
    
    public function index(Request $request)
    {
        // Access Web Channel attributes
        $channel = $request->attributes->get('channel');
        $isPWA = $request->attributes->get('is_pwa_request');
        $isSPA = $request->attributes->get('is_spa_request');
        
        return view('your.view');
    }
}
```

## 🔍 Debug & Monitoring

### 1. Logs:

```bash
# Xem Web Channel logs
tail -f storage/logs/web.log

# Xem Laravel logs
tail -f storage/logs/laravel.log
```

### 2. Response Headers:

```bash
# Test response headers
curl -I http://localhost:8000/

# Headers sẽ có:
X-Channel: web
X-Web-Channel: true
X-Web-Version: 1.0.0
X-Response-Time: 0.123
```

### 3. Request Attributes:

```php
// Trong controller
public function debug(Request $request)
{
    dd([
        'channel' => $request->attributes->get('channel'),
        'channel_type' => $request->attributes->get('channel_type'),
        'is_pwa_request' => $request->attributes->get('is_pwa_request'),
        'is_spa_request' => $request->attributes->get('is_spa_request'),
        'locale' => $request->attributes->get('locale'),
        'maintenance_mode' => $request->attributes->get('maintenance_mode'),
    ]);
}
```

## 🚀 Best Practices

### 1. **Middleware Order**:
```php
// Luôn đặt NextMiddleware sau Laravel web middleware
'middleware' => [
    'web',                    // Laravel web
    'throttle:60,1',          // Rate limiting
    'Contexts\Web\Middleware\NextMiddleware', // Web Channel logic
],
```

### 2. **Error Handling**:
```php
// Trong NextMiddleware
try {
    $response = $next($request);
} catch (\Exception $e) {
    Log::channel('web')->error('Web Channel Error', [
        'message' => $e->getMessage(),
        'uri' => $request->getRequestUri(),
        'trace' => $e->getTraceAsString(),
    ]);
    
    throw $e;
}
```

### 3. **Performance Optimization**:
```php
// Cache channel config
protected function getChannelConfig(): array
{
    return Cache::remember('web_channel_config', 3600, function () {
        return [
            // config data
        ];
    });
}
```

### 4. **Security**:
```php
// Always set security headers
protected function addWebChannelHeaders($response): void
{
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
}
```

## 🎯 Use Cases

### 1. **PWA Applications**:
- Detect PWA requests
- Set appropriate headers
- Handle manifest.json, service-worker.js

### 2. **SPA Applications**:
- Detect SPA fallback requests
- Set SPA context
- Handle client-side routing

### 3. **Multilingual Apps**:
- Detect locale from URL
- Set application locale
- Share locale data với views

### 4. **Maintenance Mode**:
- Handle maintenance mode
- Allow specific paths
- Set maintenance context

### 5. **Performance Monitoring**:
- Log response times
- Monitor memory usage
- Cache responses

---

**NextMiddleware** là middleware mạnh mẽ giúp Web Channel xử lý tất cả logic phức tạp một cách hiệu quả! 🚀✨
