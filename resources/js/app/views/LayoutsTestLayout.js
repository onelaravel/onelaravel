export function LayoutsTestLayout($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'layouts.test-layout';
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
    let {data = {"name": "Layout Test"}, todos = ["Task 1", "Task 2", "Task 3"]} = $$$DATA$$$;
    __UPDATE_DATA_TRAIT__.data = value => data = value;
    __UPDATE_DATA_TRAIT__.todos = value => todos = value;
    const __VARIABLE_LIST__ = ["data", "todos"];
    const set$toduList = __STATE__.__register('toduList');
    let toduList = null;
    const setTodoList = (state) => {
        toduList = state;
        set$toduList(state);
    };
    __STATE__.__setters__.setTodoList = setTodoList;
    const update$toduList = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('toduList', value);
            toduList = value;
        }
    };
    const set$newTodo = __STATE__.__register('newTodo');
    let newTodo = null;
    const setNewTodo = (state) => {
        newTodo = state;
        set$newTodo(state);
    };
    __STATE__.__setters__.setNewTodo = setNewTodo;
    const update$newTodo = (value) => {
        if(__STATE__._canUpdateStateByKey){
            updateStateByKey('newTodo', value);
            newTodo = value;
        }
    };

    self.setup('layouts.test-layout', {
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
        hasFetchData: true,
        subscribe: true,
        fetch: {"url": ``, "method": "GET", "data": {}, "headers": {}},
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
        userDefined: {
    addTodo() {
                if (newTodo.trim() !== '') {
                    setTodoList([...toduList, newTodo.trim()]);
                    setNewTodo('');
                }
            },
            removeTodo(index) {
                const updatedTodos = toduList.filter((_, i) => i !== index);
                setTodoList(updatedTodos);
            }
},
        scripts: [],
        styles: [],
        resources: [],
        commitConstructorData: function() {
            // Then update states from data
            update$toduList(todos);
            update$newTodo('');
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
            update$toduList(todos);
            update$newTodo('');
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



<div class="layout">
<p>Layout View ID: ${App.View.escString(__VIEW_ID__)}</p>
${App.View.yield('content')}
</div>
<div class="test-directives">
<h3>Todo List:</h3>
${App.View.execute(() => { if(App.Helper.count(toduList) > 0){ return `
<ul>
${App.View.foreach(toduList, (todo, __loopKey, __loopIndex, loop) => `
<li>
<a href="javascript:void(0)" ${this.__addEventConfig("click", [{"handler":"addTodo","params":[]}])}>${App.View.escString(todo)}</a>
<button class="btn showdata" ${this.__addEventConfig("click", [{"handler":"alert","params":[(event) => a.b + c+d+'test']}])}>i</button>
<button class="btn" ${this.__addEventConfig("click", [{"handler":"removeTodo","params":[loop.index]}])}>x</button>

</li>
`)}
</ul>
`; } else { return `
<p>No todos available.</p>
`; }
return '';
})}
<div class="spacer"></div>
<input type="text" @model($newTodo) name="newTodo" placeholder="Enter new todo" />
<button ${this.__addEventConfig("click", [{"handler":"addTodo","params":[]}])}>Add Todo</button>
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