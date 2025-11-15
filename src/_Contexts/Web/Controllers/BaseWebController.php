<?php

namespace Contexts\Web\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

abstract class BaseWebController extends Controller
{
    /**
     * Render view với data
     */
    protected function renderView(string $view, array $data = []): View
    {
        return view($view, $data);
    }

    /**
     * Success redirect
     */
    protected function successRedirect(string $route, string $message = 'Success'): RedirectResponse
    {
        return redirect()->route($route)->with('success', $message);
    }

    /**
     * Error redirect
     */
    protected function errorRedirect(string $route, string $message = 'Error'): RedirectResponse
    {
        return redirect()->route($route)->with('error', $message);
    }

    /**
     * Back redirect với message
     */
    protected function backWithMessage(string $message, string $type = 'success'): RedirectResponse
    {
        return redirect()->back()->with($type, $message);
    }

    /**
     * Validate và redirect nếu có lỗi
     */
    protected function validateAndRedirect(array $data, array $rules, array $messages = []): bool|RedirectResponse
    {
        $validator = validator($data, $rules, $messages);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        return true;
    }

    /**
     * Check user authentication
     */
    protected function requireAuth(): bool
    {
        if (!Auth::check()) {
            return false;
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
        if (!$this->requireAuth()) {
            return false;
        }
        
        if (!$this->isAdmin()) {
            return false;
        }
        
        return true;
    }

    /**
     * Flash message cho session
     */
    protected function flashMessage(string $message, string $type = 'info'): void
    {
        session()->flash($type, $message);
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
} 