@ssr
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('meta:title', 'One Laravel - Advanced SPA Framework')</title>
    <meta name="description" content="@yield('meta:description', 'One Laravel is an advanced SPA framework that seamlessly integrates Laravel backend with reactive frontend capabilities.')">
    <meta name="keywords" content="@yield('meta:keywords', 'Laravel, SPA, PHP, JavaScript, Framework, Reactive, One Laravel')">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('static/assets/web/css/main.css') }}">
    <link rel="stylesheet" href="{{ asset('static/assets/web/css/components.css') }}">
    
    @yield('styles')
</head>
<body>
    <!-- Header Navigation -->
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="{{ url('/') }}" class="nav-brand">One Laravel</a>
                
                <ul class="nav-menu">
                    <li><a href="{{ url('/') }}" data-navigate="/web">Home</a></li>
                    <li><a href="{{ url('/about') }}" data-navigate="/web/about">About</a></li>
                    <li><a href="{{ url('/docs') }}" data-navigate="/web/docs">Documentation</a></li>
                    <li><a href="{{ url('/examples') }}" data-navigate="/web/examples">Examples</a></li>
                    <li><a href="{{ url('/contact') }}" data-navigate="/web/contact">Contact</a></li>
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
    @endssr
    <!-- Main Content -->
    <main id="spa-content" class="spa-content" data-server-rendered="true">
        @yield('content')
    </main>
    @ssr
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
                        <li><a href="{{ url('/docs') }}">Documentation</a></li>
                        <li><a href="{{ url('/examples') }}">Examples</a></li>
                        <li><a href="https://github.com/one-laravel/framework" target="_blank">GitHub</a></li>
                    </ul>
                </div>
                <div class="col">
                    <h6>Community</h6>
                    <ul style="list-style: none;">
                        <li><a href="{{ url('/contact') }}">Contact</a></li>
                        <li><a href="#" target="_blank">Discord</a></li>
                        <li><a href="#" target="_blank">Twitter</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="text-center mt-4" style="border-top: 1px solid #404040; padding-top: 2rem; margin-top: 2rem;">
                <p>&copy; {{ date('Y') }} One Laravel. Built with ❤️ for developers.</p>
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

    <!-- SPA Configuration - Simple config only, all logic handled in JavaScript -->
    <script>
        window.APP_CONFIGS = {
            api: {
                csrfToken: '{{ csrf_token() }}',
                baseUrl: '{{ url('/') }}'
            },
            mode: '{{ config('app.debug') ? 'development' : 'production' }}',
            defaultRoute: '/web',
            container: '#spa-content',
            router: {
                mode: 'history',
                base: '/',
                allRoutes: {!! json_encode($__helper->exportSpaRoutes(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!},
                routes: {!! json_encode($__helper->exportComponentRoutes(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            },
            view: {
                systemData: {!! json_encode($__helper->exportSystemData(), JSON_UNESCAPED_UNICODE) !!},
                superView: '{{ $__VIEW_PATH__ ?? null }}',
                ssrData: {!! json_encode($__helper->exportApplicationViewData(), JSON_UNESCAPED_UNICODE) !!}
            }
        };
    </script>

    <!-- Core JavaScript for SPA - Load after APP_CONFIGS is defined -->
    @include('partials.assets-scripts')

    <!-- SPA Ready Handler -->
    <script>
        document.addEventListener('app:ready', function(event) {
            console.log('🎉 SPA is ready!');
            if (window.App && window.App.View) {
                window.App.View.__curentMasterView__ = 'layouts.base';
            }
        });
    </script>

    @yield('scripts')
</body>
</html>
@endssr