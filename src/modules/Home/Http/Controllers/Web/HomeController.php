<?php

namespace Modules\Home\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Modules\Home\Services\HomeServiceInterface;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    protected HomeServiceInterface $homeService;

    public function __construct(HomeServiceInterface $homeService)
    {
        $this->homeService = $homeService;
    }

    /**
     * Display the home page
     */
    public function index(): View
    {
        $data = $this->homeService->getHomeData();
        
        return view('web.home', compact('data'));
    }

    /**
     * Get featured content via AJAX
     */
    public function featuredContent(Request $request)
    {
        $content = $this->homeService->getFeaturedContent();
        
        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get recent posts via AJAX
     */
    public function recentPosts(Request $request)
    {
        $limit = $request->get('limit', 5);
        $posts = $this->homeService->getRecentPosts($limit);
        
        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Get statistics via AJAX
     */
    public function statistics(Request $request)
    {
        $stats = $this->homeService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
