<?php

namespace Contexts\Api\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Đảm bảo response luôn là JSON
        $request->headers->set('Accept', 'application/json');
        
        // Thêm headers cho API
        $response = $next($request);
        
        $response->headers->set('X-API-Version', '1.0');
        $response->headers->set('X-Channel', 'api');
        
        return $response;
    }
} 