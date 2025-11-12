<?php

namespace Modules\User\Providers;

use Illuminate\Support\ServiceProvider;
use Core\System;
use Modules\User\Http\Controllers\Admin\UserController as AdminUserController;

class UserRouteServiceProvider extends ServiceProvider
{
    public function register()
    {
        // admin module
        System::context('admin')->module('users')->controller(AdminUserController::class)->prefix('users')->as('users')
            ->title('@text:admin.users.module.title')
            ->description('@text:admin.users.module.description')
            ->displayName('@text:admin.users.module.display_name')
            ->group(function ($module) {
                $module->get('/', 'index')->name('index');
                $module->get('/create', 'create')->name('create');
                $module->post('/store', 'store')->name('store');
                $module->get('/{id}', 'show')->name('show');
                $module->get('/{id}/edit', 'edit')->name('edit');
            });


        System::context('web');
        System::context('api');
    }
}
