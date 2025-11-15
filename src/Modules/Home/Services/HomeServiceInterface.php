<?php

namespace Modules\Home\Services;

interface HomeServiceInterface
{
    /**
     * Get home page data
     */
    public function getHomeData(): array;

    /**
     * Get featured content
     */
    public function getFeaturedContent(): array;

    /**
     * Get recent posts
     */
    public function getRecentPosts(int $limit = 5): array;

    /**
     * Get statistics
     */
    public function getStatistics(): array;
}
