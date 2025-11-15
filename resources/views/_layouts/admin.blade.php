@serverside
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel - SPA Application</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>

    <body>
        <div id="spa-root" data-server-rendered="true">
@endserverside
            <!-- Admin Navigation -->
            <nav class="admin-navbar">
                <div class="nav-container" @yieldon('data-id', 'admin-data-id', 'test')>
                    <a href="/admin" class="nav-brand">Admin Panel</a>
                    <div class="nav-menu">
                        <a href="/admin" class="nav-link">Dashboard</a>
                        <a href="/admin/users" class="nav-link">Users</a>
                        <a href="/admin/settings" class="nav-link">Settings</a>
                    </div>
                </div>
            </nav>

            <!-- Admin Content -->
            <div id="admin-content" @yieldon(['#content' => 'document.body', 'name' => 'layoout:name', 'sidebar' => 'sidebar'])>
                @yield('document.body')
            </div>

            <!-- Admin Sidebar -->
            <aside class="admin-sidebar" @yieldon(['#content' => 'sidebar'])>
                <h3>Admin Tools</h3>
                <p>Admin sidebar content</p>
            </aside>
@serverside
        </div>

        <!-- SPA Scripts -->
        <script src="{{ asset('build/spa.js') }}"></script>
        <script src="{{ asset('build/spa.views.js') }}"></script>
        <script src="{{ asset('build/SPARouter.js') }}"></script>
        <script src="{{ asset('build/HttpService.js') }}"></script>
        
        <!-- SPA Configuration -->
        <script>
            // Set SPA scope to admin
            window.SPA_SCOPE = 'admin';
            console.log('🔧 SPA: Scope set to:', window.SPA_SCOPE);
        </script>
        
        <!-- SPA Initialization -->
        <script>
            // Initialize SPA Router for Admin
            const router = new SPARouter({
                routes: [
                    { path: '/admin', component: 'admin.dashboard' },
                    { path: '/admin/users', component: 'admin.users' },
                    { path: '/admin/settings', component: 'admin.settings' }
                ],
                container: '#admin-content',
                mode: 'history',
                beforeEach: async (to, from) => {
                    console.log('Admin navigating to:', to.path);
                    return true;
                },
                afterEach: (to, from) => {
                    console.log('Admin navigation complete:', to.path);
                    updateActiveNav();
                }
            });

            // Update active navigation
            function updateActiveNav() {
                const currentPath = window.location.pathname;
                document.querySelectorAll('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === currentPath) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }

            // Initialize on load
            window.addEventListener('load', function() {
                updateActiveNav();
            });
        </script>

    </body>

    </html>
@endserverside

<style>
/* Admin-specific styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
}

.admin-navbar {
    background: #dc3545;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    background-color: rgba(255,255,255,0.2);
}

.nav-link.active {
    background-color: rgba(255,255,255,0.3);
    font-weight: bold;
}

.admin-sidebar {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 250px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 100;
}

.admin-sidebar h3 {
    margin-bottom: 15px;
    color: #333;
}
</style>
