<?php

namespace Modules\Home\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Modules\Home\Services\HomeServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    protected HomeServiceInterface $homeService;

    public function __construct(HomeServiceInterface $homeService)
    {
        $this->homeService = $homeService;
    }

    /**
     * Get home page data
     */
    public function index(): JsonResponse
    {
        $data = $this->homeService->getHomeData();
        
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get featured content
     */
    public function featuredContent(): JsonResponse
    {
        $content = $this->homeService->getFeaturedContent();
        
        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get recent posts
     */
    public function recentPosts(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);
        $posts = $this->homeService->getRecentPosts($limit);
        
        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Get statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->homeService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
