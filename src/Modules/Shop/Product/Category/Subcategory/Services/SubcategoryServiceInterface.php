<?php

namespace Modules\Shop\Product\Category\Subcategory\Services;

interface SubcategoryServiceInterface
{
    /**
     * Get subcategory page data
     */
    public function getSubcategoryData(): array;

    /**
     * Get featured content
     */
    public function getFeaturedContent(): array;

    /**
     * Get recent items
     */
    public function getRecentItems(int $limit = 5): array;

    /**
     * Get statistics
     */
    public function getStatistics(): array;
}
