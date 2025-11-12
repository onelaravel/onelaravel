/**
 * View Engine class for managing view instances
 * @param {Object} config - View configuration
 */
import { __defineGetters, __defineMethods, __defineProperties, __defineProps, deleteProp, hasData, uniqId } from '../helpers/utils.js';
import { FollowingBlock } from './FollowingBlock.js';
import OneMarkup from './OneMarkup.js';
import { ViewState } from './ViewState.js';
import logger from './services/LoggerService.js';
import { ATTR, FORBIDDEN_KEYS } from './ViewConfig.js';

export class ViewEngine {
    constructor(path, config) {

        // Private properties using naming convention for browser compatibility
        /**
         * @type {Application}
         */
        this.App = null;
        /**
         * @type {boolean}
         */
        this.isSuperView = false;
        /**
         * @type {function}
         */
        this._emptyFn = () => { };
        /**
         * @type {string}
         */
        this.id = null;
        /**
         * @type {function}
         */
        this.init = this._emptyFn;
        /**
         * @type {ViewEngine}
         */
        this.parent = null;
        /**
         * @type {Array<ViewEngine>}
         */
        this.children = [];
        /**
         * @type {ViewEngine}
         */
        this.superView = null;
        /**
         * @type {string}
         */
        this.superViewPath = null;
        /**
         * @type {string}
         */
        this.superViewId = null;
        /**
         * @type {boolean}
         */
        this.hasSuperView = false;

        /**
         * @type {string}
         */
        this.originalViewPath = null;
        /**
         * @type {string}
         */
        this.originalViewId = null;
        /**
         * @type {ViewEngine}
         */
        this.originalView = null;
        /**
         * @type {boolean}
         */
        this.hasAwaitData = false;
        /**
         * @type {boolean}
         */
        this.hasFetchData = false;
        /**
         * @type {Object}
         */
        this.fetch = {};
        /**
         * @type {boolean}
         */
        this.usesVars = false;
        /**
         * @type {boolean}
         */
        this.hasSections = false;
        /**
         * @type {Array<string>}
         */
        this.renderLongSections = [];
        /**
         * @type {boolean}
         */
        this.hasSectionPreload = false;
        /**
         * @type {boolean}
         */
        this.hasPrerender = false;
        /**
         * @type {Object}
         */
        this.sections = {};
        /**
         * @type {function}
         */
        this.addCSS = this._emptyFn;
        this.removeCSS = this._emptyFn;
        /**
         * @type {Array<string>}
         */
        this.resources = [];
        this.userDefined = {};
        /**
         * @type {Object}
         */
        this.events = {};
        this.eventIndex = 0;
        /**
         * @type {Object}
         */
        this.eventHandlers = {};
        /**
         * @type {Object}
         */
        this.data = {};
        /**
         * @type {ViewState}
         */
        this.states = {};
        this.urlPath = '';
        /**
         * @type {boolean}
         */
        this.isInitlized = false;

        /**
         * @type {Object}
         */
        this.wrapperConfig = { enable: false, tag: null, follow: true, attributes: {}, ...(typeof config?.wrapperConfig === 'object' ? config.wrapperConfig : {}) };

        /**
         * @type {TemplateEngine}
         */
        this.templateEngine = null;

        // Initialize
        this.path = path;
        this.config = config || {};



        this.wrapTag = null;


        /**
         * @type {Map<string, FollowingBlock>}
         */
        this.followingBlocks = new Map();

        this.followingConfig = [];
        this.followingIndex = 0;
        this.followingScanIndex = 0;
        this.followingIDs = [];
        this.followingPrerenderIDs = [];
        this.followingRenderIDs = [];


        this.subscribeStates = true;

        this.childrenConfig = [];
        this.childrenIndex = 0;
        this.refreshChildrenIndex = 0;

        /**
         * @type {boolean}
         */
        this.isRendering = false;
        /**
         * @type {boolean}
         */
        this.isRendered = false;

        this.isMounted = false;
        this.isDestroyed = false; // Flag to prevent processing after destroy
        this.isScanning = false;
        this.isScanned = false;


        this.isReady = false;

        /**
         * @type {OneMarkupModel}
         */
        this.markup = null;
        /**
         * @type {Array<OneMarkupModel>}
         */
        this.refElements = [];


        this.eventListenerStatus = false;

        this.eventListeners = [];

        this.eventQuickHandles = [];

        this.isVirtualRendering = false;
        this.cachedSections = {};
        this.renderedContent = null;

        /**
         * @type {Object<{name: string, id: string, index: number, view: ViewEngine, data: Object, subscribe: Array<string>}>}
         */
        this.__scope = null;
        this.isRefreshing = false;

        this.changeStateQueueCount = 0;
        this.changedStateKeys = new Set(); // Use Set to avoid duplicates
        this._stateChangePending = false; // Flag to track if processing is scheduled

        /**
         * @type {LoopContext}
         */
        this.loopContext = null;

        this.isCommitedConstructorData = false;


    }


    /**
     * Setup the view engine with configuration
     * @param {string} path - View path
     * @param {Object} config - View configuration
     */
    setup(path, config) {
        if (this.isInitlized) {
            return this;
        }

        // Set config and path
        this.path = path;
        this.config = config || {};

        // Call _initialize to do the actual setup
        this.initialize();
        return this;
    }


    /**
     * Initialize the view engine with configuration
     * @private
     */
    initialize() {
        if (this.isInitlized) {
            return;
        }

        this.isInitlized = true;
        const config = this.config;

        // Set basic properties (giữ nguyên tên từ code gốc)
        this.id = config.viewId || uniqId();
        deleteProp(config, 'viewId');
        this.init = config.init || this._emptyFn;
        deleteProp(config, 'init');
        this.addCSS = config.addCSS || this._emptyFn;
        deleteProp(config, 'addCSS');
        this.removeCSS = config.removeCSS || this._emptyFn;
        deleteProp(config, 'removeCSS');
        this.states = config.states || new ViewState(this);
        deleteProp(config, 'states');
        this.superViewPath = config.superViewPath || config.superView;
        deleteProp(config, 'superViewPath');
        deleteProp(config, 'superView');
        this.hasSuperView = config.hasSuperView;
        deleteProp(config, 'hasSuperView');
        this.hasAwaitData = config.hasAwaitData;
        deleteProp(config, 'hasAwaitData');
        this.hasFetchData = config.hasFetchData;
        deleteProp(config, 'hasFetchData');
        this.fetch = config.fetch;
        deleteProp(config, 'fetch');
        this.usesVars = config.usesVars;
        deleteProp(config, 'usesVars');
        this.hasSections = config.hasSections;
        deleteProp(config, 'hasSections');
        this.hasSectionPreload = config.hasSectionPreload;
        deleteProp(config, 'hasSectionPreload');
        this.renderLongSections = config.renderLongSections || [];
        deleteProp(config, 'renderLongSections');
        this.hasPrerender = config.hasPrerender;
        deleteProp(config, 'hasPrerender');
        this.sections = config.sections;
        deleteProp(config, 'sections');
        this.wrapperConfig = { ...this.wrapperConfig, ...(typeof config.wrapperConfig === 'object' ? config.wrapperConfig : {}) };
        deleteProp(config, 'wrapperConfig');
        this.resources = config.resources;
        deleteProp(config, 'resources');
        this.userDefined = config.userDefined;
        deleteProp(config, 'userDefined');
        // Initialize arrays and objects
        this.master = null;
        this.children = [];
        this.events = {};
        this.eventHandlers = {};

        // Process defined properties and methods (giữ nguyên logic từ code gốc)
        this.processDefinedProperties(config);

        if (config && config.data && typeof config.data === 'object' && config.data.__SSR_VIEW_ID__) {
            config.data.__SSR_VIEW_ID__ = null;
            deleteProp(config.data, '__SSR_VIEW_ID__');
        }

        // Merge data
        this.data = { ...(this.data || {}), ...(config.data || {}) };
        this.commitConstructorData();
    }

