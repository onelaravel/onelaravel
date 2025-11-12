<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Support\ValidationRules;
use Infrastructure\Database\DatabaseService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Context Bootstraps
        $this->app->register(\Contexts\Api\Bootstrap::class);
        $this->app->register(\Contexts\Admin\Bootstrap::class);
        $this->app->register(\Contexts\Web\Bootstrap::class);

        // Register Infrastructure Services
        $this->app->singleton(DatabaseService::class, function ($app) {
            return new DatabaseService();
        });


        // Load tất cả BootstrapProvider từ src/modules
        foreach (glob(base_path('src/modules/*/BootstrapProvider.php')) as $provider) {
            $moduleName = basename(dirname($provider));
            $class = "Modules\\{$moduleName}\\BootstrapProvider";
            
            if (class_exists($class)) {
                $this->app->register($class);
            }
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register middleware aliases
        $this->app['router']->aliasMiddleware('api', \Contexts\Api\Middleware\ApiMiddleware::class);
        $this->app['router']->aliasMiddleware('web', \Contexts\Web\Middleware\WebMiddleware::class);
        $this->app['router']->aliasMiddleware('admin', \Contexts\Admin\Middleware\AdminMiddleware::class);

        // Register custom validation rules
        ValidationRules::register();

        // Load helpers
        if (file_exists(base_path('src/support/helpers.php'))) {
            require_once base_path('src/support/helpers.php');
        }

    }
}
