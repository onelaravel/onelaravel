{{-- VÍ DỤ: DATA TỪ INCLUDE --}}

<div class="partial-data-example">
    <h3>Data từ Include</h3>
    
    {{-- ===== 1. DATA TỪ PARENT VIEW ===== --}}
    <section class="mb-3">
        <h4>1. Data từ Parent View</h4>
        <p><strong>Parent User:</strong> {{ json_encode($parent_data) }}</p>
        <p><strong>Parent Items:</strong> {{ json_encode($items ?? null) }}</p>
        <p><strong>Parent Custom Data:</strong> {{ json_encode($custom_data ?? null) }}</p>
    </section>
    
    {{-- ===== 2. DATA TỪ INCLUDE PARAMETERS ===== --}}
    <section class="mb-3">
        <h4>2. Data từ Include Parameters</h4>
        <p><strong>Include Data:</strong> {{ json_encode($include_data) }}</p>
        <p><strong>Parent Data:</strong> {{ json_encode($parent_data) }}</p>
    </section>
    
    {{-- ===== 3. DATA TỪ COMPOSER ===== --}}
    <section class="mb-3">
        <h4>3. Data từ Composer</h4>
        <p><strong>Composer User:</strong> {{ json_encode($composer_user ?? null) }}</p>
        <p><strong>Composer Global:</strong> {{ json_encode($composer_global ?? null) }}</p>
        <p><strong>Composer Session:</strong> {{ json_encode($composer_session ?? null) }}</p>
    </section>
    
    {{-- ===== 4. DATA TỪ GLOBAL SHARE ===== --}}
    <section class="mb-3">
        <h4>4. Data từ Global Share</h4>
        <p><strong>Global Config:</strong> {{ json_encode($global_config ?? null) }}</p>
        <p><strong>Current Request:</strong> {{ json_encode($current_request ?? null) }}</p>
        <p><strong>App Name:</strong> {{ $app_name ?? 'Not set' }}</p>
    </section>
    
    {{-- ===== 5. DATA TỪ VIEW STORAGE ===== --}}
    <section class="mb-3">
        <h4>5. Data từ View Storage</h4>
        <p><strong>View ID:</strong> {{ $__VIEW_ID__ }}</p>
        <p><strong>View Path:</strong> {{ $__VIEW_PATH__ }}</p>
        <p><strong>Parent View Path:</strong> {{ $__PARENT_VIEW_PATH__ ?? 'No parent' }}</p>
        <p><strong>Parent View ID:</strong> {{ $__PARENT_VIEW_ID__ ?? 'No parent' }}</p>
    </section>
    
    {{-- ===== 6. DATA TỪ HELPER ===== --}}
    <section class="mb-3">
        <h4>6. Data từ Helper</h4>
        <p><strong>Helper:</strong> {{ json_encode($__helper ?? null) }}</p>
        <p><strong>Helper Methods:</strong> {{ json_encode(get_class_methods($__helper ?? null)) }}</p>
    </section>
    
    {{-- ===== 7. DATA TỪ SESSION ===== --}}
    <section class="mb-3">
        <h4>7. Data từ Session</h4>
        <p><strong>Session All:</strong> {{ json_encode(session()->all()) }}</p>
        <p><strong>Session User:</strong> {{ json_encode(session('user')) }}</p>
    </section>
    
    {{-- ===== 8. DATA TỪ REQUEST ===== --}}
    <section class="mb-3">
        <h4>8. Data từ Request</h4>
        <p><strong>Request All:</strong> {{ json_encode(request()->all()) }}</p>
        <p><strong>Request URL:</strong> {{ request()->url() }}</p>
        <p><strong>Request Method:</strong> {{ request()->method() }}</p>
    </section>
    
    {{-- ===== 9. DATA TỪ AUTH ===== --}}
    <section class="mb-3">
        <h4>9. Data từ Auth</h4>
        <p><strong>Auth User:</strong> {{ json_encode(auth()->user()) }}</p>
        <p><strong>Auth Check:</strong> {{ auth()->check() ? 'Yes' : 'No' }}</p>
    </section>
    
    {{-- ===== 10. DATA TỪ CONFIG ===== --}}
    <section class="mb-3">
        <h4>10. Data từ Config</h4>
        <p><strong>App Config:</strong> {{ json_encode(config('app')) }}</p>
        <p><strong>Database Config:</strong> {{ json_encode(config('database')) }}</p>
    </section>
    
    {{-- ===== 11. DATA TỪ CACHE ===== --}}
    <section class="mb-3">
        <h4>11. Data từ Cache</h4>
        <p><strong>Cache Get:</strong> {{ json_encode(cache()->get('some_key')) }}</p>
        <p><strong>Cache Has:</strong> {{ cache()->has('some_key') ? 'Yes' : 'No' }}</p>
    </section>
    
    {{-- ===== 12. DATA TỪ ENV ===== --}}
    <section class="mb-3">
        <h4>12. Data từ Environment</h4>
        <p><strong>App Name:</strong> {{ config('app.name') }}</p>
        <p><strong>App Environment:</strong> {{ app()->environment() }}</p>
        <p><strong>App Debug:</strong> {{ config('app.debug') ? 'Yes' : 'No' }}</p>
    </section>
    
    {{-- ===== 13. DATA TỪ CUSTOM DIRECTIVES ===== --}}
    <section class="mb-3">
        <h4>13. Data từ Custom Directives</h4>
        @vars($partialVar = 'Hello from partial @vars directive')
        <p><strong>Partial Var:</strong> {{ $partialVar }}</p>
        
        @let($partialLet = 'Hello from partial @let directive')
        <p><strong>Partial Let:</strong> {{ $partialLet }}</p>
        
        @const($partialConst = 'Hello from partial @const directive')
        <p><strong>Partial Const:</strong> {{ $partialConst }}</p>
    </section>
    
    {{-- ===== 14. DATA TỪ JAVASCRIPT ===== --}}
    <section class="mb-3">
        <h4>14. Data từ JavaScript</h4>
        <div id="partial-js-data-display">
            <p>Loading partial JavaScript data...</p>
        </div>
        
        <script>
            // Data từ parent view
            const parentData = @json($parent_data);
            const includeData = @json($include_data);
            
            // Data từ composer
            const composerData = @json($composer_user ?? null);
            const globalData = @json($composer_global ?? null);
            
            // Data từ view storage
            const viewData = window.APP_CONFIGS?.view?.ssrData || {};
            
            // Data từ global config
            const globalConfig = @json($global_config ?? null);
            
            // Display data
            document.getElementById('partial-js-data-display').innerHTML = `
                <p><strong>Parent Data:</strong> ${JSON.stringify(parentData)}</p>
                <p><strong>Include Data:</strong> ${JSON.stringify(includeData)}</p>
                <p><strong>Composer Data:</strong> ${JSON.stringify(composerData)}</p>
                <p><strong>Global Data:</strong> ${JSON.stringify(globalData)}</p>
                <p><strong>View Data:</strong> ${JSON.stringify(viewData)}</p>
                <p><strong>Global Config:</strong> ${JSON.stringify(globalConfig)}</p>
            `;
        </script>
    </section>
    
    {{-- ===== 15. DATA TỪ VIEW STORAGE MANAGER ===== --}}
    <section class="mb-3">
        <h4>15. Data từ View Storage Manager</h4>
        <p><strong>View Storage Data:</strong> {{ json_encode($__helper->exportViewData()) }}</p>
        <p><strong>View Storage Instances:</strong> {{ json_encode($__helper->exportViewInstances()) }}</p>
        <p><strong>View Storage Events:</strong> {{ json_encode($__helper->getEventRegistry()) }}</p>
    </section>
    
    {{-- ===== 16. DATA TỪ CUSTOM SERVICES ===== --}}
    <section class="mb-3">
        <h4>16. Data từ Custom Services</h4>
        <p><strong>View Helper Service:</strong> {{ json_encode(get_class($__helper)) }}</p>
        <p><strong>View Storage Manager:</strong> {{ json_encode(get_class($__helper->getViewStorageManager())) }}</p>
        <p><strong>View Context Service:</strong> {{ json_encode(get_class(app('Core\Services\ViewContextService'))) }}</p>
    </section>
    
    {{-- ===== 17. DATA TỪ MIDDLEWARE ===== --}}
    <section class="mb-3">
        <h4>17. Data từ Middleware</h4>
        <p><strong>Middleware Data:</strong> {{ json_encode(request()->attributes->all()) }}</p>
        <p><strong>Route Data:</strong> {{ json_encode(request()->route()?->parameters()) }}</p>
        <p><strong>Query Data:</strong> {{ json_encode(request()->query()) }}</p>
    </section>
    
    {{-- ===== 18. DATA TỪ EVENTS ===== --}}
    <section class="mb-3">
        <h4>18. Data từ Events</h4>
        <p><strong>Event Data:</strong> {{ json_encode(event('view.rendered')) }}</p>
        <p><strong>Event Listeners:</strong> {{ json_encodefunc(app('events')->getListeners('view.rendered')) }}</p>
    </section>
    
    {{-- ===== 19. DATA TỪ CUSTOM HELPERS ===== --}}
    <section class="mb-3">
        <h4>19. Data từ Custom Helpers</h4>
        <p><strong>Custom Helper:</strong> {{ json_encode(helper('custom')) }}</p>
        <p><strong>Custom Helper Data:</strong> {{ json_encode(helper('custom')->getData()) }}</p>
    </section>
    
    {{-- ===== 20. DATA TỪ CUSTOM DIRECTIVES ===== --}}
    <section class="mb-3">
        <h4>20. Data từ Custom Directives</h4>
        <p><strong>Custom Directive Data:</strong> {{ json_encode(directive('custom')) }}</p>
        <p><strong>Custom Directive Result:</strong> {{ json_encode(directive('custom')->execute()) }}</p>
    </section>
</div>


