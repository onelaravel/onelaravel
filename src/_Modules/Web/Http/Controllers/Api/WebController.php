<?php

namespace Modules\Web\Http\Controllers\Api;

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
     * Get web data
     */
    public function index(): JsonResponse
    {
        $data = $this->webService->getWebData();
        
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
        $content = $this->webService->getFeaturedContent();
        
        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get recent items
     */
    public function recentItems(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);
        $items = $this->webService->getRecentItems($limit);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Get statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->webService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
