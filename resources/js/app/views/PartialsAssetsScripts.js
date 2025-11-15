export function PartialsAssetsScripts($$$DATA$$$ = {}, systemData = {}) {
    const {App, View, __base__, __layout__, __page__, __component__, __partial__, __system__, __env = {}, __helper = {}} = systemData;
    const __VIEW_PATH__ = 'partials.assets-scripts';
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

    self.setup('partials.assets-scripts', {
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



<script src="${App.View.escString(App.Helper.asset('static/app/core-1c191ae7.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/core-5836a356.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/core-5ab236cd.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/core-c492f101.js'))}" defer></script>


<script src="${App.View.escString(App.Helper.asset('static/app/views-0875e753.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-4b7e9c69.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-b1efdd7b.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-cf3615ff.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-dc6bbf0a.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-e109a6f5.js'))}" defer></script>
<script src="${App.View.escString(App.Helper.asset('static/app/views-e8f2b5ad.js'))}" defer></script>


<script src="${App.View.escString(App.Helper.asset('static/app/main.js'))}" defer></script>`;
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