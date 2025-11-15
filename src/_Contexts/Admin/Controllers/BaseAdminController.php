<?php

namespace Contexts\Admin\Controllers;

use Shared\BaseController;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

abstract class BaseAdminController extends BaseController
{
    /**
     * Render admin view với data
     */
    protected function renderAdminView(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        return view("admin.{$view}", $data);
    }

    /**
     * Set common admin data
     */
    protected function setAdminData(array &$data): void
    {
        $data['currentUser'] = $this->getCurrentUser();
        $data['isAdmin'] = $this->isAdmin();
        $data['pageTitle'] = $data['pageTitle'] ?? 'Admin Dashboard';
        $data['breadcrumbs'] = $data['breadcrumbs'] ?? [];
    }

    /**
     * Set page title
     */
    protected function setPageTitle(string $title): void
    {
        view()->share('pageTitle', $title);
    }

    /**
     * Set breadcrumbs
     */
    protected function setBreadcrumbs(array $breadcrumbs): void
    {
        view()->share('breadcrumbs', $breadcrumbs);
    }

    /**
     * Success redirect cho admin
     */
    protected function adminSuccessRedirect(string $route, string $message = 'Success'): RedirectResponse
    {
        return redirect()->route($route)->with('success', $message);
    }

    /**
     * Error redirect cho admin
     */
    protected function adminErrorRedirect(string $route, string $message = 'Error'): RedirectResponse
    {
        return redirect()->route($route)->with('error', $message);
    }

    /**
     * Back redirect với message cho admin
     */
    protected function adminBackWithMessage(string $message, string $type = 'success'): RedirectResponse
    {
        return redirect()->back()->with($type, $message);
    }

    /**
     * Validate và redirect nếu có lỗi cho admin
     */
    protected function adminValidateAndRedirect(array $data, array $rules, array $messages = []): bool|RedirectResponse
    {
        $validator = Validator::make($data, $rules, $messages);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        return true;
    }

    /**
     * Get current user
     */
    protected function getCurrentUser()
    {
        return Auth::user();
    }

    /**
     * Check if user is admin
     */
    protected function isAdmin(): bool
    {
        $user = $this->getCurrentUser();
        return $user && $user->is_admin;
    }

    /**
     * Require admin access
     */
    protected function requireAdmin(): bool
    {
        if (!Auth::check()) {
            return false;
        }
        
        if (!$this->isAdmin()) {
            return false;
        }
        
        return true;
    }

    /**
     * Require admin access or abort
     */
    protected function requireAdminOrAbort(): void
    {
        if (!$this->requireAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }
    }

    /**
     * Get admin layout
     */
    protected function getAdminLayout(): string
    {
        return 'admin.layouts.app';
    }

    /**
     * Render admin view với layout
     */
    protected function renderAdminViewWithLayout(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['layout'] = $this->getAdminLayout();
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với sidebar
     */
    protected function renderAdminViewWithSidebar(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['showSidebar'] = true;
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với header
     */
    protected function renderAdminViewWithHeader(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['showHeader'] = true;
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với footer
     */
    protected function renderAdminViewWithFooter(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['showFooter'] = true;
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với full layout
     */
    protected function renderAdminViewFull(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['showSidebar'] = true;
        $data['showHeader'] = true;
        $data['showFooter'] = true;
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với minimal layout
     */
    protected function renderAdminViewMinimal(string $view, array $data = []): View
    {
        $this->setAdminData($data);
        $data['showSidebar'] = false;
        $data['showHeader'] = false;
        $data['showFooter'] = false;
        return view("admin.{$view}", $data);
    }

    /**
     * Render admin view với custom layout
     */
    protected function renderAdminViewCustom(string $view, string $layout, array $data = []): View
    {
        $this->setAdminData($data);
        $data['layout'] = $layout;
        return view("admin.{$view}", $data);
    }

    /**
     * Success response cho admin API
     */
    protected function adminSuccessResponse($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return $this->successResponse($data, $message, $code);
    }

    /**
     * Error response cho admin API
     */
    protected function adminErrorResponse(string $message = 'Error', int $code = 400, $errors = null): JsonResponse
    {
        return $this->errorResponse($message, $code, $errors);
    }

    /**
     * Validation error response cho admin API
     */
    protected function adminValidationErrorResponse($errors): JsonResponse
    {
        return $this->validationErrorResponse($errors);
    }

    /**
     * Not found response cho admin API
     */
    protected function adminNotFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->notFoundResponse($message);
    }

    /**
     * Unauthorized response cho admin API
     */
    protected function adminUnauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->unauthorizedResponse($message);
    }

    /**
     * Forbidden response cho admin API
     */
    protected function adminForbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->forbiddenResponse($message);
    }

    /**
     * Conflict response cho admin API
     */
    protected function adminConflictResponse(string $message = 'Conflict'): JsonResponse
    {
        return $this->conflictResponse($message);
    }

    /**
     * Paginated response cho admin API
     */
    protected function adminPaginatedResponse($data, string $message = 'Success'): JsonResponse
    {
        return $this->paginatedResponse($data, $message);
    }

    /**
     * Get admin menu
     */
    protected function getAdminMenu(): array
    {
        return [
            'dashboard' => [
                'name' => 'Dashboard',
                'icon' => 'fas fa-tachometer-alt',
                'url' => route('admin.dashboard'),
                'active' => request()->routeIs('admin.dashboard'),
            ],
            'users' => [
                'name' => 'Users',
                'icon' => 'fas fa-users',
                'url' => route('admin.user.index'),
                'active' => request()->routeIs('admin.user.*'),
            ],
            'settings' => [
                'name' => 'Settings',
                'icon' => 'fas fa-cog',
                'url' => route('admin.setting.index'),
                'active' => request()->routeIs('admin.setting.*'),
            ],
        ];
    }

    /**
     * Set admin menu
     */
    protected function setAdminMenu(): void
    {
        view()->share('adminMenu', $this->getAdminMenu());
    }

    /**
     * Get admin notifications
     */
    protected function getAdminNotifications(): array
    {
        return [
            // Implement notification logic here
        ];
    }

    /**
     * Set admin notifications
     */
    protected function setAdminNotifications(): void
    {
        view()->share('adminNotifications', $this->getAdminNotifications());
    }

    /**
     * Get admin stats
     */
    protected function getAdminStats(): array
    {
        return [
            'totalUsers' => 0,
            'totalOrders' => 0,
            'totalRevenue' => 0,
            'totalProducts' => 0,
        ];
    }

    /**
     * Set admin stats
     */
    protected function setAdminStats(): void
    {
        view()->share('adminStats', $this->getAdminStats());
    }

    /**
     * Set all admin data
     */
    protected function setAllAdminData(): void
    {
        $this->setAdminMenu();
        $this->setAdminNotifications();
        $this->setAdminStats();
    }

    /**
     * Render admin view với tất cả data
     */
    protected function renderAdminViewComplete(string $view, array $data = []): View
    {
        $this->setAllAdminData();
        return $this->renderAdminView($view, $data);
    }
} 