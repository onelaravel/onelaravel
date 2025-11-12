<?php

namespace Modules\Home\Services;

class HomeService implements HomeServiceInterface
{
    /**
     * Get home page data
     */
    public function getHomeData(): array
    {
        return [
            'title' => 'Welcome to SPA App',
            'description' => 'A modern Single Page Application built with Laravel and Vue.js',
            'version' => '1.0.0',
            'features' => $this->getFeatures(),
            'statistics' => $this->getStatistics(),
            'recent_posts' => $this->getRecentPosts(),
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
     * Get recent posts
     */
    public function getRecentPosts(int $limit = 5): array
    {
        // Mock data - replace with actual database queries
        return [
            [
                'id' => 1,
                'title' => 'Getting Started with SPA',
                'excerpt' => 'Learn how to build modern single page applications...',
                'published_at' => now()->subDays(1),
                'author' => 'Admin',
            ],
            [
                'id' => 2,
                'title' => 'Laravel Best Practices',
                'excerpt' => 'Discover the best practices for Laravel development...',
                'published_at' => now()->subDays(3),
                'author' => 'Developer',
            ],
            [
                'id' => 3,
                'title' => 'Vue.js Components',
                'excerpt' => 'Master Vue.js component architecture...',
                'published_at' => now()->subDays(5),
                'author' => 'Frontend Expert',
            ],
        ];
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return [
            'total_users' => 1250,
            'total_posts' => 89,
            'total_views' => 15600,
            'online_users' => 45,
        ];
    }

    /**
     * Get features list
     */
    private function getFeatures(): array
    {
        return [
            'Single Page Application',
            'Laravel Backend API',
            'Vue.js Frontend',
            'Real-time Updates',
            'Responsive Design',
            'SEO Optimized',
        ];
    }
}
