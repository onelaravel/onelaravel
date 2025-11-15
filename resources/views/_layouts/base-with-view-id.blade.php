@serverside
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('meta:title')</title>
    <meta name="description" content="@yield('meta:description')">
    <meta name="keywords" content="@yield('meta:keywords')">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- View Identification Meta -->
    <meta name="spa-view-name" content="{{ $__VIEW_NAME__ ?? 'unknown' }}">
    <meta name="spa-view-path" content="{{ $__VIEW_PATH__ ?? 'unknown' }}">
    <meta name="spa-view-id" content="{{ $__VIEW_ID__ ?? 'unknown' }}">
    <meta name="spa-view-type" content="{{ $__VIEW_TYPE__ ?? 'view' }}">
    
    <style>
        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        /* Navigation */
        .navbar {
            background: #007cba;
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-brand {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        .nav-link {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Main Content */
        .main-content {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 2rem;
        }

        .content-area {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .sidebar {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            height: fit-content;
        }

        /* View Identification Styles */
        [data-spa-view] {
            position: relative;
        }

        [data-spa-view]::before {
            content: attr(data-spa-view);
            position: absolute;
            top: -20px;
            left: 0;
            font-size: 10px;
            color: #666;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            opacity: 0.7;
            z-index: 1000;
        }

        /* Debug mode - show view boundaries */
        .debug-view-boundaries [data-spa-view] {
            border: 2px dashed #007cba;
            margin: 2px;
        }

        .debug-view-boundaries [data-spa-view]::before {
            opacity: 1;
            background: #007cba;
            color: white;
        }
    </style>
@endserverside

<!-- Main Container with View Identification -->
<div id="app-root" 
     data-server-rendered="true" 
     data-spa-view="root"
     data-spa-view-name="{{ $__VIEW_NAME__ ?? 'layouts.base' }}"
     data-spa-view-path="{{ $__VIEW_PATH__ ?? 'layouts.base' }}"
     data-spa-view-id="{{ $__VIEW_ID__ ?? 'root' }}"
     data-spa-view-type="layout">

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/web" class="nav-brand">SPA App</a>
            <div class="nav-menu">
                <a href="/web" class="nav-link">Home</a>
                <a href="/web/about" class="nav-link">About</a>
                <a href="/web/users" class="nav-link">Users</a>
                <a href="/web/contact" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Main Content Area -->
    <div class="main-content">
        <!-- Content Area with View Identification -->
        <main class="content-area" 
              data-spa-view="main-content"
              data-spa-view-name="{{ $__VIEW_NAME__ ?? 'unknown' }}"
              data-spa-view-path="{{ $__VIEW_PATH__ ?? 'unknown' }}"
              data-spa-view-id="{{ $__VIEW_ID__ ?? 'main' }}"
              data-spa-view-type="content">
            
            @yield('content')
            
            <!-- View Content with Identification -->
            <div data-spa-view="view-content"
                 data-spa-view-name="{{ $__VIEW_NAME__ ?? 'unknown' }}"
                 data-spa-view-path="{{ $__VIEW_PATH__ ?? 'unknown' }}"
                 data-spa-view-id="{{ $__VIEW_ID__ ?? 'view' }}"
                 data-spa-view-type="view">
                @yield('document.body')
            </div>
        </main>

        <!-- Sidebar -->
        <aside class="sidebar" 
               data-spa-view="sidebar"
               data-spa-view-name="layouts.sidebar"
               data-spa-view-path="layouts.sidebar"
               data-spa-view-id="sidebar"
               data-spa-view-type="component">
            <h3>Sidebar</h3>
            <p>Default sidebar content</p>
            
            <!-- Dynamic Sidebar Content -->
            <div data-spa-view="sidebar-content"
                 data-spa-view-name="partials.sidebar"
                 data-spa-view-path="partials.sidebar"
                 data-spa-view-id="sidebar-content"
                 data-spa-view-type="partial">
                @yield('sidebar')
            </div>
        </aside>
    </div>

    <!-- Debug Panel -->
    <div id="spa-debug-panel" style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000; display: none;">
        <h4 style="margin: 0 0 10px 0; color: #333;">SPA Debug</h4>
        <div id="debug-info"></div>
        <button onclick="toggleViewBoundaries()" style="padding: 5px 10px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">Toggle View Boundaries</button>
    </div>

    @serverside
    </div>

    <!-- SPA Main Script -->
    <script src="{{ asset('static/app/main.js') }}"></script>
    <!-- SPA Configuration -->
    <script>
        window.APP_CONFIGS = {
            api: {
                csrfToken: "{{ csrf_token() }}",
                baseUrl: "{{ url('/') }}"
            },
            appScope: "web",
            mode: "development",
            defaultRoute: "/web",
            view: {
                systemData: {
                    ref: "config", // config / api / direct
                    title: "@yield('meta:title')",
                },
                superView: "{{ $__VIEW_PATH__ }}",
                views: {!! json_encode($__helper->exportApplicationViewData(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
            }
        };

        // View Identification Helper
        window.SPAViewIdentifier = {
            getCurrentViewInfo: function() {
                const metaViewName = document.querySelector('meta[name="spa-view-name"]')?.content;
                const metaViewPath = document.querySelector('meta[name="spa-view-path"]')?.content;
                const metaViewId = document.querySelector('meta[name="spa-view-id"]')?.content;
                const metaViewType = document.querySelector('meta[name="spa-view-type"]')?.content;
                
                return {
                    name: metaViewName,
                    path: metaViewPath,
                    id: metaViewId,
                    type: metaViewType
                };
            },
            
            getAllViewElements: function() {
                return document.querySelectorAll('[data-spa-view]');
            },
            
            getViewElementsByType: function(type) {
                return document.querySelectorAll(`[data-spa-view-type="${type}"]`);
            },
            
            getViewElementById: function(id) {
                return document.querySelector(`[data-spa-view-id="${id}"]`);
            },
            
            debug: function() {
                const info = this.getCurrentViewInfo();
                const elements = this.getAllViewElements();
                
                console.log('🔍 Current View Info:', info);
                console.log('🔍 All View Elements:', elements);
                
                const debugInfo = document.getElementById('debug-info');
                if (debugInfo) {
                    debugInfo.innerHTML = `
                        <strong>Current View:</strong><br>
                        Name: ${info.name}<br>
                        Path: ${info.path}<br>
                        ID: ${info.id}<br>
                        Type: ${info.type}<br><br>
                        <strong>View Elements Found:</strong> ${elements.length}
                    `;
                }
            }
        };

        // Debug functions
        function toggleViewBoundaries() {
            document.body.classList.toggle('debug-view-boundaries');
        }

        function showDebugPanel() {
            document.getElementById('spa-debug-panel').style.display = 'block';
            SPAViewIdentifier.debug();
        }

        // Show debug panel in development
        if (window.APP_CONFIGS.mode === 'development') {
            showDebugPanel();
        }

        // Initialize App
        if (typeof App !== 'undefined') {
            App.init();
        }
    </script>
@endserverside
</html>
