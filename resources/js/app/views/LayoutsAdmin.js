export function LayoutsAdmin($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'layouts.admin';
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

    self.setup('layouts.admin', {
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

<!-- Admin Navigation -->
<nav class="admin-navbar">
<div class="nav-container" data-id="${App.View.yieldContent('admin-data-id', 'test')}" data-yield-attr="data-id:admin-data-id">
<a href="/admin" class="nav-brand">Admin Panel</a>
<div class="nav-menu">
<a href="/admin" class="nav-link">Dashboard</a>
<a href="/admin/users" class="nav-link">Users</a>
<a href="/admin/settings" class="nav-link">Settings</a>
</div>
</div>
</nav>

<!-- Admin Content -->
<div id="admin-content" data-yield-content="document.body" name="${App.View.yieldContent('layoout:name', null)}" sidebar="${App.View.yieldContent('sidebar', null)}" data-yield-attr="name:layoout:name,sidebar:sidebar">
${App.View.yield('document.body')}
</div>

<!-- Admin Sidebar -->
<aside class="admin-sidebar" data-yield-content="sidebar">
<h3>Admin Tools</h3>
<p>Admin sidebar content</p>
</aside>








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
</style>`;
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