<?php

namespace Modules\PWA\Services;

interface PWAServiceInterface
{
    /**
     * Generate dynamic manifest.json content
     */
    public function generateManifest(): array;
    
    /**
     * Generate dynamic service-worker.js content
     */
    public function generateServiceWorker(): string;
    
    /**
     * Generate dynamic sw.js content
     */
    public function generateSW(): string;
    
    /**
     * Get PWA configuration
     */
    public function getConfig(): array;
    
    /**
     * Update PWA configuration
     */
    public function updateConfig(array $config): bool;
}
