export function PartialsDataExample($$$DATA$$$ = {}, systemData = {}) {
    const {App, View, __base__, __layout__, __page__, __component__, __partial__, __system__, __env = {}, __helper = {}} = systemData;
    const __VIEW_PATH__ = 'partials.data-example';
    const __VIEW_ID__ = $$$DATA$$$.__SSR_VIEW_ID__ || App.View.generateViewId();
    const __VIEW_TYPE__ = 'view';
    // this is the wrapper element
    
    const __WRAPPER_ELEMENT__ = document.createElement('template');
    const __REFS__ = [];
    const self = new View.Engine();
    const __STATE__ = new View.State(self);


    const parseRefs = (frag) => {
        for (let i = 0; i < frag.childNodes.length; i++) {
            const node = frag.childNodes[i];
            __REFS__.push(node);
        }
    }
    const createHtml = (template) => {
        try {
            __WRAPPER_ELEMENT__.innerHTML = template;
        } catch (error) {
            console.error(error);
            __WRAPPER_ELEMENT__.innerHTML = '';
        }
        let frag = __WRAPPER_ELEMENT__.content;
        parseRefs(frag);
        return frag;
    }
    
    /**
     * 
     * @param {*} value 
     * @returns {[any, function, string]}
     */
    const useState = (value) => {
        return __STATE__.__useState(value);
    };
    const updateRealState = (state) => {
        __STATE__.__updateRealState(state);
    };

    const lockUpdateRealState = () => {
        __STATE__.__lockUpdateRealState();
    };
    const updateStateByKey = (key, state) => {
        __STATE__.__updateStateByKey(key, state);
    };

    if(typeof $$$DATA$$$.__SSR_VIEW_ID__ !== 'undefined'){
        delete $$$DATA$$$.__SSR_VIEW_ID__;
    }
    const __UPDATE_DATA_TRAIT__ = {};
    let {partialVar = 'Hello from partial @vars directive'} = $$$DATA$$$;
    let partialLet = 'Hello from partial @let directive';
    const partialConst = 'Hello from partial @const directive';
    __UPDATE_DATA_TRAIT__.partialVar = value => partialVar = value;
    __UPDATE_DATA_TRAIT__.partialLet = value => partialLet = value;
    const __VARIABLE_LIST__ = ["partialVar", "partialLet"];

    self.setup('partials.data-example', {
        superView: null,
        hasSuperView: false,
        viewType: 'view',
        sections: {},
        wrapperConfig: { enable: false, tag: null, follow: true, attributes: {} },
        __props__: ["__WRAPPER_ELEMENT__", "createHtml", "__REFS__", "parseRefs"],
            __WRAPPER_ELEMENT__: __WRAPPER_ELEMENT__,
            refs: __REFS__,
            states: __STATE__,
            parseRefs: parseRefs,
            createHtml: createHtml,
        hasAwaitData: false,
        hasFetchData: false,
        subscribe: true,
        fetch: null,
        data: $$$DATA$$$,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: true,
        hasSections: false,
        hasSectionPreload: false,
        hasPrerender: false,
        renderLongSections: [],
        renderSections: [],
        prerenderSections: [],
        userDefined: {},
        scripts: [],
        styles: [],
        resources: [],
        commitConstructorData: function() {
            // Then update states from data
            
            // Finally lock state updates
            
        },
        updateVariableData: function(data) {
            // Update all variables first
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.updateVariableItem(key, data[key]);
                }
            }
            // Then update states from data
            
            // Finally lock state updates
            
        },
        updateVariableItem: function(key, value) {
            this.data[key] = value;
            if (typeof __UPDATE_DATA_TRAIT__[key] === "function") {
                __UPDATE_DATA_TRAIT__[key](value);
            }
        },
        loadServerData: function() {
    
},
        prerender: function() {
    return null;
},
        render: function() {
                
    let __outputRenderedContent__ = '';
            try {
                __outputRenderedContent__ = `

<div class="partial-data-example">
<h3>Data từ Include</h3>


<section class="mb-3">
<h4>1. Data từ Parent View</h4>
<p><strong>Parent User:</strong> ${App.View.escString(App.Helper.json_encode(parent_data))}</p>
<p><strong>Parent Items:</strong> ${App.View.escString(App.Helper.json_encode(items ?? null))}</p>
<p><strong>Parent Custom Data:</strong> ${App.View.escString(App.Helper.json_encode(custom_data ?? null))}</p>
</section>


<section class="mb-3">
<h4>2. Data từ Include Parameters</h4>
<p><strong>Include Data:</strong> ${App.View.escString(App.Helper.json_encode(include_data))}</p>
<p><strong>Parent Data:</strong> ${App.View.escString(App.Helper.json_encode(parent_data))}</p>
</section>


<section class="mb-3">
<h4>3. Data từ Composer</h4>
<p><strong>Composer User:</strong> ${App.View.escString(App.Helper.json_encode(composer_user ?? null))}</p>
<p><strong>Composer Global:</strong> ${App.View.escString(App.Helper.json_encode(composer_global ?? null))}</p>
<p><strong>Composer Session:</strong> ${App.View.escString(App.Helper.json_encode(composer_session ?? null))}</p>
</section>


<section class="mb-3">
<h4>4. Data từ Global Share</h4>
<p><strong>Global Config:</strong> ${App.View.escString(App.Helper.json_encode(global_config ?? null))}</p>
<p><strong>Current Request:</strong> ${App.View.escString(App.Helper.json_encode(current_request ?? null))}</p>
<p><strong>App Name:</strong> ${App.View.escString(app_name ?? 'Not set')}</p>
</section>


<section class="mb-3">
<h4>5. Data từ View Storage</h4>
<p><strong>View ID:</strong> ${App.View.escString(__VIEW_ID__)}</p>
<p><strong>View Path:</strong> ${App.View.escString(__VIEW_PATH__)}</p>
<p><strong>Parent View Path:</strong> ${App.View.escString(__PARENT_VIEW_PATH__ ?? 'No parent')}</p>
<p><strong>Parent View ID:</strong> ${App.View.escString(__PARENT_VIEW_ID__ ?? 'No parent')}</p>
</section>


<section class="mb-3">
<h4>6. Data từ Helper</h4>
<p><strong>Helper:</strong> ${App.View.escString(App.Helper.json_encode(__helper ?? null))}</p>
<p><strong>Helper Methods:</strong> ${App.View.escString(App.Helper.json_encode(get_class_methods(__helper ?? null)))}</p>
</section>


<section class="mb-3">
<h4>7. Data từ Session</h4>
<p><strong>Session All:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.session().all()))}</p>
<p><strong>Session User:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.session('user')))}</p>
</section>


<section class="mb-3">
<h4>8. Data từ Request</h4>
<p><strong>Request All:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.request().all()))}</p>
<p><strong>Request URL:</strong> ${App.View.escString(App.Helper.request().url())}</p>
<p><strong>Request Method:</strong> ${App.View.escString(App.Helper.request().method())}</p>
</section>


<section class="mb-3">
<h4>9. Data từ Auth</h4>
<p><strong>Auth User:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.auth().user()))}</p>
<p><strong>Auth Check:</strong> ${App.View.escString(App.Helper.auth().check() ? 'Yes' : 'No')}</p>
</section>


<section class="mb-3">
<h4>10. Data từ Config</h4>
<p><strong>App Config:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.config('app')))}</p>
<p><strong>Database Config:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.config('database')))}</p>
</section>


<section class="mb-3">
<h4>11. Data từ Cache</h4>
<p><strong>Cache Get:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.cache().get('some_key')))}</p>
<p><strong>Cache Has:</strong> ${App.View.escString(App.Helper.cache().has('some_key') ? 'Yes' : 'No')}</p>
</section>


<section class="mb-3">
<h4>12. Data từ Environment</h4>
<p><strong>App Name:</strong> ${App.View.escString(App.Helper.config('app.name'))}</p>
<p><strong>App Environment:</strong> ${App.View.escString(app().environment())}</p>
<p><strong>App Debug:</strong> ${App.View.escString(App.Helper.config('app.debug') ? 'Yes' : 'No')}</p>
</section>


<section class="mb-3">
<h4>13. Data từ Custom Directives</h4>

<p><strong>Partial Var:</strong> ${App.View.escString(partialVar)}</p>


<p><strong>Partial Let:</strong> ${App.View.escString(partialLet)}</p>


<p><strong>Partial Const:</strong> ${App.View.escString(partialConst)}</p>
</section>


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
document.getElementById('partial-js-data-display').innerHTML = \`
<p><strong>Parent Data:</strong> ${JSON.stringify(parentData)}</p>
<p><strong>Include Data:</strong> ${JSON.stringify(includeData)}</p>
<p><strong>Composer Data:</strong> ${JSON.stringify(composerData)}</p>
<p><strong>Global Data:</strong> ${JSON.stringify(globalData)}</p>
<p><strong>View Data:</strong> ${JSON.stringify(viewData)}</p>
<p><strong>Global Config:</strong> ${JSON.stringify(globalConfig)}</p>
\`;
</script>
</section>


<section class="mb-3">
<h4>15. Data từ View Storage Manager</h4>
<p><strong>View Storage Data:</strong> ${App.View.escString(App.Helper.json_encode(__helper.exportViewData()))}</p>
<p><strong>View Storage Instances:</strong> ${App.View.escString(App.Helper.json_encode(__helper.exportViewInstances()))}</p>
<p><strong>View Storage Events:</strong> ${App.View.escString(App.Helper.json_encode(__helper.getEventRegistry()))}</p>
</section>


<section class="mb-3">
<h4>16. Data từ Custom Services</h4>
<p><strong>View Helper Service:</strong> ${App.View.escString(App.Helper.json_encode(get_class(__helper)))}</p>
<p><strong>View Storage Manager:</strong> ${App.View.escString(App.Helper.json_encode(get_class(__helper.getViewStorageManager())))}</p>
<p><strong>View Context Service:</strong> ${App.View.escString(App.Helper.json_encode(get_class(app('Core\Services\ViewContextService'))))}</p>
</section>


<section class="mb-3">
<h4>17. Data từ Middleware</h4>
<p><strong>Middleware Data:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.request().attributes.all()))}</p>
<p><strong>Route Data:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.request().route()?.parameters()))}</p>
<p><strong>Query Data:</strong> ${App.View.escString(App.Helper.json_encode(App.Helper.request().query()))}</p>
</section>


<section class="mb-3">
<h4>18. Data từ Events</h4>
<p><strong>Event Data:</strong> ${App.View.escString(App.Helper.json_encode(event('view.rendered')))}</p>
<p><strong>Event Listeners:</strong> ${App.View.escString(json_encodefunc(app('events').getListeners('view.rendered')))}</p>
</section>


<section class="mb-3">
<h4>19. Data từ Custom Helpers</h4>
<p><strong>Custom Helper:</strong> ${App.View.escString(App.Helper.json_encode(helper('custom')))}</p>
<p><strong>Custom Helper Data:</strong> ${App.View.escString(App.Helper.json_encode(helper('custom').getData()))}</p>
</section>


<section class="mb-3">
<h4>20. Data từ Custom Directives</h4>
<p><strong>Custom Directive Data:</strong> ${App.View.escString(App.Helper.json_encode(directive('custom')))}</p>
<p><strong>Custom Directive Result:</strong> ${App.View.escString(App.Helper.json_encode(directive('custom').execute()))}</p>
</section>
</div>`;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            return __outputRenderedContent__;
            },
        init: function() {  },
        destroy: function() {}
    });
    return self;
        }