<?php

namespace {{Namespace}}\Http\Controllers\Api;

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
     * Get {{module_name}} data
     */
    public function index(): JsonResponse
    {
        $data = $this->{{module_name}}Service->get{{ModuleName}}Data();
        
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
        $content = $this->{{module_name}}Service->getFeaturedContent();
        
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
        $items = $this->{{module_name}}Service->getRecentItems($limit);
        
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
        $stats = $this->{{module_name}}Service->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
