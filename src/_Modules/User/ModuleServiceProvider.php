<?php

namespace Modules\User;

use Illuminate\Support\ServiceProvider;
use Modules\User\Repositories\UserRepository;
use Modules\User\Repositories\UserRepositoryInterface;
use Modules\User\Services\UserService;
use Modules\User\Services\UserServiceInterface;
use Modules\User\Providers\UserRouteServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->register(UserRouteServiceProvider::class);
    }

    public function boot()
    {
        // Routes sẽ được load bởi RouteManager trong file route chuẩn
    }
} 