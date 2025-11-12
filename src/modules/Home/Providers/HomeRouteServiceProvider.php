<?php

namespace Modules\Home\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use Modules\Home\Http\Controllers\Web\HomeController;

class HomeRouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => 'home', 'prefix' => '/', 'priority' => 1])->controller(HomeController::class)->as('home')->group(function ($module) {
            $module->get('/', 'index')->name('index')->view('web.home');
            $module->get('/about', 'about')->name('about')->view('web.about');
            $module->get('/contact', 'contact')->name('contact')->view('web.contact');
            $module->get('/docs', 'docs')->name('docs')->view('web.docs');
            $module->get('/examples', 'examples')->name('examples')->view('web.examples');
        });
    }
}
