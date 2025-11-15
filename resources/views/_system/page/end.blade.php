    </div>
    <!-- SPA Configuration - Simple config only, all logic handled in JavaScript -->
    <script>
        window.APP_CONFIGS = {
            api: {
                csrfToken: '{{ csrf_token() }}',
                baseUrl: '{{ url('/') }}'
            },
            env: {
                mode: "{{ config('spa.mode') ?? 'web' }}",
                debug: "{{ config('app.debug') ?? false }}",
                base_url: "{{ config('spa.base_url') ?? url('/') }}",
                csrf_token: "{{ config('spa.csrf_token') ?? csrf_token() }}",
                router_mode: "{{ config('spa.router_mode') ?? 'history' }}",
            }
            mode: '{{ config('app.debug') ? 'development' : 'production' }}',
            defaultRoute: '/web',
            container: '#one-app',
            router: {
                mode: 'history',
                base: '/',
                allRoutes: {!! json_encode($__helper->exportSpaRoutes(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!},
                routes: {!! json_encode($__helper->exportComponentRoutes(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            },
            view: {
                systemData: {
                    ref: 'config',
                    title: '{{ trim(view()->yieldContent('meta:title') ?: 'One Laravel - Advanced SPA Framework') }}'
                },
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