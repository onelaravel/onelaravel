<?php

use Illuminate\Support\Facades\Route;
use Core\System;
use Core\Support\SPA;

Route::middleware(['webview'])->group(function () {
    SPA::active();
    SPA::resetRoutes();
    System::context('admin')?->pushLaravelRoute();
    System::context('web')?->pushLaravelRoute();
    // SPA::resetRoutes();
    SPA::inactive();

    
});
