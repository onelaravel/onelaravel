<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PWA Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the default configuration for the PWA module.
    | These settings can be overridden through the admin interface.
    |
    */
    
    'name' => env('PWA_NAME', 'LeanEZ Chat Widget'),
    'short_name' => env('PWA_SHORT_NAME', 'LeanEZ Chat'),
    'description' => env('PWA_DESCRIPTION', 'AI Chat Widget for customer support with real-time messaging'),
    'start_url' => env('PWA_START_URL', '/'),
    'display' => env('PWA_DISPLAY', 'standalone'),
    'background_color' => env('PWA_BACKGROUND_COLOR', '#667eea'),
    'theme_color' => env('PWA_THEME_COLOR', '#667eea'),
    'scope' => env('PWA_SCOPE', '/'),
    'orientation' => env('PWA_ORIENTATION', 'portrait'),
    'categories' => explode(',', env('PWA_CATEGORIES', 'business,productivity,communication')),
    'lang' => env('PWA_LANG', 'vi'),
    'dir' => env('PWA_DIR', 'ltr'),
    'prefer_related_applications' => env('PWA_PREFER_RELATED_APPLICATIONS', false),
    
    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Cache version and naming for service workers
    |
    */
    'cache_version' => env('PWA_CACHE_VERSION', 'v2'),
    'static_cache' => env('PWA_STATIC_CACHE', 'static-v2'),
    'dynamic_cache' => env('PWA_DYNAMIC_CACHE', 'dynamic-v2'),
    
    /*
    |--------------------------------------------------------------------------
    | Icons Configuration
    |--------------------------------------------------------------------------
    |
    | Default icon sizes and paths
    |
    */
    'icon_sizes' => [72, 96, 128, 144, 152, 192, 384, 512],
    'default_icon' => '/assets/avatar.png',
    
    /*
    |--------------------------------------------------------------------------
    | Shortcuts Configuration
    |--------------------------------------------------------------------------
    |
    | Default app shortcuts
    |
    */
    'shortcuts' => [
        [
            'name' => 'Open Chat',
            'short_name' => 'Chat',
            'description' => 'Open the chat widget',
            'url' => '/chat/10a6514f1e7a44aab44e5758a2fdd397',
        ],
        [
            'name' => 'Home',
            'short_name' => 'Home',
            'description' => 'Go to homepage',
            'url' => '/',
        ],
    ],
];
