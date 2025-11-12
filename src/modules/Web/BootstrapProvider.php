<?php

namespace Modules\Web;

use Illuminate\Support\ServiceProvider;
use Modules\Web\Services\WebService;
use Modules\Web\Services\WebServiceInterface;
use Modules\Web\Providers\WebRouteServiceProvider;

class BootstrapProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register WebService
        $this->app->bind(WebServiceInterface::class, WebService::class);
        $this->app->register(WebRouteServiceProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        
    }
}
