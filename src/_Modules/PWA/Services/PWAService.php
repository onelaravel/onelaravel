<?php

namespace Modules\PWA\Services;

use Modules\PWA\Services\PWAServiceInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class PWAService implements PWAServiceInterface
{
    protected array $defaultConfig;
    
    public function __construct()
    {
        $this->defaultConfig = [
            'name' => 'LeanEZ Chat Widget',
            'short_name' => 'LeanEZ Chat',
            'description' => 'AI Chat Widget for customer support with real-time messaging',
            'start_url' => '/',
            'display' => 'standalone',
            'background_color' => '#667eea',
            'theme_color' => '#667eea',
            'scope' => '/',
            'orientation' => 'portrait',
            'categories' => ['business', 'productivity', 'communication'],
            'lang' => 'vi',
            'dir' => 'ltr',
            'prefer_related_applications' => false,
            'cache_version' => 'v2',
            'static_cache' => 'static-v2',
            'dynamic_cache' => 'dynamic-v2'
        ];
    }
    
    public function generateManifest(): array
    {
        $config = $this->getConfig();
        
        return [
            'name' => $config['name'],
            'short_name' => $config['short_name'],
            'description' => $config['description'],
            'start_url' => $config['start_url'],
            'display' => $config['display'],
            'background_color' => $config['background_color'],
            'theme_color' => $config['theme_color'],
            'scope' => $config['scope'],
            'orientation' => $config['orientation'],
            'categories' => $config['categories'],
            'lang' => $config['lang'],
            'dir' => $config['dir'],
            'prefer_related_applications' => $config['prefer_related_applications'],
            'icons' => $this->generateIcons(),
            'screenshots' => $this->generateScreenshots(),
            'shortcuts' => $this->generateShortcuts(),
        ];
    }
    
    public function generateServiceWorker(): string
    {
        $config = $this->getConfig();
        
        return <<<JS
const CACHE_NAME = 'leanez-chat-{$config['cache_version']}';
const STATIC_CACHE = '{$config['static_cache']}';
const DYNAMIC_CACHE = '{$config['dynamic_cache']}';

const urlsToCache = [
  '/',
  '/chat/',
  '/assets/avatar.png',
  '/manifest.json',
  '/static/js/main.js',
  '/static/css/main.css',
  '/favicon.ico'
];

const STATIC_ASSETS = [
  '/assets/avatar.png',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('✅ Static cache opened');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('✅ Dynamic cache opened');
        return cache.addAll(urlsToCache);
      })
    ]).then(() => {
      console.log('✅ All resources cached');
      return self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle dynamic content
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Background sync (if needed)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
});

// Push notification (if needed)
self.addEventListener('push', (event) => {
  console.log('🔄 Push notification received');
  const options = {
    body: 'Bạn có tin nhắn mới!',
    icon: '/assets/avatar.png',
    badge: '/assets/avatar.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('{$config['name']}', options)
  );
});
JS;
    }
    
    public function generateSW(): string
    {
        return <<<JS
// Simple service worker to clear cache
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Always fetch from network, never from cache
  event.respondWith(fetch(event.request));
});
JS;
    }
    
    public function getConfig(): array
    {
        return Cache::remember('pwa_config', 3600, function () {
            return array_merge($this->defaultConfig, config('pwa', []));
        });
    }
    
    public function updateConfig(array $config): bool
    {
        $mergedConfig = array_merge($this->getConfig(), $config);
        
        // Clear cache
        Cache::forget('pwa_config');
        
        // Store new config
        Cache::put('pwa_config', $mergedConfig, 3600);
        
        return true;
    }
    
    protected function generateIcons(): array
    {
        $sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        $icons = [];
        
        foreach ($sizes as $size) {
            $icons[] = [
                'src' => "/assets/avatar.png",
                'sizes' => "{$size}x{$size}",
                'type' => 'image/png',
                'purpose' => 'any maskable'
            ];
        }
        
        return $icons;
    }
    
    protected function generateScreenshots(): array
    {
        return [
            [
                'src' => '/assets/avatar.png',
                'sizes' => '1280x720',
                'type' => 'image/png',
                'form_factor' => 'wide',
                'label' => 'Chat Widget Interface'
            ],
            [
                'src' => '/assets/avatar.png',
                'sizes' => '750x1334',
                'type' => 'image/png',
                'form_factor' => 'narrow',
                'label' => 'Mobile Chat Interface'
            ]
        ];
    }
    
    protected function generateShortcuts(): array
    {
        return [
            [
                'name' => 'Open Chat',
                'short_name' => 'Chat',
                'description' => 'Open the chat widget',
                'url' => '/chat',
                'icons' => [
                    [
                        'src' => '/assets/avatar.png',
                        'sizes' => '96x96'
                    ]
                ]
            ],
            [
                'name' => 'Home',
                'short_name' => 'Home',
                'description' => 'Go to homepage',
                'url' => '/',
                'icons' => [
                    [
                        'src' => '/assets/avatar.png',
                        'sizes' => '96x96'
                    ]
                ]
            ]
        ];
    }
}