    /**
     * Process defined properties and methods from config
     * @private
     */
    processDefinedProperties(config) {
        let definedProps = {};
        let definedMethods = {};

        if (config.__props__ && config.__props__.length > 0) {
            config.__props__.forEach(prop => {
                if (typeof config[prop] === 'function') {
                    definedMethods[prop] = config[prop].bind(this);
                }
                else if (typeof config[prop] !== 'undefined') {
                    definedProps[prop] = config[prop];
                }
            });
        }
        /**
         * lifecycle methods
         * beforeCreate hàm dược gọi trước khi view được tạo
         * created hàm dược gọi sau khi view được tạo
         * beforeMount hàm dược gọi trước khi view được mount
         * mounted hàm dược gọi sau khi view được mount
         * beforeUpdate hàm dược gọi trước khi view được update
         * updated hàm dược gọi sau khi view được update
         * beforeUnmount hàm dược gọi trước khi view được unmount
         * unmounted hàm dược gọi sau khi view được unmount
         */
        if (this.userDefined) {
            Object.entries(this.userDefined).forEach(([key, value]) => {
                if (FORBIDDEN_KEYS.includes(key)) {
                    return;
                }
                if (typeof value === 'function') {
                    definedMethods[key] = value.bind(this);
                }
                else {
                    definedProps[key] = value;
                }
            });
        }

        __defineProps(this, definedProps, {
            writable: true,
            configurable: true,
            enumerable: true,
        });

        __defineMethods(this, definedMethods);
    }



    setScope(scope) {
        this.__scope = scope;
    }

    loadServerData(_serverData = {}) {
        const [data, events] = _serverData;
        const result = typeof this.config.loadServerData === 'function' ? this.config.loadServerData.apply(this, [{ ...this.App.View.data, ...this.data, ..._data }]) : this.config.loadServerData;
        if (typeof result === 'object' && result.constructor === this.constructor) {
            return result;
        }
        return result;
    }

    commitConstructorData() {
        if (this.isCommitedConstructorData) {
            return;
        }
        if (hasData(this.data) && typeof this.config.updateVariableData === 'function') {
            this.config.updateVariableData.apply(this, [{ ...this.App.View.data, ...this.data }]);
            this.isCommitedConstructorData = true;
        }
        if (typeof this.config.commitConstructorData === 'function') {
            this.config.commitConstructorData.apply(this, []);
        }

    }

    /**
     * Add event configuration for view engine
     * @param {string} eventType - Type of event
     * @param {Array} handlers - Array of handler objects
     * @returns {string} Event attribute string
     * @example
     * <AppViewEngine>.addEventConfig('click', [{handler: 'handleClick', params: [1, 2, 3]}]);
     */
    addEventConfig(eventType, handlers) {
        if (typeof eventType !== 'string' || eventType === '') {
            return;
        }
        if (typeof handlers !== 'object' || handlers === null) {
            return;
        }
        return this.addEventStack(eventType, handlers);
    }



    /**
     * Render the view with data
     * @param {Object} _data - Additional data to merge
     * @returns {string|Object} Rendered content
     */
    render() {
        let renderFollowIDStart = this.followingIDs.length;
        this.commitConstructorData();
        console.log(`path: ${this.path}`, this);
        const result = this.config.render.apply(this, []);
        this.renderedContent = result;
        let renderFollowIDEnd = this.followingIDs.length;
        if (renderFollowIDEnd >= renderFollowIDStart) {
            this.followingRenderIDs.push(...this.followingIDs.slice(renderFollowIDStart));
        }

        if (typeof result === 'string' && result.trim() !== '' && this.isHtmlString(result)) {
            this.renderedContent = this.addXRefViewToRootElements(result);
        }
        return this.renderedContent;
    }

    /**
     * Virtual render the view with data (Scan version)
     * @param {Object} _data - Additional data to merge
     * @returns {string|Object} Virtual rendered content
     */
    virtualRender() {
        this.isScanning = true;
        this.isVirtualRendering = true;
        let renderFollowIDStart = this.followingIDs.length;
        this.commitConstructorData();
        const result = this.config.render.apply(this, []);
        let renderFollowIDEnd = this.followingIDs.length;
        if (renderFollowIDEnd >= renderFollowIDStart) {
            this.followingRenderIDs.push(...this.followingIDs.slice(renderFollowIDStart));
        }
        this.isVirtualRendering = false;
        this.isScanning = false;
        return result;
    }




    /**
     * Prerender the view with data
     * @param {Object} _data - Additional data to merge
     * @returns {string|Object} Prerendered content
     */
    prerender(_data = {}) {
        let renderFollowIDStart = this.followingIDs.length;
        this.commitConstructorData();
        const result = this.config.prerender.apply(this, []);
        let renderFollowIDEnd = this.followingIDs.length;
        if (renderFollowIDEnd >= renderFollowIDStart) {
            this.followingPrerenderIDs.push(...this.followingIDs.slice(renderFollowIDStart));
        }
        if (typeof result === 'string' && result.trim() !== '' && this.isHtmlString(result)) {
            return this.addXRefViewToRootElements(result);
        }
        return result;
    }

    /**
     * Virtual prerender the view with data (Scan version)
     * @param {Object} _data - Additional data to merge
     * @returns {string|Object} Virtual prerendered content
     */
    virtualPrerender(_data = {}) {
        this.isScanning = true;
        this.isVirtualRendering = true;
        let renderFollowIDStart = this.followingIDs.length;
        this.commitConstructorData();
        const result = this.config.prerender.apply(this, []);
        let renderFollowIDEnd = this.followingIDs.length;
        if (renderFollowIDEnd >= renderFollowIDStart) {
            this.followingPrerenderIDs.push(...this.followingIDs.slice(renderFollowIDStart));
        }
        this.isVirtualRendering = false;
        this.isScanning = false;
        return result;
    }




