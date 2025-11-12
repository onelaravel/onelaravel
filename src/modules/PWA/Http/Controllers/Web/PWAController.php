<?php

namespace Modules\PWA\Http\Controllers\Web;

use Modules\PWA\Services\PWAServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Contexts\Web\Controllers\BaseWebController;

class PWAController extends BaseWebController
{
    public function __construct(
        private PWAServiceInterface $pwaService
    ) {}
    
    /**
     * Generate dynamic manifest.json
     */
    public function manifest(Request $request)
    {
        $manifest = $this->pwaService->generateManifest();
        
        return response()
            ->json($manifest)
            ->header('Content-Type', 'application/manifest+json')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
    
    /**
     * Generate dynamic service-worker.js
     */
    public function serviceWorker(Request $request): Response
    {
        $content = $this->pwaService->generateServiceWorker();
        
        return response($content)
            ->header('Content-Type', 'application/javascript')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
    
    /**
     * Generate dynamic sw.js
     */
    public function sw(Request $request): Response
    {
        $content = $this->pwaService->generateSW();
        
        return response($content)
            ->header('Content-Type', 'application/javascript')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
    
    /**
     * Show PWA configuration page
     */
    public function config(Request $request)
    {
        $config = $this->pwaService->getConfig();
        
        return view('pwa::config', compact('config'));
    }
    
    /**
     * Update PWA configuration
     */
    public function updateConfig(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50',
            'description' => 'required|string|max:500',
            'background_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            'theme_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
            'cache_version' => 'required|string|max:10',
        ]);
        
        $updated = $this->pwaService->updateConfig($request->all());
        
        if ($updated) {
            return redirect()->back()->with('success', 'PWA configuration updated successfully!');
        }
        
        return redirect()->back()->with('error', 'Failed to update PWA configuration.');
    }
}
