<?php

namespace Core\Providers;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Core\Services\ViewContextService;
use Core\Services\ViewHelperService;

class ViewContextServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(ViewContextService::class, fn() => new ViewContextService());
    }

    public function boot()
    {
        View::composer('*', function ($view) {
            $viewName = $view->getName();
            $viewId = uniqid();
            $helper = app(ViewHelperService::class);
            
            $helper->registerView($viewName, $viewId);

            // ===== CÁC CÁCH LẤY DATA TRONG VIEW COMPOSER =====
            
            // 1. Lấy data từ controller: view('test', ['user' => []])
            $viewData = $view->getData();
            $parentViewName = $viewData['__PARENT_VIEW_PATH__'] ?? null;
            $parentViewId = $viewData['__PARENT_VIEW_ID__'] ?? null;
            if ($parentViewName && $parentViewId) {
                $helper->setParentView($viewName, $viewId, $parentViewName, $parentViewId);
                $helper->addChildrenView($parentViewName, $parentViewId, $viewName, $viewId);
            }
            
            // Set biến cơ bản
            $view->with([
                '__VIEW_ID__' => $viewId,
                '__VIEW_PATH__' => $viewName,
                '__VIEW_NAME__' => $viewName,
                '__VIEW_TYPE__' => 'view',
                '__VIEW_SUBSCRIBE_INDEX__' => 0,
                '__VIEW_INCLUDE_INDEX__' => 0,
                '__VIEW_INCLUDEIF_INDEX__' => 0,
                '__VIEW_INCLUDEWHEN_INDEX__' => 0,
                '__PARENT_VIEW_NAME__' => $viewName,
                '__PARENT_VIEW_PATH__' => $viewName,
                '__PARENT_VIEW_ID__' => $viewId,
            ]);

        });

    }
}