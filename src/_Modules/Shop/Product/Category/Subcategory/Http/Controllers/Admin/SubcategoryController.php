<?php

namespace Modules\Shop\Product\Category\Subcategory\Http\Controllers\Admin;

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
     * Display the subcategory admin dashboard
     */
    public function index(): JsonResponse
    {
        $data = $this->subcategoryService->getSubcategoryData();
        $statistics = $this->subcategoryService->getStatistics();
        
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
        $data = $this->subcategoryService->getSubcategoryData();
        $statistics = $this->subcategoryService->getStatistics();
        
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
        $items = $this->subcategoryService->getRecentItems($limit);
        
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}
