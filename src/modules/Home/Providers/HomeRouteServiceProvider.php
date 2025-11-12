<?php

namespace Modules\Home\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use Modules\Home\Http\Controllers\Web\HomeController;

class HomeRouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => 'home', 'prefix' => '/', 'priority' => 1])->controller(HomeController::class)->as('home')->group(function ($module) {
            $module->get('/', [HomeController::class, 'index'])->name('index')->view('web.home');
            $module->get('/about', [HomeController::class, 'about'])->name('about')->view('web.about');
            $module->get('/contact', [HomeController::class, 'contact'])->name('contact')->view('web.contact');
            $module->get('/docs', [HomeController::class, 'docs'])->name('docs')->view('web.docs');
            $module->get('/examples', [HomeController::class, 'examples'])->name('examples')->view('web.examples');
        });
    }
}
