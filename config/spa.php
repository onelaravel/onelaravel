<?php

return [
    /*
    |--------------------------------------------------------------------------
    | SPA Scopes Configuration
    |--------------------------------------------------------------------------
    |
    | Cấu hình các scope cho SPA system. Mỗi scope có thể có:
    | - name: Tên scope
    | - container: Container element ID
    | - mode: Router mode (history/hash)
    | - routes: Danh sách routes
    | - middleware: Middleware áp dụng
    |
    */

    'scopes' => [
        'web' => [
            'name' => 'web',
            'container' => '#layout-content',
            'mode' => 'history',
            'routes' => [
                ['path' => '/web', 'component' => 'web.home'],
                ['path' => '/web/about', 'component' => 'web.about'],
                ['path' => '/web/users', 'component' => 'web.users'],
                ['path' => '/web/users/:id', 'component' => 'web.user-detail'],
                ['path' => '/web/contact', 'component' => 'web.contact'],
            ],
            'middleware' => ['web'],
        ],

        'admin' => [
            'name' => 'admin',
            'container' => '#admin-content',
            'mode' => 'history',
            'routes' => [
                ['path' => '/admin', 'component' => 'admin.dashboard'],
                ['path' => '/admin/users', 'component' => 'admin.users'],
                ['path' => '/admin/settings', 'component' => 'admin.settings'],
            ],
            'middleware' => ['web', 'auth', 'admin'],
        ],

        'api' => [
            'name' => 'api',
            'container' => '#api-content',
            'mode' => 'hash',
            'routes' => [
                ['path' => '/api', 'component' => 'api.home'],
                ['path' => '/api/docs', 'component' => 'api.docs'],
            ],
            'middleware' => ['api'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Scope
    |--------------------------------------------------------------------------
    |
    | Scope mặc định khi không có scope nào được chỉ định
    |
    */

    'default_scope' => 'web',

    /*
    |--------------------------------------------------------------------------
    | Auto-detect Scope
    |--------------------------------------------------------------------------
    |
    | Tự động detect scope dựa trên URL pattern
    |
    */

    'auto_detect' => true,

    'scope_patterns' => [
        '/admin/*' => 'admin',
        '/api/*' => 'api',
        '/web/*' => 'web',
    ],
];
