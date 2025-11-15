<?php

namespace Modules\PWA;

use Illuminate\Support\ServiceProvider;
use Modules\PWA\Services\PWAService;
use Modules\PWA\Services\PWAServiceInterface;
use Modules\PWA\Providers\PWARouteServiceProvider;

class BootstrapProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(PWAServiceInterface::class, PWAService::class);
        $this->app->register(PWARouteServiceProvider::class);
    }

    public function boot()
    {
        // Load config
        // $this->publishes([
        //     __DIR__ . '/../Config/pwa.php' => config_path('pwa.php'),
        // ], 'pwa-config');
    }
}
