<?php

namespace Modules\Web\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Modules\Web\Services\WebServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WebController extends Controller
{
    protected WebServiceInterface $webService;

    public function __construct(WebServiceInterface $webService)
    {
        $this->webService = $webService;
    }

    /**
     * Display the web page
     */
    public function index()
    {
        $data = $this->webService->getWebData();
        
        return view('web.home', compact('data'));
    }

    public function about()
    {
        return view('web.about');
    }

    public function contact()
    {
        return view('web.contact');
    }

    public function users()
    {
        return view('web.users');
    }

    public function userDetail($id)
    {
        return view('web.user-detail', compact('id'));
    }

    /**
     * Get featured content via AJAX
     */
    public function featuredContent(Request $request)
    {
        $content = $this->webService->getFeaturedContent();
        
        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get recent items via AJAX
     */
    public function recentItems(Request $request)
    {
        $limit = $request->get('limit', 5);
        $items = $this->webService->getRecentItems($limit);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Get statistics via AJAX
     */
    public function statistics(Request $request)
    {
        $stats = $this->webService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
