import { ViewEngine } from '@app/core/ViewEngine.js';
    const viewEngine = ViewEngine.getInstance();

export function PartialsFooter($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'partials.footer';
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

    self.setup('partials.footer', {
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
        userDefined: {
    mounted() {
        console.log('Footer mounted');
    },
    install(){
        console.log('Footer installed');
    }
},
        scripts: [{"type":"src","src":"https://cdn.jquery.com/main.js"}],
        styles: [{"type":"code","content":".footer {\\n    background-color: #f8f9fa;\\n    padding: 20px 0;\\n}\\n\\n.footer-content {\\n    max-width: 1200px;\\n    margin: 0 auto;\\n    padding: 0 15px;\\n}\\n\\n.footer-nav {\\n    list-style: none;\\n    padding: 0;\\n}\\n\\n.footer-nav a {\\n    text-decoration: none;\\n    color: #007bff;\\n}\\n\\n.footer-nav a:hover {\\n    text-decoration: underline;\\n}","attributes":{"scoped":true}},{"type":"href","href":`${App.View.escString(App.Helper.asset('css/footer.css'))}`}],
        resources: [{"tag":"script","uuid":"script-0","attrs":{"src":"https://cdn.jquery.com/main.js"}},{"tag":"link","uuid":"link-1","attrs":{"rel":"stylesheet","href":`${App.View.escString(App.Helper.asset('css/footer.css'))}`}}],
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
                __outputRenderedContent__ = `<footer class="footer">
<div class="footer-content">
<p>&copy; ${App.View.escString(App.Helper.date('Y'))} ${App.View.escString(App.Helper.config('app.name'))}. All rights reserved.</p>
<nav class="footer-nav">
<a href="${App.View.escString(App.View.route('home'))}">Trang chủ</a>
<a href="${App.View.escString(App.View.route('about'))}">Giới thiệu</a>
<a href="${App.View.escString(App.View.route('contact'))}">Liên hệ</a>
</nav>
</div>
</footer>`;
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