<?php

namespace Modules\Shop\Product\Category\Subcategory\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Modules\Shop\Product\Category\Subcategory\Services\SubcategoryServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubcategoryController extends Controller
{
    protected SubcategoryServiceInterface $subcategoryService;

    public function __construct(SubcategoryServiceInterface $subcategoryService)
    {
        $this->subcategoryService = $subcategoryService;
    }

    /**
     * Display the subcategory page
     */
    public function index(): JsonResponse
    {
        $data = $this->subcategoryService->getSubcategoryData();
        
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
        $content = $this->subcategoryService->getFeaturedContent();
        
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
        $items = $this->subcategoryService->getRecentItems($limit);
        
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
        $stats = $this->subcategoryService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
