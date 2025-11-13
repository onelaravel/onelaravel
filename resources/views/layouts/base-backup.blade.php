@ssr
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('meta:title')</title>
    <meta name="description" content="@yield('meta:description')">
    <meta name="keywords" content="@yield('meta:keywords')">
    <meta name="csrf-token" content="{{ csrf_token() }}">
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
            gap: 20px;
        }

        .nav-link {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .nav-link.active {
            background-color: rgba(255, 255, 255, 0.3);
            font-weight: bold;
        }

        /* Sidebar */
        .sidebar {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 250px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 100;
        }

        .sidebar h3 {
            margin-bottom: 15px;
            color: #333;
        }

        /* Dynamic Content */
        .dynamic-content {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 100;
        }

        /* SPA Mode */
        .spa-mode {
            transition: all 0.3s ease;
        }

        .spa-active {
            border: 2px solid #007cba;
            border-radius: 8px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 15px;
            }

            .nav-menu {
                flex-wrap: wrap;
                justify-content: center;
            }

            .sidebar {
                position: relative;
                top: auto;
                right: auto;
                width: 100%;
                margin: 20px 0;
            }

            .dynamic-content {
                position: relative;
                bottom: auto;
                right: auto;
                margin: 20px 0;
            }
        }
    </style>

</head>

<body>
    <div id="app-root" data-server-rendered="true">
    @endssr
    @wrap(['follow' => false])
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/web" class="nav-brand">SPA App</a>
            <div class="nav-menu">
                <a href="/web" class="nav-link">Home</a>
                <a href="/web/about" class="nav-link">About</a>
                <a href="/web/users" class="nav-link">Users</a>
                <a href="/web/contact" class="nav-link">Contact</a>
                <!-- Test links -->
                <a href="https://google.com" class="nav-link" target="_blank">External</a>
                <a href="mailto:test@example.com" class="nav-link">Email</a>
                <a href="/web/test" class="nav-link" data-nav="disabled">Disabled</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div id="app-content" @onBlock('document.body')>
        @useBlock('document.body')
    </div>
    @let($temp = 'templates')
    @include($temp.'.ga-js', ['test' => 'test'])
    @includeif($temp.'.ga-js', ['test' => 'test'])
    @includewhen($__VIEW_PATH__ === 'layouts.base', $temp.'.ga-js', ['test' => 'test'])
    @endwrap
    @register($__VIEW_ID__)
        <script view>
            export default {
                mounted() {
                    console.log('Welcome', __VIEW_ID__);
                },
                init() {
                    console.log('Welcome', __VIEW_ID__);
                }
            }
        </script>
    @endregister
    
    @ssr
    </div>
    <!-- SPA Scripts (auto-generated webpack assets in correct order) -->
    @include('partials.assets-scripts')
    <!-- SPA Configuration -->
    <script defer>
        window.APP_CONFIGS = {
            container: '#app-root',
            mode: '{{ app()->environment('production') ? 'production' : 'development' }}',
            spaScope: '{{ $spa_scope ?? 'web' }}',
            currentUser: @json(auth()->user() ?? null),
            api: {
                baseUrl: '{{ url('/api') }}',
                csrfToken: '{{ csrf_token() }}',
                endpoints: {
                    system: {
                        config: 'system/config',
                        data: 'system/data'
                    },
                    users: {
                        list: 'users',
                        detail: 'users/:id'
                    },
                    posts: {
                        list: 'posts',
                        detail: 'posts/:id'
                    },
                    auth: {
                        login: 'auth/login',
                        logout: 'auth/logout',
                        register: 'auth/register'
                    }
                }
            },
            data: {
                siteName: 'SPA App',
                version: '1.0.0',
                environment: '{{ app()->environment() }}'
            },
            lang: {
                vi: {
                    name: 'Tiếng Việt',
                    locale: 'vi',
                    fallback: 'en'
                },
                en: {
                    name: 'English',
                    locale: 'en',
                    fallback: 'en'
                },
                ja: {
                    name: '日本語',
                    locale: 'ja',
                    fallback: 'en'
                },
                cn: {
                    name: '中文',
                    locale: 'cn',
                    fallback: 'en'
                }
            },
            router: {
                mode: 'history',
                base: '/',
                allRoutes: {!! json_encode($__helper->exportSpaRoutes(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!},
                routes: {!! json_encode($__helper->exportComponentRoutes(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!},
                beforeEach: function(to, from) {
                    console.log('Navigating to:', to.path);
                    return true;
                },
                afterEach: function(to, from) {
                    console.log('Navigation complete:', to.path);
                    // Update active nav link
                    updateActiveNav(to.path);
                }
            },
            view: {
                systemData: {
                    ref: "config", // config / api / direct
                    title: "@yield('meta:title')",
                },
                superView: "{{ $__VIEW_PATH__ }}",
                ssrData: {!! json_encode($__helper->exportApplicationViewData(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
            }
        };
        
        // Function to update active navigation link
        function updateActiveNav(currentPath) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        }
        
        App.init();
    </script>

    <!-- SPA Ready Handler -->
    <script>
        document.addEventListener('app:ready', function(event) {
            console.log('🎉 SPA is ready!');
            App.View.__curentMasterView__ = 'layouts.base';
        });
    </script>
</body>
</html>
@endssr
