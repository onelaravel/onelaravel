export function ComponentsTset($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'components.tset';
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
    const set$count = __STATE__.__register('count');
    let count = null;
    const setCount = (state) => {
        count = state;
        set$count(state);
    };
    __STATE__.__setters__.setCount = setCount;
    const update$count = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('count', value);
            count = value;
        }
    };
    const set$hoverCount = __STATE__.__register('hoverCount');
    let hoverCount = null;
    const setHoverCount = (state) => {
        hoverCount = state;
        set$hoverCount(state);
    };
    __STATE__.__setters__.setHoverCount = setHoverCount;
    const update$hoverCount = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('hoverCount', value);
            hoverCount = value;
        }
    };
    const set$a = __STATE__.__register('a');
    let a = null;
    const setA = (state) => {
        a = state;
        set$a(state);
    };
    __STATE__.__setters__.setA = setA;
    const update$a = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('a', value);
            a = value;
        }
    };
    const set$b = __STATE__.__register('b');
    let b = null;
    const setB = (state) => {
        b = state;
        set$b(state);
    };
    __STATE__.__setters__.setB = setB;
    const update$b = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('b', value);
            b = value;
        }
    };
    const set$c = __STATE__.__register('c');
    let c = null;
    const setC = (state) => {
        c = state;
        set$c(state);
    };
    __STATE__.__setters__.setC = setC;
    const update$c = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('c', value);
            c = value;
        }
    };

    self.setup('components.tset', {
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
            update$count(0);
            update$hoverCount(0);
            update$a(0);
            update$b(0);
            update$c(0);
            // Finally lock state updates
            lockUpdateRealState();
        },
        updateVariableData: function(data) {
            // Update all variables first
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.updateVariableItem(key, data[key]);
                }
            }
            // Then update states from data
            update$count(0);
            update$hoverCount(0);
            update$a(0);
            update$b(0);
            update$c(0);
            // Finally lock state updates
            lockUpdateRealState();
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





<div>
<h1>${App.View.escString(count)}</h1>
<button ${this.__addEventConfig("click", [(event) => setCount(count + 1)])}>Increment</button>
<button ${this.__addEventConfig("click", [{"handler":"setCount","params":[(event) => count - 1]}])}>Decrement</button>
<button ${this.__addEventConfig("click", [{"handler":"test","params":["@EVENT"]}])}>Test</button>
<button ${this.__addEventConfig("click", [() => count++])}>Increment (++)</button>
<button ${this.__addEventConfig("click", [() => count--])}>Decrement (--)</button>
<button ${this.__addEventConfig("click", [() => count += 10])}>Increment (+= 10)</button>
<button ${this.__addEventConfig("click", [() => count -= 10])}>Decrement (-= 10)</button>
<button ${this.__addEventConfig("click", [() => count *= 10])}>Multiply (*= 10)</button>
<button ${this.__addEventConfig("click", [() => count /= 10])}>Divide (/= 10)</button>
<button ${this.__addEventConfig("click", [() => count %= 10])}>Modulo (%= 10)</button>
<button ${this.__addEventConfig("click", [() => count **= 10])}>Power (**= 10)</button>
<button ${this.__addEventConfig("click", [() => count &= 10])}>Bitwise AND (&= 10)</button>


<button ${this.__addEventConfig("click", [() => a++,() => b--,{"handler":"test","params":[() => a,() => b]}])}>test</button>

<!-- Complex event tests -->
<button ${this.__addEventConfig("click", [() => count++,(event) => setCount(count * 2),{"handler":"handleClick","params":["@EVENT",() => count,(event) => "#ATTR:data-id"]},{"handler":"processData","params":[(event) => count + 10,(event) => "#PROP:value"]}])})>Complex Event 1</button>

<button ${this.__addEventConfig("keyup", [{"handler":"validateInput","params":["@EVENT"]},(event) => setCount(count + 1),{"handler":"submitForm","params":["@EVENT",(event) => "#VALUE:username",(event) => "#VALUE:email"]}])})>Complex Keyup</button>

<button ${this.__addEventConfig("mouseover", [() => hoverCount += 5,{"handler":"trackHover","params":["@EVENT",(event) => "#ATTR:id",() => hoverCount]},{"handler":"updateTooltip","params":[(event) => "#PROP:title",(event) => hoverCount + 10]}])}>Complex Mouseover</button>

<button ${this.__addEventConfig("click", [{"handler":"handleMultiple","params":[() => a,() => b,() => c]},() => a = b + c,() => b = a * 2,{"handler":"processResult","params":[() => a,() => b,() => c,"@EVENT"]}])}>Complex Assignment</button>

<button class="btn btn-primary" ${this.__addEventConfig("click", [{"handler":"nestedCall","params":[{"handler":"outerFunc","params":[() => count,"@EVENT"]},{"handler":"innerFunc","params":[(event) => "#ATTR:type",(event) => "#PROP:name"]}]},{"handler":"setCount","params":[{"handler":"nestedCall","params":[() => count,(event) => count + 1]}]}])})>Nested Functions</button>

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