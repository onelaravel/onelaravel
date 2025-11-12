<?php

namespace Modules\Shop\Product\Category\Subcategory\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use Modules\Shop\Product\Category\Subcategory\Http\Controllers\Web\SubcategoryController;

class SubcategoryRouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => 'subcategory', 'prefix' => '/subcategory', 'priority' => 1])->controller(SubcategoryController::class)->as('subcategory')->group(function ($module) {
            $module->get('/', [SubcategoryController::class, 'index']);
        });
    }
}
