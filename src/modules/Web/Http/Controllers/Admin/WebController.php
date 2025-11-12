<?php

namespace Modules\Web\Http\Controllers\Admin;

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
     * Display the web admin dashboard
     */
    public function index(): JsonResponse
    {
        $data = $this->webService->getWebData();
        $statistics = $this->webService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => [
                'module_data' => $data,
                'statistics' => $statistics
            ]
        ]);
    }

    /**
     * Get dashboard data via AJAX
     */
    public function dashboardData(): JsonResponse
    {
        $data = $this->webService->getWebData();
        $statistics = $this->webService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => [
                'module_data' => $data,
                'statistics' => $statistics
            ]
        ]);
    }

    /**
     * Get recent items for admin
     */
    public function recentItems(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $items = $this->webService->getRecentItems($limit);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}
