<?php

namespace Modules\Home\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use Modules\Home\Http\Controllers\Web\HomeController;

class HomeRouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => 'home', 'prefix' => '/', 'priority' => 1])->controller(HomeController::class)->as('home')->group(function ($module) {
            $module->get('/', [HomeController::class, 'index']);
        });
    }
}
