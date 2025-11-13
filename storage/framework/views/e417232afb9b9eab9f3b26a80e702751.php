<?php if (true): // @serverside ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('meta:title', 'One Laravel - Advanced SPA Framework'); ?></title>
    <meta name="description" content="<?php echo $__env->yieldContent('meta:description', 'One Laravel is an advanced SPA framework that seamlessly integrates Laravel backend with reactive frontend capabilities.'); ?>">
    <meta name="keywords" content="<?php echo $__env->yieldContent('meta:keywords', 'Laravel, SPA, PHP, JavaScript, Framework, Reactive, One Laravel'); ?>">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php echo e(asset('favicon.ico')); ?>">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="<?php echo e(asset('static/assets/web/css/main.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('static/assets/web/css/components.css')); ?>">
    
    <?php echo $__env->yieldContent('styles'); ?>
</head>
<body>
    <!-- Header Navigation -->
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="<?php echo e(url('/')); ?>" class="nav-brand">One Laravel</a>
                
                <ul class="nav-menu">
                    <li><a href="<?php echo e(url('/')); ?>" data-navigate="/web">Home</a></li>
                    <li><a href="<?php echo e(url('/about')); ?>" data-navigate="/web/about">About</a></li>
                    <li><a href="<?php echo e(url('/docs')); ?>" data-navigate="/web/docs">Documentation</a></li>
                    <li><a href="<?php echo e(url('/examples')); ?>" data-navigate="/web/examples">Examples</a></li>
                    <li><a href="<?php echo e(url('/contact')); ?>" data-navigate="/web/contact">Contact</a></li>
                </ul>
                
                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" style="display: none;">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    </header>
    <?php endif; // @endserverside ?>
    <!-- Main Content -->
    <main id="spa-content" class="spa-content" data-server-rendered="true">
        <?php echo $__env->yieldContent('content'); ?>
    </main>
    <?php if (true): // @serverside ?>
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h5>One Laravel</h5>
                    <p>Advanced SPA Framework combining Laravel's power with modern frontend reactivity.</p>
                </div>
                <div class="col">
                    <h6>Resources</h6>
                    <ul style="list-style: none;">
                        <li><a href="<?php echo e(url('/docs')); ?>">Documentation</a></li>
                        <li><a href="<?php echo e(url('/examples')); ?>">Examples</a></li>
                        <li><a href="https://github.com/one-laravel/framework" target="_blank">GitHub</a></li>
                    </ul>
                </div>
                <div class="col">
                    <h6>Community</h6>
                    <ul style="list-style: none;">
                        <li><a href="<?php echo e(url('/contact')); ?>">Contact</a></li>
                        <li><a href="#" target="_blank">Discord</a></li>
                        <li><a href="#" target="_blank">Twitter</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="text-center mt-4" style="border-top: 1px solid #404040; padding-top: 2rem; margin-top: 2rem;">
                <p>&copy; <?php echo e(date('Y')); ?> One Laravel. Built with ❤️ for developers.</p>
            </div>
        </div>
    </footer>

    <!-- SPA Loading Indicator -->
    <div id="spa-loading" class="loading-indicator" style="
        position: fixed;
        top: 0;
        right: 20px;
        z-index: 9999;
        background: var(--primary-color);
        color: white;
        padding: 10px 20px;
        border-radius: 0 0 8px 8px;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    ">
        <span class="loading"></span>
        Loading...
    </div>

    <!-- SPA Configuration - Must be defined BEFORE scripts load -->
    <!-- Note: This script runs immediately (no defer) so APP_CONFIGS is available when defer scripts execute -->
    <script>
        // SPA Configuration
        <?php
            // Store functions separately
            $beforeEachFunc = 'function(to, from) {
                console.log(\'Navigating to:\', to.path);
                return true;
            }';
            $afterEachFunc = 'function(to, from) {
                console.log(\'Navigation complete:\', to.path);
                updateActiveNav(to.path);
            }';
            
            $config = [
                'api' => [
                    'csrfToken' => csrf_token(),
                    'baseUrl' => url('/')
                ],
                'mode' => config('app.debug') ? 'development' : 'production',
                'defaultRoute' => '/web',
                'container' => '#spa-content',
                'router' => [
                    'mode' => 'history',
                    'base' => '/',
                    'allRoutes' => $__helper->exportSpaRoutes(),
                    'routes' => $__helper->exportComponentRoutes(),
                    'beforeEach' => '__FUNCTION_BEFORE_EACH__',
                    'afterEach' => '__FUNCTION_AFTER_EACH__'
                ],
                'view' => [
                    'systemData' => [
                        'ref' => 'config',
                        'title' => trim(view()->yieldContent('meta:title') ?: 'One Laravel - Advanced SPA Framework')
                    ],
                    'superView' => $__VIEW_PATH__ ?? null,
                    'ssrData' => $__helper->exportApplicationViewData()
                ]
            ];
            
            $json = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            // Replace function placeholders with actual functions
            $json = str_replace('"__FUNCTION_BEFORE_EACH__"', $beforeEachFunc, $json);
            $json = str_replace('"__FUNCTION_AFTER_EACH__"', $afterEachFunc, $json);
        ?>
        window.APP_CONFIGS = <?php echo $json; ?>;
        

        // Function to update active navigation link
        function updateActiveNav(currentPath) {
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                const navigatePath = link.getAttribute('data-navigate');
                if (href === currentPath || navigatePath === currentPath) {
                    link.classList.add('active');
                }
            });
        }

        // Global error handling
        window.addEventListener('error', function(e) {
            if (window.APP_CONFIGS.mode === 'development') {
                console.error('Global error:', e.error);
            }
        });

        // Performance monitoring
        if (window.APP_CONFIGS.mode === 'development') {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms');
                    }
                }, 100);
            });
        }

        // Debug: Log APP_CONFIGS and check scripts
        console.log('📋 APP_CONFIGS defined:', typeof window.APP_CONFIGS !== 'undefined');
        console.log('📋 APP_CONFIGS:', window.APP_CONFIGS);
        console.log('📋 Routes:', window.APP_CONFIGS?.router?.routes);
        console.log('📋 App available:', typeof App !== 'undefined');
        console.log('📋 window.App available:', typeof window.App !== 'undefined');
        
        // Check if scripts are loaded
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const mainScript = scripts.find(s => s.src.includes('main.js'));
        console.log('📋 Scripts loaded:', scripts.length);
        console.log('📋 main.js found:', !!mainScript);
        if (mainScript) {
            console.log('📋 main.js src:', mainScript.src);
            console.log('📋 main.js loaded:', mainScript.complete);
        }
        
        // Listen for script load errors
        window.addEventListener('error', function(e) {
            if (e.target && e.target.tagName === 'SCRIPT') {
                console.error('❌ Script load error:', e.target.src, e.message);
            }
        }, true);
        
        // Initialize navigation and SPA App after DOM and scripts are ready
        let retryCount = 0;
        const maxRetries = 50; // Max 5 seconds (50 * 100ms)
        
        function initializeSPA() {
            // Update navigation
            updateActiveNav();
            
            // Check if App is available (try both App and window.App)
            const AppInstance = typeof App !== 'undefined' ? App : (typeof window.App !== 'undefined' ? window.App : null);
            
            if (!AppInstance || !AppInstance.init) {
                retryCount++;
                if (retryCount < maxRetries) {
                    console.log(`⏳ Waiting for App to load... (${retryCount}/${maxRetries})`);
                    console.log('   - typeof App:', typeof App);
                    console.log('   - typeof window.App:', typeof window.App);
                    // Retry after a short delay
                    setTimeout(initializeSPA, 100);
                    return;
                } else {
                    console.error('❌ App failed to load after', maxRetries * 100, 'ms');
                    console.error('   - typeof App:', typeof App);
                    console.error('   - typeof window.App:', typeof window.App);
                    console.error('   - Please check if scripts are loaded correctly');
                    console.error('   - Check browser console for script loading errors');
                    return;
                }
            }
            
            // Reset retry count on success
            retryCount = 0;
            
            // Initialize SPA App if available
            // Note: App.init() is also called from index.js when APP_CONFIGS is available
            // This is a fallback in case index.js hasn't loaded yet
            if (!AppInstance.isInitialized) {
                console.log('🚀 Initializing SPA from base.blade.php');
                try {
                    AppInstance.init();
                    console.log('✅ App.init() called successfully');
                    
                    // Check Router after initialization
                    setTimeout(() => {
                        if (AppInstance.Router) {
                            console.log('✅ Router is available');
                            console.log('📋 Router routes:', AppInstance.Router.routes?.length || 0, 'routes');
                            console.log('📋 Router currentUri:', AppInstance.Router.currentUri);
                            console.log('📋 Router mode:', AppInstance.Router.mode);
                            console.log('📋 Auto navigation setup:', typeof AppInstance.Router._autoNavHandler !== 'undefined' ? '✅' : '❌');
                        } else {
                            console.error('❌ Router is not available');
                        }
                    }, 500);
                } catch (error) {
                    console.error('❌ Error initializing App:', error);
                }
            } else {
                console.log('ℹ️ App already initialized');
            }
        }
        
        // Wait for DOM and scripts to be ready
        // Scripts with defer attribute will execute after DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                // Wait for defer scripts to load and execute
                // Start checking immediately, will retry if App not ready
                setTimeout(initializeSPA, 100);
            });
        } else {
            // DOM already loaded, start checking for App
            setTimeout(initializeSPA, 100);
        }
        
        // Also listen for window load event as fallback
        window.addEventListener('load', function() {
            console.log('📋 Window load event fired');
            console.log('📋 App at load:', typeof App !== 'undefined' ? 'defined' : 'undefined');
            console.log('📋 window.App at load:', typeof window.App !== 'undefined' ? 'defined' : 'undefined');
            
            const AppInstance = typeof App !== 'undefined' ? App : (typeof window.App !== 'undefined' ? window.App : null);
            if (AppInstance && AppInstance.init && !AppInstance.isInitialized) {
                console.log('🚀 Initializing SPA after window load event');
                initializeSPA();
            } else if (!AppInstance) {
                console.error('❌ App still not available after window load');
                console.error('   - Check Network tab for script loading errors');
                console.error('   - Check if main.js is accessible');
                console.error('   - Try rebuilding: npm run build:webpack');
            }
        });
        
        // Listen for when main.js script loads
        document.addEventListener('DOMContentLoaded', function() {
            // Check after a delay to see if scripts executed
            setTimeout(() => {
                console.log('📋 After DOMContentLoaded + 500ms:');
                console.log('   - App:', typeof App !== 'undefined' ? '✅' : '❌');
                console.log('   - window.App:', typeof window.App !== 'undefined' ? '✅' : '❌');
                
                if (typeof window.App === 'undefined') {
                    console.error('❌ window.App is still undefined after scripts should have loaded');
                    console.error('   - This means main.js did not execute or had an error');
                    console.error('   - Check browser Network tab for main.js');
                    console.error('   - Check browser Console for JavaScript errors');
                }
            }, 500);
        });
    </script>

    <!-- Core JavaScript for SPA - Load after APP_CONFIGS is defined -->
    <?php echo $__env->make('partials.assets-scripts', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    
    <!-- Debug: Monitor script loading -->
    <script>
        // Monitor when scripts finish loading
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 DOMContentLoaded fired');
            
            // Check all scripts
            const allScripts = Array.from(document.querySelectorAll('script[src]'));
            console.log('📋 Total scripts with src:', allScripts.length);
            
            allScripts.forEach((script, index) => {
                script.addEventListener('load', function() {
                    console.log(`✅ Script ${index + 1} loaded:`, script.src.split('/').pop());
                    if (script.src.includes('main.js')) {
                        console.log('✅ main.js loaded! Checking for App...');
                        setTimeout(() => {
                            console.log('   - App:', typeof App !== 'undefined' ? '✅' : '❌');
                            console.log('   - window.App:', typeof window.App !== 'undefined' ? '✅' : '❌');
                        }, 100);
                    }
                });
                
                script.addEventListener('error', function() {
                    console.error(`❌ Script ${index + 1} failed to load:`, script.src);
                });
            });
        });
    </script>

    <!-- Fallback: Ensure App is initialized after scripts load -->
    <script>
        // This script runs after defer scripts should have executed
        // It ensures App is initialized even if index.js didn't run
        (function() {
            let attempts = 0;
            const maxAttempts = 30; // 3 seconds
            
            function ensureAppInit() {
                attempts++;
                
                // Check for App (from webpack UMD or index.js)
                const AppInstance = typeof App !== 'undefined' ? App : 
                                   (typeof window.App !== 'undefined' ? window.App : null);
                
                if (AppInstance && AppInstance.init) {
                    console.log('✅ App found in fallback script');
                    
                    if (!AppInstance.isInitialized) {
                        try {
                            AppInstance.init();
                            console.log('✅ App.init() called from fallback script');
                        } catch (error) {
                            console.error('❌ Error in fallback App.init():', error);
                        }
                    }
                    return true;
                }
                
                if (attempts < maxAttempts) {
                    setTimeout(ensureAppInit, 100);
                } else {
                    console.error('❌ App not found after', maxAttempts * 100, 'ms in fallback');
                    console.error('   - main.js may not have executed');
                    console.error('   - Check Network tab for 404 errors on main.js');
                    console.error('   - Check Console for JavaScript errors');
                }
                
                return false;
            }
            
            // Start checking after DOMContentLoaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(ensureAppInit, 200);
                });
            } else {
                setTimeout(ensureAppInit, 200);
            }
        })();
    </script>

    <!-- SPA Ready Handler -->
    <script>
        document.addEventListener('app:ready', function(event) {
            console.log('🎉 SPA is ready!');
            if (window.App && window.App.View) {
                window.App.View.__curentMasterView__ = 'layouts.base';
            }
        });
    </script>

    <?php echo $__env->yieldContent('scripts'); ?>
</body>
</html>
<?php endif; // @endserverside ?><?php /**PATH /Users/doanln/Desktop/2025/Projects/onelaravel/resources/views/layouts/base.blade.php ENDPATH**/ ?>