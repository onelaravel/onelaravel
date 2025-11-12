<?php

namespace Contexts\Web\Middleware;

use Closure;
use Illuminate\Http\Request;
use Contexts\Web\Middleware\NextMiddleware;

class WebMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Thêm headers cho Web Channel
        $response = $next($request);
        
        $response->headers->set('X-Channel', 'web');
        
        return $response;
    }
} 