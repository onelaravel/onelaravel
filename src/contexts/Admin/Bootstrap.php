<?php

namespace Contexts\Admin;

use Contexts\Admin\Controllers\DashboardController;
use Core\System;
use Illuminate\Support\ServiceProvider;

class Bootstrap extends ServiceProvider
{
    public function register()
    {

        
        $context = System::context('admin', [
            'as' => 'admin',
            'display_name' => 'Admin',
            'slug' => 'admin',
            'prefix' => 'admin',
            'middleware' => ['web', 'auth', 'permission:admin'],
            'permission' => ['admin'],
        ]);
        $context->get('/', [DashboardController::class, 'index'])
            ->name('index');

        

    }

    public function boot()
    {
        // Routes sẽ được load bởi RouteManager trong AppServiceProvider
        // Không cần load routes ở đây nữa
    }
} 