<?php

namespace {{Namespace}}\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use {{Namespace}}\Services\{{ModuleName}}ServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class {{ModuleName}}Controller extends Controller
{
    protected {{ModuleName}}ServiceInterface ${{module_name}}Service;

    public function __construct({{ModuleName}}ServiceInterface ${{module_name}}Service)
    {
        $this->{{module_name}}Service = ${{module_name}}Service;
    }

    /**
     * Display the {{module_name}} admin dashboard
     */
    public function index(): JsonResponse
    {
        $data = $this->{{module_name}}Service->get{{ModuleName}}Data();
        $statistics = $this->{{module_name}}Service->getStatistics();
        
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
        $data = $this->{{module_name}}Service->get{{ModuleName}}Data();
        $statistics = $this->{{module_name}}Service->getStatistics();
        
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
        $items = $this->{{module_name}}Service->getRecentItems($limit);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}
