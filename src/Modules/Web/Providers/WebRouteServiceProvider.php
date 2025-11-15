<?php

namespace Modules\Web\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use Modules\Web\Http\Controllers\Web\WebController;

class WebRouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => 'web', 'prefix' => '/web'])->controller(WebController::class)->group(function ($module) {
            $module->get('/', 'index')->name('index')->view('web.home');
            $module->get('/about', 'about')->name('about')->view('web.about');
            $module->get('/contact', 'contact')->name('contact')->view('web.contact');
            $module->get('/users', 'users')->name('users')->view('web.users');
            $module->get('/users/{id}', 'userDetail')->name('user.detail')->view('web.user-detail');
        });
    }
}
