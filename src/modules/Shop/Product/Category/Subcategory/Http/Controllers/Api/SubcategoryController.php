<?php

namespace Modules\Shop\Product\Category\Subcategory\Http\Controllers\Api;

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
     * Get subcategory data
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
     * Get featured content
     */
    public function featuredContent(): JsonResponse
    {
        $content = $this->subcategoryService->getFeaturedContent();
        
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
        $items = $this->subcategoryService->getRecentItems($limit);
        
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
        $stats = $this->subcategoryService->getStatistics();
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
