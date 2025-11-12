<?php

namespace {{Namespace}};

use Illuminate\Support\ServiceProvider;
use {{Namespace}}\Services\{{ModuleName}}Service;
use {{Namespace}}\Services\{{ModuleName}}ServiceInterface;
use {{Namespace}}\Providers\{{ModuleName}}RouteServiceProvider;

class BootstrapProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register {{ModuleName}}Service
        $this->app->bind({{ModuleName}}ServiceInterface::class, {{ModuleName}}Service::class);
        $this->app->register({{ModuleName}}RouteServiceProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        
    }
}
