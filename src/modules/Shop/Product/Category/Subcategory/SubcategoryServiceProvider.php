<?php

namespace Modules\Shop\Product\Category\Subcategory;

use Illuminate\Support\ServiceProvider;
use Modules\Shop\Product\Category\Subcategory\Services\SubcategoryService;
use Modules\Shop\Product\Category\Subcategory\Services\SubcategoryServiceInterface;
use Modules\Shop\Product\Category\Subcategory\Providers\SubcategoryRouteServiceProvider;

class SubcategoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register SubcategoryService
        $this->app->bind(SubcategoryServiceInterface::class, SubcategoryService::class);
        $this->app->register(SubcategoryRouteServiceProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        
    }
}
