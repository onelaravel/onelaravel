<?php

namespace {{Namespace}}\Services;

interface {{ModuleName}}ServiceInterface
{
    /**
     * Get {{module_name}} page data
     */
    public function get{{ModuleName}}Data(): array;

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