    /**
     * Replace view content with new HTML
     * @param {string} htmlString - New HTML content
     * @returns {boolean} True if replaced successfully
     */
    replaceView(htmlString) {
        if (this.isHtmlString(htmlString)) {
            const container = document.createElement('div');
            container.innerHTML = htmlString;
            const frag = container.content;
            const oldElements = document.querySelectorAll(`[x-ref-view="${this.id}"]`);
            const elemtntCount = oldElements.length;
            for (let i = elemtntCount - 1; i > 0; i--) {
                const oldElement = oldElements[i];
                const newElement = frag.childNodes[i];
                oldElement.parentNode.replaceChild(newElement, oldElement);
            }
            const oldElement = oldElements[0];
            oldElement.parentNode.replaceChild(frag, oldElement);
            return true;
        }
        return false;
    }


    /** lifecycle methods */

    /**
     * Lifecycle: Called before view is created (giữ nguyên tên từ code gốc)
     */

    beforeCreate() {
        if (typeof this.userDefined.beforeCreate === 'function') {
            this.userDefined.beforeCreate.call(this);
        }
    }
    /**
     * Lifecycle: Called after view is created (giữ nguyên tên từ code gốc)
     */
    created() {
        if (typeof this.userDefined.created === 'function') {
            this.userDefined.created.call(this);
        }
    }

    /**
     * Lifecycle: Called before view is updated (giữ nguyên tên từ code gốc)
     */
    beforeUpdate() {
        if (typeof this.userDefined.beforeUpdate === 'function') {
            this.userDefined.beforeUpdate.call(this);
        }
    }
    /**
     * Lifecycle: Called after view is updated (giữ nguyên tên từ code gốc)
     */
    updated() {
        if (typeof this.userDefined.updated === 'function') {
            this.userDefined.updated.call(this);
        }
    }

    beforeInit() {
        if (typeof this.userDefined.beforeInit === 'function') {
            this.userDefined.beforeInit.call(this);
        }
    }
    init() {
        if (typeof this.userDefined.init === 'function') {
            this.userDefined.init.call(this);
        }
    }
    afterInit() {
        if (typeof this.userDefined.afterInit === 'function') {
            this.userDefined.afterInit.call(this);
        }
    }
    /**
     * Lifecycle: Called before view is destroyed (giữ nguyên tên từ code gốc)
     */
    beforeDestroy() {
        if (typeof this.userDefined.beforeDestroy === 'function') {
            this.userDefined.beforeDestroy.call(this);
        }
    }
    /**
     * Lifecycle: Called after view is destroyed (giữ nguyên tên từ code gốc)
     */
    destroyed() {
        if (typeof this.userDefined.destroyed === 'function') {
            this.userDefined.destroyed.call(this);
        }
    }
    /**
     * Lifecycle: Called before view is mounted (giữ nguyên tên từ code gốc)
     */
    beforeMount() {
        if (typeof this.userDefined.beforeMount === 'function') {
            this.userDefined.beforeMount.call(this);
        }
    }


    /**
     * Lifecycle: Called when view is mounted (giữ nguyên tên từ code gốc)  
     */
    mounted() {
        if (!this.isMounted) {
            if (typeof this.userDefined.mounted === 'function') {
                this.userDefined.mounted.call(this);
            }

            this.startEventListener();
            this.isMounted = true;
        }

        if (this.originalView && this.originalView instanceof ViewEngine) {
            this.originalView.onSuperViewMounted();
        }
        if (this.children && this.children.length > 0) {
            this.children.forEach(child => {
                if (child && child instanceof ViewEngine) {
                    child.onParentMounted();
                }
            });
        }
        if (this.followingBlocks && this.followingBlocks.size > 0) {
            this.followingBlocks.forEach(block => {
                block.mounted();
            });
        }
    }

    /**
     * Lifecycle: Called before view is unmounted (giữ nguyên tên từ code gốc)
     */
    beforeUnmount() {
        if (typeof this.userDefined.beforeUnmounted === 'function') {
            this.userDefined.beforeUnmounted.call(this);
        }
    }

    /**
     * Lifecycle: Called when view is unmounted (giữ nguyên tên từ code gốc)
     */
    unmounted() {
        if (this.isMounted) {
            if (typeof this.userDefined.unmounted === 'function') {
                this.userDefined.unmounted.call(this);
            }
            this.stopEventListener();
            this.isMounted = false;
        }
        if (this.originalView && this.originalView instanceof ViewEngine) {
            this.originalView.onSuperViewUnmounted();
        }
        if (this.children && this.children.length > 0) {
            this.children.forEach(child => {
                if (child && child instanceof ViewEngine) {
                    child.onParentUnmounted();
                }
            });
        }
        if (this.followingBlocks && this.followingBlocks.size > 0) {
            this.followingBlocks.forEach(block => {
                block.unmounted();
            });
        }
    }


    /**
     * Lifecycle: Called when view is destroyed (giữ nguyên tên từ code gốc)
     */
    destroy() {
        // Mark as destroyed to prevent processing after destroy
        this.isDestroyed = true;

        // Reset pending flag to prevent processing after destroy
        this._stateChangePending = false;

        // Clear state change collections
        if (this.changedStateKeys) {
            this.changedStateKeys.clear();
        }
        this.changeStateQueueCount = 0;

        this.unmounted();
        if (this.originalView && this.originalView instanceof ViewEngine) {
            this.originalView.destroy();
        }
        if (this.children && this.children.length > 0) {
            this.children.forEach(child => child.destroy());
        }
        if (this.followingBlocks && this.followingBlocks.size > 0) {
            this.followingBlocks.forEach(block => block.destroy());
            this.followingBlocks.clear();
        }
        if (this.refElements && this.refElements.length > 0) {
            this.refElements.forEach(element => element.parentNode && element.parentNode.removeChild(element));
            this.refElements = [];
        }
    }

    refresh() {
        this.isRefreshing = true;
        // TH1: có super view
        if (this.parent && this.parent instanceof ViewEngine) {
            this.parent.refresh();
        }
        // TH2: nếu là super view
        // TH3: nếu là page view
        // TH4: nếu là child view
    }
    /**
     * Lifecycle: Called when super view is mounted (giữ nguyên tên từ code gốc)
     */
    onSuperViewMounted() {
        this.mounted();
    }

    /**
     * Lifecycle: Called when super view is unmounted (giữ nguyên tên từ code gốc)
     */
    onSuperViewUnmounted() {

    }

    /**
     * Lifecycle: Called when parent view is mounted (giữ nguyên tên từ code gốc)
     */
    onParentMounted() {
        this.mounted();
    }
    /**
     * Lifecycle: Called when parent view is unmounted (giữ nguyên tên từ code gốc)
     */
    onParentUnmounted() {
        // Placeholder for when parent view is unmounted
    }



