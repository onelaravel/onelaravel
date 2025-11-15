<?php

namespace Contexts\Web;

use Core\System;
use Illuminate\Support\ServiceProvider;

class Bootstrap extends ServiceProvider
{
    public function register()
    {
        $context = System::context('web', [
            'as' => 'web',
            'display_name' => 'Web',
            'slug' => 'web',
            'middleware' => ['web'],
        ]);
        
    }

    public function boot()
    {
        // Routes sẽ được load bởi RouteManager trong AppServiceProvider
        // Không cần load routes ở đây nữa
    }
} 