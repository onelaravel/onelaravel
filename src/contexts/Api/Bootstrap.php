<?php

namespace Contexts\Api;

use Core\System;
use Illuminate\Support\ServiceProvider;

class Bootstrap extends ServiceProvider
{
    public function register()
    {
        $context = System::context('api', [
            'as' => 'api',
            'display_name' => 'Api',
            'slug' => 'api',
            'prefix' => '/',
            'middleware' => ['api'],
        ]);
        $context->any('/', function(){
            return response()->json(['message' => 'Hello World']);
        });

    }

    public function boot()
    {
        // Routes sẽ được load bởi RouteManager trong AppServiceProvider
        // Không cần load routes ở đây nữa
    }
} 