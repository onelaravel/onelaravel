<?php

use Illuminate\Support\Facades\Route;
use Core\System;

Route::middleware(['api'])->group(function() {
    System::context('api')?->pushLaravelRoute();
});
