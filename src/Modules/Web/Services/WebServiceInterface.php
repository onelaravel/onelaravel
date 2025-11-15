<?php

namespace Modules\Web\Services;

interface WebServiceInterface
{
    /**
     * Get web page data
     */
    public function getWebData(): array;

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