    /**
     * Hàm parse string HTML thành DOM, thêm thuộc tính x-ref-view cho các phần tử con level 0, trả về string HTML mới.
     * @param {string} htmlString - Chuỗi HTML đầu vào
     * @param {string|number} id - Giá trị cho thuộc tính x-ref-view
     * @returns {string} Chuỗi HTML đã thêm thuộc tính x-ref-view cho các phần tử level 0
     */
    addXRefViewToRootElements(htmlString) {
        // Tạo một container ảo để parse HTML
        const container = document.createElement('div');
        container.innerHTML = htmlString;

        // Lặp qua các phần tử con trực tiếp (level 0)
        Array.from(container.children).forEach(child => {
            child.setAttribute('x-ref-view', this.id);
        });

        // Trả về HTML đã được thêm thuộc tính
        return container.innerHTML;
    }

    /**
     * Check if string is HTML
     * @param {string} str - String to check
     * @returns {boolean} True if HTML string
     * @private
     */
    isHtmlString(str) {
        return /<[a-z][\s\S]*>/i.test(str);
    }



    renderPlaceholder() {
        return `<div class="${ATTR.className('placeholder')}" ${ATTR.KEYS.VIEW_ID}="${this.id}"></div>`;
    }

    showError(error) {
        if (this.isSuperView) {
            return `<div class="${ATTR.className('ERROR_VIEW')}">${error}</div>`;
        }
        else if (this.hasSuperView) {
            if (this.renderLongSections.length > 0) {
                return this.renderLongSections.map(section => {
                    return this.App.View.section(section, `<div class="${ATTR.className('section-error')}" ${ATTR.KEYS.VIEW_SECTION_REF}="${this.id}">${error}</div>`, 'html');
                }).join('');
            }
            else {
                return `<div class="${ATTR.className('ERROR_VIEW')}" ${ATTR.KEYS.VIEW_ID}="${this.id}">${error}</div>`;
            }
        }
        else {
            if (this.renderLongSections.length > 0) {
                return this.renderLongSections.map(section => {
                    return this.App.View.section(section, `<div class="${ATTR.className('section-error')}" ${ATTR.KEYS.VIEW_SECTION_REF}="${this.id}">${error}</div>`, 'html');
                }).join('');
            }
            return `<div class="${ATTR.className('ERROR_VIEW')}" ${ATTR.KEYS.VIEW_ID}="${this.id}">${error}</div>`;
        }
    }

    showErrorScan(error) {
        return null;
    }


    resetOriginalView() {
        if (this.originalView && this.originalView instanceof ViewEngine) {
            this.originalView.destroy();
        }
    }

    ejectOriginalView() {
        if (this.originalView && this.originalView instanceof ViewEngine) {
            this.originalView = null;
            this.originalViewId = null;
            this.originalViewPath = null;
        }
    }

    /**
     * Remove this view and all children
     * @returns {AppViewEngine} This instance for chaining
     */
    remove() {
        this.master?.removeChild(this);
        this.children.forEach(child => child.remove());
        this.master = null;
        this.children = [];
        return this;
    }

    /**
     * Insert resources into DOM
     */
    insertResources() {
        this.resources.forEach(resource => {
            if (document.querySelector(`[data-resource-uuid="${resource.uuid}"]`)) {
                return;
            }
            const element = document.createElement(resource.tag);
            Object.entries(resource.attrs).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            element.setAttribute('data-resource-uuid', resource.uuid);
            if (resource.tag === 'script') {
                document.body.appendChild(element);
            }
            else if (resource.tag === 'link') {
                document.head.appendChild(element);
            }
            else if (resource.tag === 'style') {
                document.head.appendChild(element);
            }
            document.head.appendChild(element);
        });
    }

    /**
     * Remove resources from DOM
     */
    removeResources() {
        this.resources.forEach(resource => {
            const element = document.querySelector(`[data-resource-uuid="${resource.uuid}"]`);
            if (element) {
                element.remove();
            }
        });
    }


    __showError(error) {
        logger.error(`ViewEngine Error [${this.path}]: ${error}`);
        return this.showError(error);
    }



    /**
     * 
     * @param {string} name tên của section
     * @param {string} content nội dung của section
     * @param {string} type loại của section
     * @returns {string} kết quả của việc render section
     * @example
     * <AppViewEngine>.section("section.name", "<div>Content</div>", "html");
     */
    __section(name, content, type) {
        this.cachedSections[name] = content;
        // Nếu là virtual rendering thì không render section
        if(this.isVirtualRendering){
            return null;
        }
        return this.App.View.section(name, content, type);
    }

    /**
     * 
     * @param {string} name tên của section
     * @param {string} defaultValue giá trị mặc định của section
     * @returns {string} kết quả của việc render section
     * @example
     * <AppViewEngine>.yield("section.name", "Default Content");
     */
    __yield(name, defaultValue = '') {
        return this.App.View.yield(name, defaultValue);
    }

    __yieldContent(name, defaultValue = '') {
        return this.App.View.yieldContent(name, defaultValue);
    }



    /**
     * 
     * @param {...any} args các tham số của hàm execute
     * @returns {string} kết quả của việc execute
     * @example
     * <AppViewEngine>.execute("console.log('Hello, world!');");
     */
    __execute(...args) {
        return this.App.View.execute(...args);
    }

    __subscribe(...args) {
        // return this.subscribe(...args);
    }


    __text(...args) {
        return this.App.View.text(...args);
    }

    /**
     * __ methods 
     */

    /**
     * 
     * @param {string[]} stateKeys danh sách các state keys
     * @param {() => string} renderBlock hàm render block
     * @returns {string} kết quả của việc render block
     * @example
     * <AppViewEngine>.follow(["userState"], () => {
     *     return `<div>User State: ${userState}</div>`;
     * });
     * // returns '<div>User State: 1</div>'
     */
    __follow(stateKeys = [], renderBlock = () => '') {
        if(this.isVirtualRendering){
            return this.renderFollowingBlockScan(stateKeys, renderBlock);
        }
        return this.renderFollowingBlock(stateKeys, renderBlock);
    }



    /**
     * 
     * @param {string} name tên của block
     * @param {Object} attributes thuộc tính của block
     * @param {string} content nội dung của block
     * @returns {string} kết quả của việc render block
     * @example
     * <AppViewEngine>.block("name", { "class": "class-name" }, "<div>Content</div>");
     */
    __block(name, attributes = {}, content) {
        return this.addBlock(name, attributes, content);
    }

