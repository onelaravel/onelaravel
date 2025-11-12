<?php

namespace {{Namespace}}\Providers;

use Core\System;
use Illuminate\Support\ServiceProvider;
use {{Namespace}}\Http\Controllers\Web\{{ModuleName}}Controller;

class {{ModuleName}}RouteServiceProvider extends ServiceProvider
{
    public function register(){
        System::context('web')->module(['slug' => '{{module_name}}', 'prefix' => '/{{module_name}}', 'priority' => 1])->controller({{ModuleName}}Controller::class)->as('{{module_name}}')->group(function ($module) {
            $module->get('/', [{{ModuleName}}Controller::class, 'index']);
        });
    }
}
