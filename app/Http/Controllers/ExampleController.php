<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class ExampleController extends Controller
{
    public function index()
    {
        // ===== 1. DATA TỪ CONTROLLER =====
        $user = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'Admin',
            'id' => 1,
            'joined' => '2021-01-01',
            'status' => 'active'
        ];
        
        $items = [
            ['id' => 1, 'name' => 'Item 1', 'price' => 100],
            ['id' => 2, 'name' => 'Item 2', 'price' => 200],
            ['id' => 3, 'name' => 'Item 3', 'price' => 300],
        ];
        
        $customData = [
            'message' => 'Hello from controller!',
            'timestamp' => now(),
            'controller_name' => 'ExampleController',
            'method_name' => 'index'
        ];
        
        // ===== 2. SHARE DATA GLOBALLY =====
        View::share('global_config', [
            'app_name' => config('app.name'),
            'app_version' => '1.0.0',
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug'),
        ]);
        
        View::share('current_request', [
            'url' => request()->url(),
            'method' => request()->method(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
        
        // ===== 3. RETURN VIEW VỚI DATA =====
        return view('web.home', [
            'user' => $user,
            'items' => $items,
            'custom_data' => $customData,
            'controller_data' => [
                'controller' => 'ExampleController',
                'method' => 'index',
                'timestamp' => now(),
            ]
        ]);
    }
    
    public function show($id)
    {
        // ===== 4. DATA TỪ DATABASE =====
        $user = \App\Models\User::find($id);
        
        if (!$user) {
            abort(404, 'User not found');
        }
        
        // ===== 5. DATA TỪ RELATIONSHIPS =====
        $userPosts = $user->posts()->latest()->take(5)->get();
        $userComments = $user->comments()->latest()->take(10)->get();
        
        // ===== 6. DATA TỪ SESSION =====
        $sessionData = session()->all();
        
        // ===== 7. DATA TỪ REQUEST =====
        $requestData = request()->all();
        
        // ===== 8. DATA TỪ CACHE =====
        $cacheData = cache()->remember('user_data_' . $id, 3600, function() use ($user) {
            return [
                'user' => $user,
                'posts_count' => $user->posts()->count(),
                'comments_count' => $user->comments()->count(),
                'last_login' => $user->last_login_at,
            ];
        });
        
        // ===== 9. DATA TỪ CONFIG =====
        $configData = [
            'app' => config('app'),
            'database' => config('database'),
            'cache' => config('cache'),
        ];
        
        // ===== 10. DATA TỪ SERVICES =====
        $serviceData = [
            'notification_service' => app('notification.service')->getUserNotifications($user->id),
            'analytics_service' => app('analytics.service')->getUserAnalytics($user->id),
            'payment_service' => app('payment.service')->getUserPayments($user->id),
        ];
        
        return view('web.user-detail', [
            'user' => $user,
            'user_posts' => $userPosts,
            'user_comments' => $userComments,
            'session_data' => $sessionData,
            'request_data' => $requestData,
            'cache_data' => $cacheData,
            'config_data' => $configData,
            'service_data' => $serviceData,
            'controller_data' => [
                'controller' => 'ExampleController',
                'method' => 'show',
                'user_id' => $id,
                'timestamp' => now(),
            ]
        ]);
    }
    
    public function create()
    {
        // ===== 11. DATA TỪ FORM VALIDATION =====
        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ];
        
        // ===== 12. DATA TỪ MIDDLEWARE =====
        $middlewareData = [
            'auth_user' => auth()->user(),
            'permissions' => auth()->user()->permissions ?? [],
            'roles' => auth()->user()->roles ?? [],
        ];
        
        // ===== 13. DATA TỪ EVENTS =====
        $eventData = [
            'user_created_events' => event(new \App\Events\UserCreated()),
            'user_updated_events' => event(new \App\Events\UserUpdated()),
        ];
        
        return view('web.user-create', [
            'validation_rules' => $validationRules,
            'middleware_data' => $middlewareData,
            'event_data' => $eventData,
            'controller_data' => [
                'controller' => 'ExampleController',
                'method' => 'create',
                'timestamp' => now(),
            ]
        ]);
    }
}


