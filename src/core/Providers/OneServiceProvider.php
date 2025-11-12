<?php

namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Core\Services\ViewHelperService;
use Core\Services\ViewStorageManager;
use Core\Http\ViewComposers\ViewComposer;
use Core\View\ViewFactory;
use Illuminate\View\ViewServiceProvider;
class OneServiceProvider extends ServiceProvider
{
    /**
     * Đăng ký các service cho One framework.
     */
    public function register(): void
    {
        // Đăng ký ViewStorageManager và ViewHelperService dưới dạng singleton
        $this->app->singleton(ViewStorageManager::class, function ($app) {
            return new ViewStorageManager();
        });

        $this->app->singleton(ViewHelperService::class, function ($app) {
            return new ViewHelperService($app->make(ViewStorageManager::class));
        });

    }

    /**
     * Khởi động các service cho One framework.
     */
    public function boot(): void
    {
        $this->app->register(ViewContextServiceProvider::class);
        // Register View Composer để tự động thêm các biến view vào mọi view
        // View::composer('*', ViewComposer::class);
    }
}