    /**
     * 
     * @param {string} path đường dẫn của view
     * @param {Object} data dữ liệu của view
     * @returns {string} kết quả của việc render view
     * @example
     * <AppViewEngine>.include("path.to.view", { "data": "value" });
     */
    __include(path, data = {}) {
        // Nếu là virtual rendering thì tìm child config từ server data
        if (this.isVirtualRendering) {
            const childParams = this.childrenConfig[this.childrenIndex];
            if (!(childParams && childParams.name === path)) {
                return null;
            }
            this.childrenIndex++;
            const childConfig = this.App.View.ssrViewManager.getInstance(childParams.name, childParams.id);
            if (!childConfig) {
                return null;
            }
            const childData = { ...data, ...childConfig.data, __SSR_VIEW_ID__: childParams.id };
            const child = this.$include(childParams.name, childData);
            if (!child) {
                return null;
            }
            child.__scan(childConfig);
            return child;
        }
        // Nếu không phải virtual rendering thì gọi $include
        return this.$include(path, data);

    }

    __includeif(path, data = {}) {
        if (!this.App.View.exists(path)) {
            return null;
        }
        return this.__include(path, data);
    }

    __includewhen(condition, path, data = {}) {
        if (!condition) {
            return null;
        }
        return this.__include(path, data);
    }


    __extends(name, data = {}) {
        // Nếu là virtual rendering thì tìm super view từ server data
        if(this.isVirtualRendering){
            if (!this.App.View.exists(name)) {
                return null;
            }
            let superViewConfig = null;
            let superViewOfChildren = this.childrenConfig.find((child, index) => child.name === name && index == this.childrenConfig.length - 1);
            if (superViewOfChildren) {
                superViewConfig = this.App.View.ssrViewManager.getInstance(superViewOfChildren.name, superViewOfChildren.id);
            } else {
                superViewConfig = this.App.View.ssrViewManager.scan(name);
            }
            if (!superViewConfig) {
                return null;
            }
            const superViewData = { ...data, ...superViewConfig.data, __SSR_VIEW_ID__: superViewConfig.viewId };
            const superView = this.$extends(name, superViewData);
            if (!superView) {
                return null;
            }
            superView.__scan(superViewConfig);
            return superView;
        }
        return this.$extends(name, data);
    }


    __setLoopContext(length) {
        let parent = this.loopContext;
        this.loopContext = new LoopContext(parent);
        this.loopContext.setCount(length);
        return this.loopContext;
    }

    __resetLoopContext() {
        if (this.loopContext && this.loopContext.parent) {
            let parent = this.loopContext.parent;
            this.loopContext.parent = null;
            Object.freeze(this.loopContext);
            this.loopContext = parent;
        } else if (this.loopContext) {
            Object.freeze(this.loopContext);
            this.loopContext = null;
        } else {
            this.loopContext = null;
        }
        return this.loopContext;
    }

    /**
     * Lặp qua danh sách hoặc đối tượng và gọi callback cho mỗi phần tử hoặc key
     * @param {Array|Object} list danh sách cần lặp hoặc đối tượng cần lặp
     * @param {function(item: any, defaultKeyName: string, index: number, loopContext: LoopContext): string} callback hàm callback để xử lý mỗi phần tử hoặc key của đối tượng
     * @returns {string} kết quả của việc lặp
     * @example
     * <AppViewEngine>.foreach([1, 2, 3], (item, defaultKeyName, index, loopContext) => {
     *     return `<div>${defaultKeyName}: ${item}</div>`;
     * });
     * // returns '<div>1</div><div>2</div><div>3</div>'
     * <AppViewEngine>.foreach({a: 1, b: 2, c: 3}, (value, key, index, loopContext) => {
     *     return `<div>${key}: ${value}</div>`;
     * });
     */
    __foreach(list, callback) {
        if (!list) {
            return '';
        }
        if (!(list && typeof list === 'object' && !Array.isArray(list))) {
            return '';
        }
        let result = '';
        if (Array.isArray(list)) {
            let loopContext = this.__setupLoopContext(list);
            loopContext.setType('increment');
            list.forEach((item, index) => {
                loopContext.setCurrentTimes(index);
                result += callback(item, index, index, loopContext);
            });
            this.__resetLoopContext();
        } else {
            let count = Object.keys(list).length;
            let loopContext = this.__setupLoopContext(count);
            loopContext.setType('increment');
            let index = 0;
            Object.entries(list).forEach(([key, value]) => {
                loopContext.setCurrentTimes(index);
                result += callback(value, key, index, loopContext);
                index = index + 1;
            });
            this.__resetLoopContext();
        }
        return result;
    }


    /**
     * Scan and hydrate server-rendered view
     * This method:
     * 1. Finds DOM elements for this view
     * 2. Attaches event handlers from server data
     * 3. Sets up state subscriptions
     * 4. Stores children and following block references
     *
     * @param {Object} config - Server-side view configuration
     * @param {string} config.viewId - View instance ID
     * @param {Object} config.data - View data from server
     * @param {Object} config.events - Event handlers to attach
     * @param {Array} config.following - Following blocks to setup
     * @param {Array} config.children - Child views to scan
     * @param {Object} config.parent - Parent view reference
     */
    __scan(config) {
        if (this.isScanned) {
            return;
        }
        // this.isScanned = true;
        this.isScanning = true;
        const { viewId, data, events, following, children, parent } = config;
        if (data && typeof data === 'object') {
            // this.data = { ...this.data, ...data };
            this.updateVariableData(data);
        }


        if (typeof viewId !== 'string' || viewId === '') {
            logger.warn('⚠️ ViewEngine.__scan: Invalid viewId', viewId);
            return null;
        }

        logger.log(`🔍 ViewEngine.__scan: Scanning view ${this.path} (${viewId})`);

        // ========================================================================
        // STEP 1: Find DOM Elements
        // ========================================================================

        this.__scanDOMElements(viewId);

        // ========================================================================
        // STEP 2: Attach Event Handlers
        // ========================================================================

        // if (events && typeof events === 'object') {
        //     this.__attachEventHandlers(events, viewId);

        // }

        // ========================================================================
        // STEP 3: Setup State Subscriptions (Following Blocks)
        // ========================================================================

        if (following && following.length > 0) {
            this.__setupFollowingBlocks(following, viewId);
        }

        // ========================================================================
        // STEP 4: Store Children References
        // ========================================================================

        if (children && children.length > 0) {
            this.__storeChildrenReferences(children);
        }

        // ========================================================================
        // STEP 5: Store Parent Reference
        // ========================================================================

        // if (parent) {
        //     this.parentView = parent;
        // }

        logger.log(`✅ ViewEngine.__scan: Scan complete for ${this.path} (${viewId})`);
        // this.isScanning = false;
        this.isScanned = true;
    }

