<?php

namespace Modules\Shop\Product\Category\Subcategory\Services;

class SubcategoryService implements SubcategoryServiceInterface
{
    /**
     * Get subcategory page data
     */
    public function getSubcategoryData(): array
    {
        return [
            'title' => 'Welcome to Subcategory Module',
            'description' => 'A modern module built with Laravel',
            'version' => '1.0.0',
            'features' => $this->getFeatures(),
            'statistics' => $this->getStatistics(),
            'recent_items' => $this->getRecentItems(),
        ];
    }

    /**
     * Get featured content
     */
    public function getFeaturedContent(): array
    {
        return [
            [
                'title' => 'Fast Performance',
                'description' => 'Built with modern technologies for optimal speed',
                'icon' => 'speed',
            ],
            [
                'title' => 'Responsive Design',
                'description' => 'Works perfectly on all devices and screen sizes',
                'icon' => 'responsive',
            ],
            [
                'title' => 'Easy to Use',
                'description' => 'Intuitive interface designed for the best user experience',
                'icon' => 'user-friendly',
            ],
        ];
    }

    /**
     * Get recent items
     */
    public function getRecentItems(int $limit = 5): array
    {
        // Mock data - replace with actual database queries
        return [
            [
                'id' => 1,
                'title' => 'Getting Started with Subcategory',
                'excerpt' => 'Learn how to use the Subcategory module...',
                'created_at' => now()->subDays(1),
                'author' => 'Admin',
            ],
            [
                'id' => 2,
                'title' => 'Subcategory Best Practices',
                'excerpt' => 'Discover the best practices for Subcategory development...',
                'created_at' => now()->subDays(3),
                'author' => 'Developer',
            ],
            [
                'id' => 3,
                'title' => 'Subcategory Configuration',
                'excerpt' => 'Master Subcategory configuration and setup...',
                'created_at' => now()->subDays(5),
                'author' => 'Expert',
            ],
        ];
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return [
            'total_items' => 1250,
            'total_categories' => 89,
            'total_views' => 15600,
            'active_items' => 45,
        ];
    }

    /**
     * Get features list
     */
    private function getFeatures(): array
    {
        return [
            'Subcategory Management',
            'Category Organization',
            'Search & Filter',
            'Real-time Updates',
            'Responsive Design',
            'API Integration',
        ];
    }
}
