<?php

namespace Modules\Home;

use Illuminate\Support\ServiceProvider;
use Modules\Home\Services\HomeService;
use Modules\Home\Services\HomeServiceInterface;
use Modules\Home\Providers\HomeRouteServiceProvider;

class BootstrapProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register HomeService
        $this->app->bind(HomeServiceInterface::class, HomeService::class);
        $this->app->register(HomeRouteServiceProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        
    }
}