    /**
     * Find and store DOM elements for this view
     * @private
     * @param {string} viewId - View instance ID
     */
    __scanDOMElements(viewId) {
        if (this.hasSuperView) {
            logger.log(`✅ ViewEngine.__scanDOMElements: Skipping element scan for ${this.path} (${viewId}) due to super view`);
            return;
        }
        if (this.wrapperConfig.enable) {
            if (this.wrapperConfig.tag) {
                // Custom wrapper tag
                let elements = document.querySelectorAll(
                    `${this.wrapperConfig.tag}[data-wrap-view="${this.path}"][${ATTR.KEYS.VIEW_WRAPPER}="${viewId}"]`
                );
                if (elements.length > 0) {
                    this.refElements = Array.from(elements).map((el) => {
                        el.setAttribute('x-ref-view', viewId);
                        return el;
                    });
                    logger.log(`✅ ViewEngine.__scanDOMElements: Found ${elements.length} custom wrapper elements`);
                }
            } else {
                // Use OneMarkup to find view boundary
                const markup = OneMarkup.first('view', { name: this.path, id: viewId });
                if (markup) {
                    this.markup = markup;
                    this.refElements = markup.nodes.filter(node => node.nodeType === Node.ELEMENT_NODE);
                    logger.log(`✅ ViewEngine.__scanDOMElements: Found view boundary with ${this.refElements.length} elements`);
                }
            }
        } else {
            // Standard view wrapper
            let elements = document.querySelectorAll(`[data-view-wrapper="${viewId}"]`);
            if (elements.length > 0) {
                this.refElements = Array.from(elements).map((el) => {
                    el.setAttribute('x-ref-view', viewId);
                    return el;
                });
                logger.log(`✅ ViewEngine.__scanDOMElements: Found ${elements.length} standard wrapper elements`);
            }
        }

        if (!this.refElements || this.refElements.length === 0) {
            logger.warn(`⚠️ ViewEngine.__scanDOMElements: No elements found for ${this.path} (${viewId})`);
        }
    }

    /**
     * Attach event handlers to DOM elements from server data
     * @private
     * @param {Object} events - Event map from server
     * @param {string} viewId - View instance ID
     */
    __attachEventHandlers(events, viewId) {
        let attachedCount = 0;
        this.events = events;
        return;

        logger.log(`✅ ViewEngine.__attachEventHandlers: Attached ${attachedCount} event handlers`);
    }

    /**
     * Setup following blocks for reactive state updates
     * @private
     * @param {Array} following - Following block configurations
     * @param {string} viewId - View instance ID
     */
    __setupFollowingBlocks(following, viewId) {
        following.forEach(followConfig => {
            const { id, stateKeys } = followConfig;

            // Store config
            this.followingConfig.push({
                id,
                stateKeys,
            });
            return;
        });

    }


    /**
     * Store children view references for hydration
     * @private
     * @param {Array} children - Child view configurations
     */
    __storeChildrenReferences(children) {
        children.forEach(child => {
            const { name, id } = child;
            this.childrenConfig.push({
                name,
                id,
            });
        });

        // logger.log(`✅ ViewEngine.__storeChildrenReferences: Stored ${children.length} children references`);
    }



    $extends(path, data = {}) {
        const originData = this.data ? this.data : {};
        if (originData.__SSR_VIEW_ID__) {
            originData.__SSR_VIEW_ID__ = null;
            delete originData.__SSR_VIEW_ID__;
        }
        const viewInstance = this.App.View.extendView(path, { ...originData, ...data });
        if (!viewInstance) {
            return null;
        }
        this.superViewPath = path;
        this.setSuperView(viewInstance);
        viewInstance.setOriginalView(this);
        return viewInstance;
    }



    $include(path, data = {}) {
        const parentData = this.data ? this.data : {};
        if (parentData.__SSR_VIEW_ID__) {
            parentData.__SSR_VIEW_ID__ = null;
            delete parentData.__SSR_VIEW_ID__;
        }
        const viewInstance = this.App.View.include(path, { ...parentData, ...data });
        if (!viewInstance) {
            return null;
        }
        viewInstance.setParent(this);
        this.addChild(viewInstance, data);
        return viewInstance;
    }


    /**
     * Add event stack for specific event type and ID
     * @param {string} eventType - Type of event
     * @param {Array} handlers - Array of handler objects
     * @returns {string} Event attribute string
     */
    addEventStack(eventType, handlers) {
        if (typeof eventID !== 'string' || eventID === '') {
            return;
        }
        if (typeof handlers !== 'object' || handlers === null) {
            return;
        }
        let eventIndex = this.eventIndex++;
        let eventID = this.viewId + '-' + eventType + '-' + eventIndex;
        if (typeof this.events[eventType] === 'undefined') {
            this.events[eventType] = {};
        }
        if (typeof this.events[eventType][eventID] === 'undefined') {
            this.events[eventType][eventID] = []
        }
        this.events[eventType][eventID].push(...handlers);

        return ` data-${eventType}-id="${eventID}"`;
    }


    __addEventConfig(eventType, handlers) {
        return this.addEventConfig(eventType, handlers);
    }

    /**
     * Set event configuration for view engine
     * @param {Object} events - Event configuration object
     */
    setEventConfig(events) {
        if (typeof events !== 'object' || events === null) {
            return;
        }
        Object.entries(events).forEach((eventType, eventObjectList) => {
            if (typeof eventObjectList !== 'object' || eventObjectList === null) {
                return;
            }
            Object.entries(eventObjectList).forEach((eventID, handlers) => {
                this.addEventStack(eventType, eventID, handlers);
            });
        });
    }

