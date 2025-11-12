<?php

namespace Contexts\Admin\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Kiểm tra authentication
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return redirect()->route('login');
        }

        // Kiểm tra quyền admin
        if (!Auth::user()->is_admin) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Forbidden'], 403);
            }
            return redirect()->route('web.home')->with('error', 'Không có quyền truy cập');
        }

        // Thêm headers cho Admin Channel
        $response = $next($request);
        $response->headers->set('X-Channel', 'admin');
        
        return $response;
    }
} 