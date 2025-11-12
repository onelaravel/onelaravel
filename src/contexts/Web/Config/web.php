<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Web Channel Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for the Web Channel.
    | Web Channel handles all web-based requests and responses.
    |
    */
    
    'enabled' => env('WEB_CHANNEL_ENABLED', true),
    
    /*
    |--------------------------------------------------------------------------
    | Middleware Configuration
    |--------------------------------------------------------------------------
    |
    | Middleware stack for Web Channel
    |
    */
    'middleware' => [
        'stack' => [
            'web',                    // Laravel web middleware group
            'throttle:60,1',          // Rate limiting
            'Contexts\Web\Middleware\NextMiddleware',
        ],
        
        'aliases' => [
            'web.channel' => 'Contexts\Web\Middleware\WebMiddleware',
            'web.next' => 'Contexts\Web\Middleware\NextMiddleware',
            'web.throttle' => 'throttle:60,1',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Logging Configuration
    |--------------------------------------------------------------------------
    |
    | Logging settings for Web Channel
    |
    */
    'logging' => [
        'enabled' => env('WEB_CHANNEL_LOGGING', true),
        'channel' => env('WEB_CHANNEL_LOG_CHANNEL', 'web'),
        'level' => env('WEB_CHANNEL_LOG_LEVEL', 'info'),
        
        'request_logging' => env('WEB_CHANNEL_REQUEST_LOGGING', true),
        'response_logging' => env('WEB_CHANNEL_RESPONSE_LOGGING', true),
        'error_logging' => env('WEB_CHANNEL_ERROR_LOGGING', true),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Caching Configuration
    |--------------------------------------------------------------------------
    |
    | Caching settings for Web Channel
    |
    */
    'caching' => [
        'enabled' => env('WEB_CHANNEL_CACHING', true),
        'ttl' => env('WEB_CHANNEL_CACHE_TTL', 300), // 5 minutes
        
        'response_caching' => env('WEB_CHANNEL_RESPONSE_CACHING', true),
        'config_caching' => env('WEB_CHANNEL_CONFIG_CACHING', true),
        'view_caching' => env('WEB_CHANNEL_VIEW_CACHING', true),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Security headers and settings
    |
    */
    'security' => [
        'headers' => [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
        ],
        
        'csp_enabled' => env('WEB_CHANNEL_CSP_ENABLED', false),
        'csp_policy' => env('WEB_CHANNEL_CSP_POLICY', "default-src 'self'"),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Performance optimization settings
    |
    */
    'performance' => [
        'response_time_logging' => env('WEB_CHANNEL_RESPONSE_TIME_LOGGING', true),
        'memory_usage_logging' => env('WEB_CHANNEL_MEMORY_LOGGING', true),
        
        'optimizations' => [
            'view_caching' => true,
            'route_caching' => true,
            'config_caching' => true,
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | PWA Configuration
    |--------------------------------------------------------------------------
    |
    | PWA specific settings
    |
    */
    'pwa' => [
        'enabled' => env('WEB_CHANNEL_PWA_ENABLED', true),
        'paths' => [
            '/manifest.json',
            '/service-worker.js',
            '/sw.js'
        ],
        
        'headers' => [
            'manifest.json' => 'application/manifest+json',
            'service-worker.js' => 'application/javascript',
            'sw.js' => 'application/javascript',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | SPA Configuration
    |--------------------------------------------------------------------------
    |
    | SPA specific settings
    |
    */
    'spa' => [
        'enabled' => env('WEB_CHANNEL_SPA_ENABLED', true),
        'fallback_enabled' => env('WEB_CHANNEL_SPA_FALLBACK', true),
        
        'excluded_paths' => explode(',', env('WEB_CHANNEL_SPA_EXCLUDED_PATHS', implode(',', [
            '/api',
            '/admin',
            '/pwa',
            '/assets',
            '/static',
            '/storage'
        ]))),
        
        'included_paths' => explode(',', env('WEB_CHANNEL_SPA_INCLUDED_PATHS', implode(',', [
            '/',
            '/chat',
            '/profile',
            '/settings'
        ]))),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Localization Configuration
    |--------------------------------------------------------------------------
    |
    | Localization settings
    |
    */
    'localization' => [
        'enabled' => env('WEB_CHANNEL_LOCALIZATION', true),
        'default_locale' => env('WEB_CHANNEL_DEFAULT_LOCALE', 'en'),
        
        'supported_locales' => explode(',', env('WEB_CHANNEL_SUPPORTED_LOCALES', 'en,vi,ja,ko,zh')),
        
        'locale_detection' => [
            'url_based' => true,
            'session_based' => true,
            'browser_based' => false,
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Configuration
    |--------------------------------------------------------------------------
    |
    | Maintenance mode settings
    |
    */
    'maintenance' => [
        'enabled' => env('WEB_CHANNEL_MAINTENANCE_ENABLED', false),
        
        'allowed_paths' => explode(',', env('WEB_CHANNEL_MAINTENANCE_ALLOWED_PATHS', implode(',', [
            '/admin',
            '/api/health',
            '/health'
        ]))),
        
        'bypass_token' => env('WEB_CHANNEL_MAINTENANCE_BYPASS_TOKEN', null),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Debug Configuration
    |--------------------------------------------------------------------------
    |
    | Debug settings for development
    |
    */
    'debug' => [
        'enabled' => env('WEB_CHANNEL_DEBUG', false),
        'profiling' => env('WEB_CHANNEL_PROFILING', false),
        'verbose_logging' => env('WEB_CHANNEL_VERBOSE_LOGGING', false),
    ],
];