    startEventListener() {
        const needDeleted = [];
        Object.entries(this.events).forEach(([eventType, eventMap]) => {
            Object.entries(eventMap).forEach(([eventID, handlers]) => {
                const selector = `[data-${eventType}-id="${eventID}"]`;
                const elements = document.querySelectorAll(selector);
                const parsedHandlers = this.parseEventHandlerFunctions(handlers);
                if (parsedHandlers.length !== 0 && elements.length > 0) {
                    elements.forEach(element => {
                        const handler = (event) => {
                            let returnValue = null;
                            for (let i = 0; i < parsedHandlers.length; i++) {
                                const handlerFn = parsedHandlers[i];
                                returnValue = handlerFn(event);
                                if (returnValue === false || event.defaultPrevented) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    break;
                                }
                            }
                            if (returnValue === false || returnValue === true) {
                                return returnValue;
                            }
                        }
                        element.addEventListener(eventType, handler);
                        this.eventListeners.push({ element, eventType, handler });
                    });
                } else {
                    logger.warn(`⚠️ ViewEngine.startEventListener: No elements found for selector ${selector} or no handlers defined`);
                    needDeleted.push({ eventType, eventID });
                }
            });
        });
        needDeleted.forEach(({ eventType, eventID }) => {
            delete this.events[eventType][eventID];
            // If no more event handlers for this eventType, remove the entire eventType
            if (Object.keys(this.events[eventType]).length === 0) {
                delete this.events[eventType];
            }
        });
        this.eventListenerStatus = true;
    }

    stopEventListener() {
        this.eventListeners.forEach(({ element, eventType, handler }) => {
            element.removeEventListener(eventType, handler);
        });
        this.eventListeners = [];
        this.eventListenerStatus = false;
    }

    /**
     * Clear all event data when elements are not found
     * This helps prevent memory leaks from orphaned event handlers
     */
    clearOrphanedEventData() {
        const needDeleted = [];
        Object.entries(this.events).forEach(([eventType, eventMap]) => {
            Object.entries(eventMap).forEach(([eventID, handlers]) => {
                const selector = `[data-${eventType}-id="${eventID}"]`;
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) {
                    needDeleted.push({ eventType, eventID });
                }
            });
        });

        needDeleted.forEach(({ eventType, eventID }) => {
            delete this.events[eventType][eventID];
            // If no more event handlers for this eventType, remove the entire eventType
            if (Object.keys(this.events[eventType]).length === 0) {
                delete this.events[eventType];
            }
        });

        if (needDeleted.length > 0) {
            logger.log(`🗑️ ViewEngine.clearOrphanedEventData: Cleaned up ${needDeleted.length} orphaned event handlers`);
        }
    }


    parseEventHandlerFunctions(handlers) {
        let parsedHandlers = [];
        handlers.forEach(handlerObj => {
            const handlerName = handlerObj.handler;
            const params = handlerObj.params || [];
            const func = this.parseHandlerFunction(handlerName);
            const fn = (event) => func(...this.parseEventHandlerParams(event, params));
            parsedHandlers.push(fn);
        });
        return parsedHandlers;
    }

    parseHandlerFunction(funcName) {
        if(!(typeof funcName === 'string' || typeof funcName === 'function')) {
            return null;
        }
        if (typeof funcName === 'function') {
            if(typeof funcName.bind === 'function') {
                return funcName.bind(this);
            }
            return funcName;
        }
        // nếu là function trong userDefined thì lấy thông tin hàm đó
        if (typeof this.userDefined[funcName] === 'function') {
            let func = this.userDefined[funcName];
            if(typeof func.bind === 'function') {
                func = func.bind(this);
            }
            return func;
        }
        // nếu là function trong this thì lấy thông tin hàm đó
        if (typeof this[funcName] === 'function') {
            let func = this[funcName];
            if(typeof func.bind === 'function') {
                func = func.bind(this);
            }
            return func;
        }
        // nếu là function trong states.__setters__ thì lấy thông tin hàm đó
        if (typeof this.states.__setters__[funcName] === 'function') {
            let func = this.states.__setters__[funcName];
            if(typeof func.bind === 'function') {
                func = func.bind(this);
            }
            return func;
        }
        // nếu là function trong window thì lấy thông tin hàm đó
        if (window && typeof window[funcName] === 'function') {
            let func = window[funcName];
            if(typeof func.bind === 'function') {
                func = func.bind(window);
            }
            return func;
        }
        return (event) => logger.warn(`⚠️ Event handler ${funcName} is not defined`, event);
    }

    parseEventHandlerParams(event, params = []) {
        return params.map(param => {
            if (param === '@EVENT') {
                return event;
            }
            else if (typeof param === 'object' && param !== null) {
                if (typeof param.handler === 'string' && (Array.isArray(param.params) || (typeof param.params == 'object' && param.params !== null && param.params.constructor === Array))) {
                    const func = this.parseHandlerFunction(param.handler);
                    return func(...this.parseEventHandlerParams(event, param.params));
                }
                return this.parseEventHandlerObject(event, param);
            }
            else if (Array.isArray(param) || (typeof param === 'object' && param !== null && param.constructor === Array)) {
                return this.parseEventHandlerParams(event, param);
            }
            else if (typeof param === 'function') {
                return param(event);
            }
            return param;
        });
    }

    parseEventHandlerObject(event, object = {}) {
        let parsedObject = {};
        Object.entries(object).forEach(([key, value]) => {
            if (value === '@EVENT') {
                parsedObject[key] = event;
            }
            else if (typeof value === 'object' && value !== null) {
                if (typeof value.handler === 'string' && (Array.isArray(value.params) || (typeof value.params == 'object' && value.params !== null && value.params.constructor === Array))) {
                    const func = this.parseHandlerFunction(value.handler);
                    parsedObject[key] = func(...this.parseEventHandlerParams(event, value.params));
                }
                else {
                    parsedObject[key] = this.parseEventHandlerObject(event, value);
                }
            }
            else if (Array.isArray(value) || (typeof value === 'object' && value !== null && value.constructor === Array)) {
                parsedObject[key] = this.parseEventHandlerParams(event, value);
            }
            else if (typeof value === 'function') {
                parsedObject[key] = value(event);
            }
            else {
                parsedObject[key] = value;
            }
        });
        return parsedObject;
    }





    wrapattr() {
        return ` ${ATTR.KEYS.VIEW_WRAPPER}="${this.id}"`;
    }

    startWrapper(tag = null, attributes = {}) {
        this.wrapTag = null;
        if (typeof tag === 'string') {
            this.wrapTag = tag;
        }
        else if (typeof tag === 'object') {
            this.wrapTag = tag.tag || 'div';
            delete tag.tag;
            attributes = { ...attributes, ...tag.attributes };
            tag = null;
        }
        if (typeof attributes === 'string' || !attributes) {
            attributes = {};
        }
        if (this.wrapTag) {
            return `<${this.wrapTag} data-wrap-view="${this.path}" data-wrap-id="${this.id}" ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}>`;
        }
        return `<!-- [one:view name="${this.path}" id="${this.id}"] -->`;

    }
    endWrapper() {
        if (this.wrapTag) {
            this.wrapTag = null;
            return `</${this.wrapTag}>`;
        }
        this.wrapTag = null;
        return `<!-- [/one:view] -->`;
    }

    addBlock(name, attributes = {}, content) {
        if (typeof name !== 'string' || name === '') {
            return;
        }
        if(this.isVirtualRendering){
            return this.App.View.section("block." + name, `<!-- [one:block name="${this.path}" ref="${this.id}"] -->${content}<!-- [/one:block] -->`, 'html');
        }
        return this.App.View.section("block." + name, `<!-- [one:block name="${this.path}" ref="${this.id}"] -->${content}<!-- [/one:block] -->`, 'html');
    }

    useBlock(name, defaultValue = '') {
        if (typeof name !== 'string' || name === '') {
            return;
        }
        if(this.isVirtualRendering){
            return `<!-- [one:subscribe type="block" key="${name}"] -->${this.App.View.yield("block." + name, defaultValue)}<!-- [/one:subscribe] -->`;
        }
        return `<!-- [one:subscribe type="block" key="${name}"] -->${this.App.View.yield("block." + name, defaultValue)}<!-- [/one:subscribe] -->`;
    }


    mountBlock(name, defaultValue = '') {
        return this.useBlock(name, defaultValue);
    }

    subscribeBlock(name, defaultValue = '') {
        return " data-subscribe-block=\"" + name + "\"";
    }

    renderFollowingBlock(stateKeys = [], renderBlock = () => '') {
        if (!Array.isArray(stateKeys) || stateKeys.length === 0) {
            return '';
        }

        if (typeof renderBlock !== 'function') {
            return '';
        }
        if (this.isVirtualRendering) {
            this.isVirtualRendering = false;
            let result = this.renderFollowingBlockScan(stateKeys, renderBlock);
            this.isVirtualRendering = true;
            return result;
        }
        const followBlock = new FollowingBlock({ stateKeys, renderBlock, engine: this, states: this.states, App: this.App });
        // this.followingBlocks.push(followBlock);
        this.followingIDs.push(followBlock.id);
        this.followingBlocks.set(followBlock.id, followBlock);
        const result = followBlock.render();
        return result;
    }

    renderFollowingBlockScan(stateKeys = [], renderBlock = () => '') {
        let followingIndex = this.followingScanIndex;
        let followingConfig = this.followingConfig[followingIndex];
        if (!(followingConfig || (followingConfig.stateKeys == stateKeys) || (followingConfig.stateKeys.length == stateKeys.length && followingConfig.stateKeys.every(value => stateKeys.includes(value))))) {
            return '';
        }
        const { id: renderID } = followingConfig;
        const followBlock = new FollowingBlock({ renderID, stateKeys, renderBlock, engine: this, states: this.states, App: this.App });
        followBlock.scan();
        // this.followingBlocks.push(followBlock);
        this.followingIDs.push(followBlock.id);
        this.followingBlocks.set(followBlock.id, followBlock);
        this.followingScanIndex++;
        return ``;
    }


    onFollowUpdating() {
        this.stopEventListener();
        setTimeout(() => {
            if (!this.eventListenerStatus) {
                this.startEventListener();
            }
        }, 10);
    }

    onFollowUpdated() {
        if (!this.eventListenerStatus) {
            this.startEventListener();
        }
    }

    onStateChange(key, value, oldValue) {
        // Use Set to automatically handle duplicates
        this.changedStateKeys.add(key);

        // Increment queue count (for tracking/statistics if needed)
        this.changeStateQueueCount++;

        // Schedule batch processing using Promise for async execution
        // Promise.resolve().then() runs in microtask queue, faster than setTimeout
        // and works even when tab is hidden (unlike requestAnimationFrame)
        // The _stateChangePending flag ensures only one Promise is scheduled at a time
        // All subsequent changes will be batched into the Set
        if (!this._stateChangePending) {
            this._stateChangePending = true;

            // Use Promise.resolve().then() for microtask queue (fastest, works in background)
            Promise.resolve().then(() => {
                // Clear pending flag before processing
                this._stateChangePending = false;
                this._processStateChanges();
            });
        }
    }

    /**
     * Process batched state changes efficiently
     * @private
     */
    _processStateChanges() {
        // Skip if view is destroyed
        if (this.isDestroyed) {
            return;
        }

        // Get all changed keys as array for processing
        const changedKeys = Array.from(this.changedStateKeys);

        // Reset collections
        this.changedStateKeys.clear();
        this.changeStateQueueCount = 0;

        // If no keys changed, skip processing
        if (changedKeys.length === 0) {
            return;
        }

        // Process state changes - trigger view updates
        // Already in microtask queue (from Promise.resolve().then()), so execute directly
        this._notifyStateChanges(changedKeys);
    }

    /**
     * Notify views about state changes
     * @param {Array<string>} changedKeys - Array of changed state keys
     * @private
     */
    _notifyStateChanges(changedKeys) {
        // Trigger refresh for views that subscribe to these keys
        // This will be called after all synchronous operations complete
        if (this.isRefreshing) {
            return; // Prevent recursive refresh
        }

        // Check if this view subscribes to any of the changed keys
        if (this.subscribe && Array.isArray(this.subscribe) && this.subscribe.length > 0) {
            const shouldRefresh = changedKeys.some(key => this.subscribe.includes(key));
            if (shouldRefresh) {
                this.refresh();
            }
        }

        // Notify children that subscribe to changed keys
        if (this.children && this.children.length > 0) {
            this.children.forEach(childScope => {
                if (childScope.subscribe && Array.isArray(childScope.subscribe)) {
                    const shouldRefresh = changedKeys.some(key => childScope.subscribe.includes(key));
                    if (shouldRefresh && childScope.view) {
                        childScope.view._notifyStateChanges(changedKeys);
                    }
                }
            });
        }
    }

    onStateDataChanges() {
        const data = this.stateChangeData;
        this.stateChangeData = null;
    }

    /**
     * Set App instance
     * @param {Object} app - App instance
     * @returns {AppViewEngine} This instance for chaining
     */
    setApp(app) {
        this.App = app;
        return this;
    }

    setUrlPath(urlPath) {
        this.urlPath = urlPath;
        return this;
    }
    /**
     * Set super view
     * @param {AppViewEngine} superView - Super view instance
     * @returns {AppViewEngine} This instance for chaining
     */
    setSuperView(superView) {
        this.superView = superView;
        return this;
    }

    /**
     * Set parent view
     * @param {AppViewEngine} parent - Parent view instance
     * @returns {AppViewEngine} This instance for chaining
     */
    setParent(parent) {
        this.parent = parent;
        return this;
    }


    setOriginalView(originalView) {
        this.originalView = originalView;
        this.originalViewPath = originalView.path;
        this.originalViewId = originalView.id;
        return this;
    }

    /**
     * Add child view
     * @param {ViewEngine} child - Child view to add
     * @param {Object} data - Data to add to the child view
     * @returns {ViewEngine} This instance for chaining
     */
    addChild(child, data = {}) {
        let index = this.children.length;
        let scope = {
            name: child.path,
            id: child.id,
            index,
            view: child,
            data,
            subscribe: [],
        }
        child.setScope(scope);
        this.children.push(scope);
        return this;
    }


    /**
     * Remove child view
     * @param {AppViewEngine} child - Child view to remove
     * @returns {AppViewEngine} This instance for chaining
     */
    removeChild(child) {
        this.children = this.children.filter(c => c !== child);
        return this;
    }

    /**
     * Update data
     * @param {Object} __data - New data to merge
     * @returns {AppViewEngine} This instance for chaining
     */
    updateData(__data = {}) {
        this.data = { ...this.data, ...__data };
        // this.states.__reset();

        return this;
    }

    updateVariableData(data = {}) {
        if (typeof this.config.updateVariableData === 'function') {
            this.config.updateVariableData.call(this, data);
            this.isCommitedConstructorData = true;
        }

        return this;
    }

    updateVariableItem(key, value) {
        if (typeof this.config.updateVariableItemData === 'function') {
            this.config.updateVariableItemData.call(this, key, value);
        }
        return this;
    }

    /**
     * Set isSuperView flag
     * @param {boolean} isSuperView - Super view flag
     * @returns {AppViewEngine} This instance for chaining
     */
    setIsSuperView(isSuperView) {
        this.isSuperView = isSuperView;
        return this;
    }

    /** Events */


    /**
     * Reset view engine
     */
    reset() {
        // Implementation placeholder
    }

}