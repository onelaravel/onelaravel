<?php

namespace Modules\PWA\Providers;

use Illuminate\Support\ServiceProvider;
use Core\System;
use Modules\PWA\Http\Controllers\Web\PWAController as WebPWAController;
use Modules\PWA\Http\Controllers\Admin\PWAController as AdminPWAController;

class PWARouteServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Web routes for PWA files - Priority cao (1) để được đăng ký trước
        System::context('web')->module(['slug' => 'pwa', 'priority' => 1])->controller(WebPWAController::class)->as('pwa')
            ->title('PWA Configuration')
            ->description('Progressive Web App Configuration')
            ->displayName('PWA Config')
            ->group(function ($module) {
                $module->get('/manifest.json', 'manifest')->name('manifest');
                $module->get('/service-worker.js', 'serviceWorker')->name('service-worker');
                $module->get('/sw.js', 'sw')->name('sw');
                $module->get('/config', 'config')->name('config');
                $module->post('/config', 'updateConfig')->name('update-config');
            });

        // Admin routes for PWA management - Priority cao (1) để được đăng ký trước
        System::context('admin')->module(['slug' => 'pwa', 'priority' => 1])->controller(AdminPWAController::class)->as('pwa')
            ->title('PWA Management')
            ->description('Manage Progressive Web App Configuration')
            ->displayName('PWA Management')
            ->group(function ($module) {
                $module->get('/', 'index')->name('index');
                $module->get('/edit', 'edit')->name('edit');
                $module->put('/update', 'update')->name('update');
                $module->get('/preview/manifest', 'previewManifest')->name('preview.manifest');
                $module->get('/preview/service-worker', 'previewServiceWorker')->name('preview.service-worker');
            });
    }
}
