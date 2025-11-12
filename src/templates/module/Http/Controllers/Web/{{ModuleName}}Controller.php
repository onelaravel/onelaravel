<?php

namespace {{Namespace}}\Http\Controllers\Web;

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
     * Display the {{module_name}} page
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
     * Get featured content via AJAX
     */
    public function featuredContent(Request $request)
    {
        $content = $this->{{module_name}}Service->getFeaturedContent();
        
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
        $items = $this->{{module_name}}Service->getRecentItems($limit);
        
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
        $stats = $this->{{module_name}}Service->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
