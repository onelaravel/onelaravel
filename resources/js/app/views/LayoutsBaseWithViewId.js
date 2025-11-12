export function LayoutsBaseWithViewId($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'layouts.base-with-view-id';
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
    const __VARIABLE_LIST__ = [];

    self.setup('layouts.base-with-view-id', {
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
        subscribe: false,
        fetch: null,
        data: $$$DATA$$$,
        viewId: __VIEW_ID__,
        path: __VIEW_PATH__,
        usesVars: false,
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
















<!-- Main Container with View Identification -->
<div id="app-root"
data-server-rendered="true"
data-spa-view="root"
data-spa-view-name="${App.View.escString($__VIEW_NAME__ ?? 'layouts.base')}"
data-spa-view-path="${App.View.escString($__VIEW_PATH__ ?? 'layouts.base')}"
data-spa-view-id="${App.View.escString(__VIEW_ID__ ?? 'root')}"
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
data-spa-view-name="${App.View.escString(__VIEW_NAME__ ?? 'unknown')}"
data-spa-view-path="${App.View.escString(__VIEW_PATH__ ?? 'unknown')}"
data-spa-view-id="${App.View.escString(__VIEW_ID__ ?? 'main')}"
data-spa-view-type="content">

${App.View.yield('content')}

<!-- View Content with Identification -->
<div data-spa-view="view-content"
data-spa-view-name="${App.View.escString(__VIEW_NAME__ ?? 'unknown')}"
data-spa-view-path="${App.View.escString(__VIEW_PATH__ ?? 'unknown')}"
data-spa-view-id="${App.View.escString(__VIEW_ID__ ?? 'view')}"
data-spa-view-type="view">
${App.View.yield('document.body')}
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
${App.View.yield('sidebar')}
</div>
</aside>
</div>

<!-- Debug Panel -->
<div id="spa-debug-panel" style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000; display: none;">
<h4 style="margin: 0 0 10px 0; color: #333;">SPA Debug</h4>
<div id="debug-info"></div>
<button onclick="toggleViewBoundaries()" style="padding: 5px 10px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">Toggle View Boundaries</button>
</div>














</html>`;
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