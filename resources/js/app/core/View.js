import { SEOTagConfig } from './SEOConfig.js';
import { ViewTemplates } from './ViewTemplate.js';
import { hasData, uniqId } from '../helpers/utils.js';
import { ViewEngine } from './ViewEngine.js';
import { ViewState } from './ViewState.js';
import { ATTR } from './ViewConfig.js';
import logger from './services/LoggerService.js';
import { OneMarkup } from './OneMarkup.js';
import { StorageService } from './services/StorageService.js';
import OneDOM from './OneDOM.js';


class SSRViewData {
    constructor(viewData) {
        const { instances, indexMap } = this.parseViewData(viewData);
        this.instances = instances;
        this.indexMap = indexMap;
        this.index = 0;
        this.maxIndex = indexMap.length - 1;
    }
    parseViewData(viewData) {
        let instances = viewData.instances || {};
        const instancesMap = new Map();
        const keys = Object.keys(instances);
        keys.forEach(key => {
            instancesMap.set(key, instances[key]);
        });
        const indexMap = keys;
        return {
            instances: instancesMap,
            indexMap: indexMap,
        };
    }
    get(index = null) {
        if (index === null) {
            index = this.index;
        }
        this.index = index;
        return this.instances.get(this.indexMap[index]) ?? null;
    }
    next() {
        this.index++;
        return this.get(this.index);
    }
    prev() {
        this.index--;
        return this.get(this.index);
    }
    getById(id) {
        return this.instances.get(id) ?? null;
    }
    scan() {
        let index = this.index;
        this.index++;
        let instance = this.get(index);
        if (!instance) {
            this.index--;
            return null;
        }
        return instance;
    }
}

class SSRViewDataCollection {
    constructor(views) {
        /**
         * @type {Object<string, SSRViewData>}
         */
        this.views = new Map();
        this.setViews(views);
    }
    setViews(views) {
        if (typeof views !== 'object' || !views || Object.keys(views).length === 0) {
            return;
        }
        Object.keys(views).forEach(name => {
            this.views.set(name, new SSRViewData(views[name]));
        });
    }
    get(name) {
        return this.views.get(name) ?? null;
    }
    scan(name) {
        return this.get(name)?.scan() ?? null;
    }
    getInstance(name, id) {
        return this.get(name)?.getById(id) ?? null;
    }
}

export class View {
    constructor(App = null) {
        /**
         * @type {Application}
         */
        this.App = App;

        this.markupService = OneMarkup;
        /**
         * @type {StorageService}
         */
        this.storageService = StorageService.getInstance('onejs_view_data');
        /**
         * @type {HTMLElement}
         */
        this.container = null;
        /**
         * @type {Object<string, function>}
         */
        this.stateChangeListeners = {};
        /**
         * @type {ViewEngine}
         */
        this.currentMasterView = null;
        /**
         * @type {ViewEngine}
         */
        this.Engine = ViewEngine;
        /**
         * @type {ViewState}
         */
        this.State = ViewState;
        /**
         * @type {Object<string, ViewEngine>}
         */
        this.templates = ViewTemplates;
        /**
         * @type {Object<string, string>}
         */
        this._sections = {};
        /**
         * @type {Array<string>}
         */
        this._changedSections = [];
        /**
         * @type {Object<string, Array<string>>}
         */
        this._stacks = {};

        /**
         * @type {boolean}
         */
        this.scanMode = false;
        /**
         * @type {Object<string, boolean>}
         */
        this._once = {};
        /**
         * @type {HTMLElement}
         */
        this.vitualContainer = document.createElement('div');
        this.vitualContainer.setAttribute('id', 'data-vitual-container');
        this.vitualContainer.style.display = 'none';
        /**
         * @type {Array<ViewEngine>}
         */
        this.VIEW_MOUNTED_QUEUE = [];
        /**
         * @type {ViewEngine}
         */
        this.CURRENT_SUPER_VIEW = null;

        this.CURRENT_SUPER_VIEW_PATH = null;
        /**
         * @type {boolean}
         */
        this.CURRENT_SUPER_VIEW_MOUNTED = false;
        /**
         * @type {ViewEngine}
         */
        this.CURRENT_VIEW = null;

        this.CURRENT_VIEW_PATH = null;
        /**
         * @type {boolean}
         */
        this.CURRENT_VIEW_MOUNTED = false;

        /**
         * @type {Array<ViewEngine>}
         */
        this.SUPER_VIEW_STACK = [];
        /**
         * @type {Array<ViewEngine>}
         */
        this.ALL_VIEW_STACK = [];
        /**
         * @type {ViewEngine}
         */
        this.PAGE_VIEW = null;
        /**
         * @type {number}
         */
        this.renderTimes = -1;

        /**
         * @type {Object<string, ViewEngine>}
         */
        this.cachedViews = {};
        /**
         * @type {Object<string, any>}
         */
        this.serverRenderData = {};
        /**
         * @type {Map<string, ViewEngine>}
         */
        this.viewMap = new Map();

        /**
         * @type {Map<string, Object<string, any>>}
         */
        this.cachedPageData = new Map();

        // document.body.appendChild(this.vitualContainer);
        /**
         * @type {Object<string, any>}
         */
        this.wrapperConfig = {

        };

        this.listeners = {};

        this.ssrData = {};
        this.ssrViewManager = new SSRViewDataCollection();

        /**
         * @type {Map<string, ViewEngine>}
         */
        this.cachedPageView = new Map();

        this.cachedTimes = 600; // mặc định cache 10 phút


        /**
         * @type {Object<string, any>}
         */
        this.SEO = {
            tags: SEOTagConfig,
            updateItem: function (key, value) {
                const items = this.tags[key];
                if (!items || items.length == 0) return false;
                items.forEach(item => {
                    let element = document.querySelector(item.selector);
                    if (!element) {
                        element = document.createElement(item.tag);
                        if (item.attrs) {
                            Object.entries(item.attrs).forEach(([key, value]) => {
                                element.setAttribute(key, value);
                            });
                        }
                        document.head.appendChild(element);
                    };

                    if (item.attribute) {
                        if (item.attribute == "@content") {
                            element.textContent = value;
                        } else {
                            element.setAttribute(item.attribute, value);
                        }
                    }
                });
                return true;
            }
        };





    }

    setApp(app) {
        this.App = app;
    }
    setContainer(container) {
        this.container = container;
    }

    /**
     * Initialize SPA
     */
    init(data = {}) {
        // console.log('App.View initialized', data);

        // Clear sections and stacks on page load
        this._sections = {};
        this._stacks = {};
        this._once = {};
        this._changedSections = [];

        // Initialize views if not already done
        if (!this.templates) {
            this.templates = ViewTemplates;
        }

        // Initialize current scope
        this._currentScope = 'web';

        this.ssrData = data?.ssrData || {};
        this.ssrViewManager.setViews(this.ssrData);
    }

    /**
     * Get view by name
     * @param {string} name - View name
     * @returns {ViewEngine|null} View object or null if not found
     */
    getView(name) {
        return this.templates[name] || null;
    }


    /**
     * Load and render view with master view handling
     * @param {string} name - View name
     * @param {Object} data - Data to pass to view
     * @param {string} urlPath - URL path for the view
     * @returns {Object<html: string, error: string, superView: ViewEngine, isSuperView: boolean, needInsert: boolean, ultraView: ViewEngine>} Final rendered HTML string
     */
    loadView(name, data = {}, urlPath = '') {
        // console.log('🔍 App.View.loadView called with:', name, data);
        if (this.templates[name]) {
            this.clearOldRendering();
        }
        this.renderTimes++;
        let message = null;
        this.CURRENT_SUPER_VIEW_MOUNTED = false;

        try {
            let hasCache = false;
            if (this.cachedTimes > 0) {
                let cacheKey = name.replace('.', '_') + '_' + urlPath?.replace(/\//g, '_');
                const cachedData = this.storageService.get(cacheKey);
                if (cachedData) {
                    data = { ...data, ...cachedData };
                    hasCache = true;
                }
            }
            // Get view from templates
            let view = this.view(name, hasCache ? { ...data } : null);
            // console.log('✅ View loaded:', view);
            if (!view) {
                message = `App.View.loadView: View '${name}' not found`;
                return {
                    error: `App.View.loadView: View '${name}' not found`,
                    html: null,
                    superView: null,
                    isSuperView: false,
                    needInsert: false,
                };
            }
            if (urlPath) {
                view.urlPath = urlPath;
            }
            if (this.cachedTimes > 0) {
                if (this.PAGE_VIEW instanceof ViewEngine) {
                    const oldCacheData = this.PAGE_VIEW.data;
                    let cacheKey = this.PAGE_VIEW.path.replace('.', '_') + '_' + this.PAGE_VIEW.urlPath?.replace(/\//g, '_');
                    this.storageService.set(cacheKey, oldCacheData, 3600); // cache trong 1 giờ
                }
            }

            // Store view in array for tracking

            let superView = null;
            let superViewPath = null;
            let result;
            let currentViewPath = view.path;
            let currentView = view;
            let ultraView = view;
            let renderIndex = 0;
            // vòng lặp để render view cho đến khi không có super view hoặc không có super view thì render view
            do {
                try {
                    // console.log('🔍 App.View.loadView in do while view:' + view.path);
                    // kiểm tra view có super view không
                    if (view.hasSuperView) {
                        this.ALL_VIEW_STACK.unshift(view);
                        // console.log('🔍 App.View.loadView has super view:', view.superViewPath);
                        superViewPath = view.superViewPath;
                        result = this.renderView(view);
                        view = result;
                        view.setIsSuperView(true);
                        if (view && typeof view === 'object') {
                            superView = view;
                            ultraView = view;
                        }
                        // console.log('🔍 App.View.loadView super view:', view);
                    }
                    // kiểm tra view có phải là super view không
                    else if (view.isSuperView) {
                        if (superViewPath !== view.path) {
                            this.SUPER_VIEW_STACK.unshift(view);
                            superViewPath = view.path;
                        }
                        // superViewPath = view.path;
                        superView = view;
                        // console.log('🔍 App.View.loadView is super view:', view.path);
                        if (view.hasSuperView) {
                            result = this.renderView(view, renderIndex > 0 ? view.data : null);
                            view = result;
                            view.setIsSuperView(true);
                            if (view && typeof view === 'object') {
                                superView = view;
                                superViewPath = view.path;
                                ultraView = view;
                            }
                        } else {
                            result = '';// nếu là super view thì không cần thêm vào queue và không render. để bước sau xử lý
                        }
                    }
                    // nếu không có super view và không phải là super view thì render view
                    else {

                        this.ALL_VIEW_STACK.unshift(view);
                        // this.PAGE_VIEW = view;
                        // console.log('🔍 App.View.loadView normal view:', view.path);
                        result = this.renderView(view, renderIndex > 0 ? view.data : null);
                        ultraView = view;
                    }
                } catch (error) {
                    message = `App.View.loadView: Error rendering view '${name}':` + error.message;
                    console.error('🔍 App.View.loadView error:', error);
                    return '';
                }
                renderIndex++;
            } while (result && typeof result === 'object' && result instanceof ViewEngine)
            // Update #spa-root with the final string
            // console.log("view after check", { currentViewPath, superViewPath })
            try {
                let html = result;
                // diểu kiễn có cần insert content vào html không
                const needInsert = !(superViewPath && superViewPath === this.CURRENT_SUPER_VIEW_PATH);
                if (superViewPath) {
                    // kiểm tra view có phải là super view không
                    if (!needInsert) { // nếu không cần insert content vào html thì set trang thái super view mounted = true
                        // console.log('🔍 App.View.loadView need insert super view:', superViewPath);
                        this.CURRENT_SUPER_VIEW_MOUNTED = true;
                    } else { // nếu cần insert content vào html thì set trang thái super view mounted = false và render super view
                        this.CURRENT_SUPER_VIEW_PATH = superViewPath;
                        this.CURRENT_SUPER_VIEW = superView;
                        // this.CURRENT_SUPER_VIEW_MOUNTED = false;
                        html = superView.render();
                        // console.log('🔍 App.View.loadView render super view:', html);


                    }
                }
                // console.log('🔍 App.View.loadView need insert:', needInsert);
                // console.log('🔍 App.View.loadView return in try');
                return {
                    html: html,
                    isSuperView: superViewPath ? true : false,
                    needInsert: needInsert,
                    superView: superView,
                    ultraView: ultraView,
                    error: null
                };

            } catch (error) {
                message = 'App.View.loadView: Error updating DOM:', error;

            }

            // console.log(`🎉 App.View.loadView: Successfully loaded view '${name}'`);

        } catch (error) {
            message = `App.View.loadView: Critical error loading view '${name}':`, error;

        }
        return {
            html: null,
            needInsert: false,
            superView: null,
            ultraView: null,
            isSuperView: false,
            error: message
        };
    }


    scanView(name, route = null) {
        if (this.templates[name]) {
            this.clearOldRendering();
        }
        this.renderTimes++;
        let message = null;
        this.CURRENT_SUPER_VIEW_MOUNTED = false;
        try {
            const viewData = this.ssrViewManager.scan(name);
            if (!viewData) {
                message = `App.View.scanView: View '${name}' not found`;
                return {
                    error: `App.View.scanView: View '${name}' not found`,
                    html: null,
                    superView: null,
                    isSuperView: false,
                    needInsert: false,
                };
            }
            const data = viewData.data;
            data.__SSR_VIEW_ID__ = viewData.viewId;
            // console.log('🔍 App.View.scanView called with:', name, data);

            // Get view from templates
            let view = this.view(name, data);
            if (!view) {
                message = `App.View.loadView: View '${name}' not found`;
                return {
                    error: `App.View.loadView: View '${name}' not found`,
                    html: null,
                    superView: null,
                    isSuperView: false,
                    needInsert: false,
                };
            }
            if (route && route.$urlPath) {
                view.urlPath = route.$urlPath;
            }


            // Store view in array for tracking
            let superView = null;
            let superViewPath = null;
            let result;
            let currentViewPath = view.path;
            let currentView = view;
            let ultraView = view;
            this.PAGE_VIEW = view;
            view.__scan(viewData);
            // vòng lặp để render view cho đến khi không có super view hoặc không có super view thì render view
            let renderIndex = 0;
            do {
                try {

                    // kiểm tra view có super view không
                    if (view.hasSuperView) {

                        this.ALL_VIEW_STACK.unshift(view);
                        superViewPath = view.superViewPath;
                        result = this.scanRenderedView(view);
                        view = result;
                        view.setIsSuperView(true);
                        if (view && typeof view === 'object') {
                            superView = view;
                            ultraView = view;
                            if (!view.isScanned) {

                                // ============================================================
                                // CRITICAL FIX: Scan super view DOM + attach events
                                // ============================================================
                                // Get super view SSR data and scan it
                                const superViewData = this.ssrViewManager.scan(superViewPath);
                                if (superViewData) {
                                    // logger.log(`🔍 View.scanView: Scanning super view ${superViewPath}`);
                                    superView.__scan(superViewData);
                                    // logger.log(`✅ View.scanView: Super view ${superViewPath} scanned`);
                                } else {
                                    // logger.warn(`⚠️ View.scanView: No SSR data for super view ${superViewPath}`);
                                }
                            }
                        }
                        // console.log('🔍 App.View.scanView super view:', view);
                    }
                    // kiểm tra view có phải là super view không
                    else if (view.isSuperView) {
                        if (superViewPath !== view.path) {
                            this.SUPER_VIEW_STACK.unshift(view);
                            superViewPath = view.path;
                            ultraView = view;
                        }

                        superView = view;
                        ultraView = view;
                        // console.log('🔍 App.View.scanView is super view:', view.path);
                        if (view.hasSuperView) {
                            result = this.scanRenderedView(view);
                            view = result;
                            view.setIsSuperView(true);
                            if (view && typeof view === 'object') {
                                superView = view;
                                superViewPath = view.path;
                                ultraView = view;
                                if (!view.isScanned) {
                                    // ============================================================
                                    // CRITICAL FIX: Scan nested super view
                                    // ============================================================
                                    const nestedSuperViewData = this.ssrViewManager.scan(superViewPath);
                                    if (nestedSuperViewData) {
                                        // logger.log(`🔍 View.scanView: Scanning nested super view ${superViewPath}`);
                                        superView.__scan(nestedSuperViewData);
                                        // logger.log(`✅ View.scanView: Nested super view ${superViewPath} scanned`);
                                    }
                                }
                            }
                        } else {
                            result = '';// nếu là super view thì không cần thêm vào queue và không render. để bước sau xử lý
                        }
                    }
                    // nếu không có super view và không phải là super view thì render view
                    else {
                        this.ALL_VIEW_STACK.unshift(view);
                        this.PAGE_VIEW = view;
                        // console.log('🔍 App.View.scanView normal view:', view.path);
                        result = this.scanRenderedView(view);
                        ultraView = view;
                    }
                } catch (error) {
                    message = `App.View.scanView: Error rendering view '${name}':`, error;
                    console.error('🔍 App.View.scanView error:', error);
                    return '';
                }
                renderIndex++;
            } while (result && typeof result === 'object' && result.constructor === this.Engine)
            // Update #spa-root with the final string
            // console.log("view after check", { currentViewPath, superViewPath })
            try {
                let html = result;
                // diểu kiễn có cần insert content vào html không
                const needInsert = !(superViewPath && superViewPath === this.CURRENT_SUPER_VIEW_PATH);
                if (superViewPath) {
                    // kiểm tra view có phải là super view không
                    if (!needInsert) { // nếu không cần insert content vào html thì set trang thái super view mounted = true
                        console.log('🔍 App.View.scanView need insert super view:', superViewPath);
                        this.CURRENT_SUPER_VIEW_MOUNTED = true;
                    } else { // nếu cần insert content vào html thì set trang thái super view mounted = false và render super view
                        this.CURRENT_SUPER_VIEW_PATH = superViewPath;
                        this.CURRENT_SUPER_VIEW = superView;
                        this.CURRENT_SUPER_VIEW_MOUNTED = false;
                        html = superView.virtualRender();
                        console.log('🔍 App.View.scanView render super view:', html);


                    }
                }

                // ============================================================
                // LIFECYCLE: Mount all views in bottom-up order
                // ============================================================
                // After scanning and virtual render complete, mount all views
                // in reverse order (deepest layout → page view)
                this.mountAllViewsFromStack(this.renderTimes).then(() => {
                    logger.log('✅ View.scanView: All views mounted successfully in bottom-up order');
                }).catch(error => {
                    logger.error('❌ View.scanView: Error mounting views:', error);
                });

                return {
                    html: html,
                    isSuperView: superViewPath ? true : false,
                    needInsert: needInsert,
                    superView: superView,
                    ultraView: ultraView,
                    error: null
                };

            } catch (error) {
                message = 'App.View.scanView: Error updating DOM:' + error.message;

            }

            // console.log(`🎉 App.View.scanView: Successfully loaded view '${name}'`);

        } catch (error) {
            message = `App.View.scanView: Critical error loading view '${name}':` + error.message;

        }
        return {
            html: null,
            needInsert: false,
            superView: null,
            isSuperView: false,
            ultraView: null,
            error: message
        };
    }

    mountView(viewName, params = {}, route = null) {
        try {
            let currentSuperView = this.CURRENT_SUPER_VIEW;
            if (currentSuperView && currentSuperView instanceof ViewEngine) {
                currentSuperView.unmounted();
            }
            const viewResult = this.loadView(viewName, params, route?.$urlPath || '');
            if (viewResult.error) {
                console.error('View rendering error:', viewResult.error);
                return;
            }
            console.log('View rendered successfully:', viewResult);

            if (viewResult.needInsert && viewResult.html) {
                const container = this.container || document.querySelector('#app-root') || document.querySelector('#app') || document.body;
                const html = viewResult.html
                if (container) {
                    OneDOM.setHTML(container, html);
                }
            } else {
                console.log('Router: Not updating DOM - needInsert:', viewResult.needInsert, 'html:', !!viewResult.html);
            }

            // Emit changed sections
            if (this.emitChangedSections) {
                this.emitChangedSections();
            }

            if (viewResult.ultraView && viewResult.ultraView instanceof ViewEngine) {
                viewResult.ultraView.mounted();
            }
            this.CURRENT_SUPER_VIEW_MOUNTED = true; // set trang thái super view mounted = true


        } catch (error) {
            console.error('Error rendering view:', error);
        }
    }

    mountViewScan(viewName, params = {}, route = null) {

        // ============================================================
        // CORE HYDRATION: Scan SSR HTML and attach JS behavior
        // ============================================================
        // scanView() will:
        // 1. Parse SSR data from HTML comments
        // 2. Create view instances (page + layouts)
        // 3. Call virtualRender() to setup relationships
        // 4. Scan DOM and attach event handlers
        // 5. Setup state subscriptions
        // 6. Mount all views in bottom-up order (deepest layout → page)
        const scanResult = this.scanView(viewName);
        // console.log(scanResult);
        if (scanResult.error) {
            console.error('❌ Router.hydrateViews: Scan error:', scanResult.error);
            return;
        }

        if (scanResult.ultraView && scanResult.ultraView instanceof ViewEngine) {
            scanResult.ultraView.mounted();
        }
        this.CURRENT_SUPER_VIEW_MOUNTED = true; // set trang thái super view mounted = true
        this._isHydrated = true;
    }


    mountContent(htmlContent) {
        const container = this.container || document.querySelector('#app-root') || document.querySelector('#app') || document.body;
        if (container) {
            OneDOM.setHTML(container, htmlContent);
        }
    }


    // ============================================================================
    // EVENT FUNCTIONS
    // ============================================================================


    on(event, callback) {
        if (typeof event !== 'string' || event === '') {
            return false;
        }
        if (typeof callback !== 'function') {
            return false;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (typeof event !== 'string' || event === '') {
            return false;
        }
        if (typeof callback !== 'function') {
            return false;
        }
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    emit(event, ...args) {
        if (typeof event !== 'string' || event === '') {
            return false;
        }
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(callback => callback(...args));
    }
    // ============================================================================
    // CORE FUNCTIONS
    // ============================================================================

    /**
     * Generate unique view ID
     * @returns {string} UUID v4
     */
    generateViewId() {
        return uniqId();
    }

    /**
     * Execute function and return result
     * @param {Function} fn - Function to execute
     * @returns {string} Result as string
     */
    execute(fn, defaultValue = '') {
        try {
            const result = fn();
            return result !== undefined ? result : defaultValue;
        } catch (error) {
            logger.error('App.execute error:', error);
            return defaultValue;
        }
    }

    evaluate(fn, defaultValue = '') {
        try {
            const result = fn();
            return result !== undefined ? result : defaultValue;
        } catch (error) {
            logger.error('App.evaluate error:', error);
            return defaultValue;
        }
    }
    /**
     * Escape string for HTML output
     * @param {*} value - Value to escape
     * @returns {string} Escaped string
     */
    escString(value) {
        if (value === null || value === undefined) {
            return '';
        }

        const str = String(value);
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Get text content (for preloader messages)
     * @param {string} key - Text key
     * @returns {string} Text content
     */
    text(key) {
        const texts = {
            'loading': 'Loading...',
            'error': 'Error occurred',
            'not_found': 'Not found',
            'unauthorized': 'Unauthorized'
        };

        return texts[key] || key;
    }


    // ============================================================================
    // INIT FUNCTIONS
    // ============================================================================
    setSuperViewPath(superView) {
        this.CURRENT_SUPER_VIEW_PATH = superView;
    }
    addViewEngine(renderTimes, viewEngine) {
        if (typeof this.VIEW_MOUNTED_QUEUE[renderTimes] === 'undefined') {
            this.VIEW_MOUNTED_QUEUE[renderTimes] = [];
        }
        this.VIEW_MOUNTED_QUEUE[renderTimes].push(viewEngine);
    }
    /**
     * Gọi hàm mounted của ViewEngine
     * @param {number} renderTimes - Số lần render hiện tại (dùng làm key cho queue).
     * @param {string} viewEngineId - ID của ViewEngine cần gọi hàm mounted.
     */
    callViewEngineMounted(renderTimes, viewEngineId) {
        return;
    }

    /**
     * Mount all views in bottom-up order (last → first)
     * This ensures parent views mount after their children
     *
     * Flow:
     * 1. Layout View 2 (deepest) mounted first
     * 2. Layout View 1 mounted
     * 3. Included views mounted
     * 4. First View (page view) mounted last
     *
     * @param {number} renderTimes - Số lần render hiện tại
     * @returns {Promise<void>}
     */
    async mountAllViewsBottomUp(renderTimes) {
        // logger.log(`🔄 View.mountAllViewsBottomUp: Starting bottom-up mounting for renderTimes=${renderTimes}`);

        // Check if queue exists and has views
        if (!this.VIEW_MOUNTED_QUEUE[renderTimes] || !this.VIEW_MOUNTED_QUEUE[renderTimes].length) {
            logger.warn(`⚠️ View.mountAllViewsBottomUp: No views in queue for renderTimes=${renderTimes}`);
            return;
        }

        // Wait for super view to be ready
        if (!this.CURRENT_SUPER_VIEW_MOUNTED) {
            logger.log(`⏳ View.mountAllViewsBottomUp: Waiting for super view to be mounted...`);
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (this.CURRENT_SUPER_VIEW_MOUNTED) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50); // Check every 50ms (faster than 100ms)
            });
        }

        // Get queue for this render
        const queue = this.VIEW_MOUNTED_QUEUE[renderTimes];
        logger.log(`📋 View.mountAllViewsBottomUp: Processing ${queue.length} views`);

        // Mount in reverse order (bottom-up: last → first)
        // This ensures deepest layouts mount first, then parent views
        for (let i = queue.length - 1; i >= 0; i--) {
            const viewEngine = queue[i];

            try {
                // logger.log(`🎯 View.mountAllViewsBottomUp: Mounting view ${i + 1}/${queue.length} - ${viewEngine.path} (${viewEngine.id})`);

                // Call beforeMount lifecycle
                if (typeof viewEngine.beforeMount === 'function') {
                    viewEngine.beforeMount();
                }

                // Call mounted lifecycle
                if (typeof viewEngine.mounted === 'function') {
                    viewEngine.mounted();
                }

                logger.log(`✅ View.mountAllViewsBottomUp: Successfully mounted ${viewEngine.path}`);
            } catch (error) {
                logger.error(`❌ View.mountAllViewsBottomUp: Error mounting ${viewEngine.path}:`, error);
                // Continue mounting other views even if one fails
            }
        }

        // Clear the queue after mounting all views
        this.VIEW_MOUNTED_QUEUE[renderTimes] = [];
        // logger.log(`✅ View.mountAllViewsBottomUp: All views mounted successfully, queue cleared`);
    }

    /**
     * Mount all views using stack-based order
     * Uses ALL_VIEW_STACK which is built during scanView
     * Order: super views first (bottom), then included views, then page view (top)
     *
     * @param {number} renderTimes - Số lần render hiện tại
     * @returns {Promise<void>}
     */
    async mountAllViewsFromStack(renderTimes) {
        // logger.log(`🔄 View.mountAllViewsFromStack: Starting stack-based mounting`);

        // Check if we have views in queue
        if (!this.VIEW_MOUNTED_QUEUE[renderTimes] || !this.VIEW_MOUNTED_QUEUE[renderTimes].length) {
            logger.warn(`⚠️ View.mountAllViewsFromStack: No views in queue`);
            return;
        }

        // Wait for super view to be ready
        if (!this.CURRENT_SUPER_VIEW_MOUNTED) {
            logger.log(`⏳ View.mountAllViewsFromStack: Waiting for super view...`);
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (this.CURRENT_SUPER_VIEW_MOUNTED) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
            });
        }

        // If we have a stack (from scanView), use it for ordering
        if (this.ALL_VIEW_STACK && this.ALL_VIEW_STACK.length > 0) {
            // logger.log(`📚 View.mountAllViewsFromStack: Using ALL_VIEW_STACK (${this.ALL_VIEW_STACK.length} views)`);

            // Mount super views first (they're at the beginning of stack)
            const superViews = this.SUPER_VIEW_STACK || [];
            for (let i = superViews.length - 1; i >= 0; i--) {
                const viewEngine = superViews[i];
                try {
                    // logger.log(`🏛️ View.mountAllViewsFromStack: Mounting super view ${viewEngine.path}`);
                    if (typeof viewEngine.beforeMount === 'function') {
                        viewEngine.beforeMount();
                    }
                    if (typeof viewEngine.mounted === 'function') {
                        viewEngine.mounted();
                    }
                    // logger.log(`✅ Mounted super view: ${viewEngine.path}`);
                } catch (error) {
                    logger.error(`❌ Error mounting super view ${viewEngine.path}:`, error);
                }
            }

            // Then mount page view and its includes (from ALL_VIEW_STACK)
            for (let i = this.ALL_VIEW_STACK.length - 1; i >= 0; i--) {
                const viewEngine = this.ALL_VIEW_STACK[i];

                // Skip if already mounted as super view
                if (superViews.includes(viewEngine)) {
                    continue;
                }

                try {
                    // logger.log(`📄 View.mountAllViewsFromStack: Mounting view ${viewEngine.path}`);
                    if (typeof viewEngine.beforeMount === 'function') {
                        viewEngine.beforeMount();
                    }
                    if (typeof viewEngine.mounted === 'function') {
                        viewEngine.mounted();
                    }
                    // logger.log(`✅ Mounted view: ${viewEngine.path}`);
                } catch (error) {
                    logger.error(`❌ Error mounting view ${viewEngine.path}:`, error);
                }
            }

            // Clear stacks
            this.ALL_VIEW_STACK = [];
            this.SUPER_VIEW_STACK = [];
            // logger.log(`✅ View.mountAllViewsFromStack: Stack-based mounting complete`);
        } else {
            // Fallback to bottom-up queue mounting
            // logger.log(`⚠️ View.mountAllViewsFromStack: No stack available, falling back to queue mounting`);
            await this.mountAllViewsBottomUp(renderTimes);
        }

        // Clear the queue
        this.VIEW_MOUNTED_QUEUE[renderTimes] = [];
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    templateToDom(template) {
        /**
         * @type {HTMLTemplateElement}
         */
        const templator = document.createElement('template');
        templator.innerHTML = template;
        return templator.content.firstChild;
    }



    /**
     * Include a view
     * @param {string} viewName - Name of the view to include
     * @param {Object} data - Data to pass to the view
     * @returns {string} Rendered view content
     */
    include(viewName, data = {}) {
        try {
            const view = this.view(viewName, { ...data }, false);
            return view;
        } catch (error) {
            console.error(`App.View.include error for '${viewName}':`, error);
            return '';
        }
    }

    /**
     * Include a view if it exists
     * @param {string} viewName - Name of the view to include
     * @param {Object} data - Data to pass to the view
     * @returns {string} Rendered view content or empty string
     */
    includeIf(viewName, data = {}) {
        try {
            return this.exists(viewName) ? this.include(viewName, data) : null;
        } catch (error) {
            console.error(`App.View.includeIf error for '${viewName}':`, error);
            return null;
        }
    }

    /**
     * Extend a view (for @extends directive)
     * @param {string} superViewName - Name of the parent view
     * @param {Object} data - Data to pass to the parent view
     * @returns {App.View.Engine} View Engine
     */
    extendView(superViewName, data = {}) {
        try {
            const view = this.view(superViewName, hasData(data) ? data : null, true);
            if (!view) {
                // console.warn(`App.View.extendView: Parent view '${superViewName}' not found`);
                return null;
            }
            this.cachedViews[superViewName] = view;
            return this.cachedViews[superViewName];

        } catch (error) {
            // console.error(`App.View.extendView error for '${superViewName}':`, error);
            return null;
        }
    }


    registerSubscribe(attr, yieldKey, defaultContent = '') {
        let output = '';
        const subscribeAttr = [];
        if (typeof attr === 'string') {
            output += ` ${attr}="${this.yieldContent(yieldKey, defaultContent)}"`;
            subscribeAttr.push(`${attr}:${yieldKey}`);
        }
        else if (typeof attr === 'object') {
            const keys = Object.keys(attr);
            for (const key of keys) {
                if (key.toLowerCase() === '#content') {
                    output += ` ${ATTR.KEYS.YIELD_CONTENT}="${attr[key]}"`;
                }
                else if (key.toLowerCase() === '#children') {
                    output += ` ${ATTR.KEYS.YIELD_CHILDREN}="${attr[key]}"`;
                }
                else {
                    output += ` ${key}="${this.yieldContent(attr[key], defaultContent)}"`;
                    subscribeAttr.push(`${key}:${attr[key]}`);
                }
            }
        }
        output += ` ${ATTR.KEYS.YIELD_ATTR}="${subscribeAttr.join(',')}"`;
        return output;
    }

    exists(viewName) {
        return this.templates && this.templates[viewName] ? true : false;
    }

    // ========================================================================
    // RENDER/SCAN METHODS - OPTIMIZED
    // ========================================================================

    /**
     * Unified view rendering/scanning method
     *
     * @param {ViewEngine} view - View engine instance
     * @param {Object} variableData - Variable data to pass to the view
     * @param {string} mode - Render mode: 'csr' (render) or 'ssr' (virtualRender)
     * @returns {string|ViewEngine} Rendered content or ViewEngine for extends
     *
     * @description
     * Handles both CSR (Client-Side Rendering) and SSR (Server-Side Scanning):
     * - CSR mode: Calls render(), prerender() for actual HTML generation
     * - SSR mode: Calls virtualRender(), virtualPrerender() for relationship setup
     *
     * Async Data Handling:
     * - @await('client'): Loads data from current URL via getURIDAta()
     * - @fetch(url, data, headers): Loads data using custom fetch config
     *
     * Note: virtualRender/virtualPrerender do NOT generate HTML!
     * They only setup view hierarchy, sections, state subscriptions, and prepare for hydration.
     */
    renderOrScanView(view, variableData = null, mode = 'csr') {
        let result = null;
        const renderTimes = this.renderTimes;


        // Determine render methods based on mode
        // CSR: render() generates HTML
        // SSR: virtualRender() only sets up relationships (NO HTML)
        const renderMethod = mode === 'ssr' ? 'virtualRender' : 'render';
        const prerenderMethod = mode === 'ssr' ? 'virtualPrerender' : 'prerender';

        // ====================================================================
        // CASE 1: No async data - simple render/scan
        // ====================================================================
        if (!(view.hasAwaitData || view.hasFetchData)) {
            if (variableData) {
                view.updateVariableData({ ...variableData });
            }
            result = view[renderMethod]();

            return result;
        }

        // ====================================================================
        // CASE 2: Has async data but no prerender
        // ====================================================================
        const isPrerender = view.hasPrerender;
        if (!isPrerender) {
            if (variableData) {
                view.updateVariableData(variableData);
            }
            result = view[renderMethod]();
        }

        // ====================================================================
        // CASE 3A: Has @await - Load data by current URL
        // ====================================================================
        if (view.hasAwaitData) {
            // First: Show prerender (loading state)
            if (isPrerender) {
                result = view[prerenderMethod]();
            }

            // Handle based on mode
            if (mode === 'csr') {
                // CSR: Load data from current URL then re-render
                this.App.API.getURIDAta().then(data => {

                    view.updateVariableData(data);
                    // Re-render with loaded data
                    view[renderMethod]();

                });
            } else {
                // SSR: Just setup relationships (no data loading needed)
                result = view[renderMethod]();

                if (addToQueue) {
                    this.callViewEngineMounted(renderTimes, view.id);
                }
            }
        }

        // ====================================================================
        // CASE 3B: Has @fetch - Load data by fetch config
        // ====================================================================
        else if (view.hasFetchData) {
            // First: Show prerender (loading state)
            if (isPrerender) {
                result = view[prerenderMethod]();
            }

            // Handle based on mode
            if (mode === 'csr') {
                // CSR: Fetch data using config (url, method, data, headers)
                const fetchConfig = view.fetch || {};
                // TODO: Implement fetch logic with config
                // this.App.API.fetch(fetchConfig).then(data => {
                //     view[renderMethod]();
                //     if (addToQueue) {
                //         this.callViewEngineMounted(renderTimes, view.id);
                //     }
                // });

                // Temporary: Use same as await until fetch is implemented
                this.App.API.getURIDAta().then(data => {
                    view.updateVariableData(data);
                    view[renderMethod]();
                    if (addToQueue) {
                        this.callViewEngineMounted(renderTimes, view.id);
                    }
                });
            } else {
                // SSR: Just setup relationships (no data loading needed)
                result = view[renderMethod]();

                if (addToQueue) {
                    this.callViewEngineMounted(renderTimes, view.id);
                }
            }
        }

        return result;
    }

    /**
     * Render a view (CSR - Client-Side Rendering)
     *
     * Generates actual HTML content by calling:
     * - view.render() - Returns HTML string
     * - view.prerender() - Returns loading state HTML
     *
     * @param {ViewEngine} view - View engine
     * @param {Object} variableData - Variable data to pass to the view
     * @returns {string} Rendered HTML content
     */
    renderView(view, variableData = null) {
        return this.renderOrScanView(view, variableData, 'csr');
    }

    /**
     * Scan rendered view (SSR - Server-Side Scanning)
     *
     * DOES NOT generate HTML - only sets up relationships by calling:
     * - view.virtualRender() - Setup hierarchy, sections, state (NO HTML)
     * - view.virtualPrerender() - Setup loading relationships (NO HTML)
     *
     * Purpose of virtual methods:
     * 1. Setup view hierarchy (extends/includes)
     * 2. Register sections with parent views
     * 3. Setup state subscriptions for reactive blocks
     * 4. Prepare view instances for DOM hydration
     * 5. Map server data to client view structure
     *
     * @param {ViewEngine} view - View engine
     * @param {Object} variableData - Variable data to pass to the view
     * @returns {ViewEngine} ViewEngine instance for extends chain
     */
    scanRenderedView(view, variableData = null) {
        return this.renderOrScanView(view, variableData, 'ssr');
    }

    /**
     * Render a view by name
     * @param {string} name - View name
     * @param {Object} data - Data to pass to view
     * @param {string} scope - View scope
     * @returns {ViewEngine|null} Rendered view content
     */
    view(name, data = null, cache = false) {
        try {
            // check if view is cached
            if (cache && this.cachedViews[name]) {
                const view = this.cachedViews[name];
                view.reset();
                if (data) {
                    view.updateVariableData({ ...data });
                }
                return view;
            }
            // check if view is valid
            if (!this.templates[name]) {
                console.warn(`App.View.view: View '${name}' not found in scope '${scope}'`);
                return null;
            }
            // check if view is valid
            if (typeof this.templates[name] !== 'function') {
                console.warn(`App.View.view: View '${name}' render function is not valid`);
                return null;
            }

            // get view wrapper
            const viewWrapper = this.templates[name];
            // create view
            const view = viewWrapper(data ? { ...data } : {}, { App: this.App, View: this });
            // view.updateVariableData(data);
            // check if view is valid
            if (!view) {
                console.error(`App.View.view: View config not found for '${name}' in scope '${scope}'`);
                return null;
            }

            view.setApp(this.App);
            // cache view
            this.cachedViews[name] = view;
            return view;

        } catch (error) {
            console.error(`App.View.view: Critical error loading view '${name}':`, error);
            return null;
        }
    };


    /**
     * Clear old rendering data and cleanup memory
     * Called before each new render to prevent memory leaks
     *
     * Cleanup tasks:
     * 1. Remove old views from previous render cycles
     * 2. Clear event listeners from unmounted views
     * 3. Cleanup old render queues (keep only last 3 cycles)
     * 4. Trim view cache if too large (LRU eviction)
     */
    clearOldRendering() {
        const currentRenderTime = this.renderTimes;

        // ================================================================
        // 1. Cleanup old render queues (keep only last 3 cycles)
        // ================================================================
        if (currentRenderTime > 3) {
            const oldRenderTime = currentRenderTime - 3;
            if (this.VIEW_MOUNTED_QUEUE[oldRenderTime]) {
                // logger.log(`🗑️ View.clearOldRendering: Cleaning queue for renderTime=${oldRenderTime}`);

                // Unmount views from old queue
                const oldViews = this.VIEW_MOUNTED_QUEUE[oldRenderTime];
                if (Array.isArray(oldViews)) {
                    oldViews.forEach(view => {
                        if (view && typeof view === 'object') {
                            this.unmountView(view);
                        }
                    });
                }

                // Delete old queue
                delete this.VIEW_MOUNTED_QUEUE[oldRenderTime];
            }
        }

        // ================================================================
        // 2. Trim view cache if too large (LRU: max 50 views)
        // ================================================================
        const MAX_CACHED_VIEWS = 50;
        const cachedKeys = Object.keys(this.cachedViews);
        if (cachedKeys.length > MAX_CACHED_VIEWS) {
            // logger.log(`🗑️ View.clearOldRendering: Cache too large (${cachedKeys.length}), trimming to ${MAX_CACHED_VIEWS}`);

            // Remove oldest views (simple strategy: remove first N)
            const toRemove = cachedKeys.slice(0, cachedKeys.length - MAX_CACHED_VIEWS);
            toRemove.forEach(key => {
                const view = this.cachedViews[key];
                if (view) {
                    this.unmountView(view);
                }
                delete this.cachedViews[key];
            });
        }
        this.ALL_VIEW_STACK = [];
        this.SUPER_VIEW_STACK = [];
        this.PAGE_VIEW = null;

        // ================================================================
        // 3. Clear orphaned event data to prevent memory leaks
        // ================================================================
        this.clearOrphanedEventData();
    }



    /**
     * Unmount a view and cleanup its resources
     *
     * @param {ViewEngine} view - View to unmount
     * @returns {boolean} Success status
     *
     * @description
     * Properly cleanup a view by:
     * 1. Call beforeUnmount() lifecycle hook
     * 2. Remove event listeners via removeEvents()
     * 3. Remove from viewMap
     * 4. Call unmounted() lifecycle hook
     * 5. Call destroy() if defined
     */
    unmountView(view) {
        if (!view || typeof view !== 'object') {
            logger.warn('⚠️ View.unmountView: Invalid view object');
            return false;
        }

        try {
            logger.log(`🗑️ View.unmountView: Unmounting view ${view.id} (${view.path})`);

            // Step 1: Call beforeUnmount lifecycle
            if (typeof view.beforeUnmount === 'function') {
                view.beforeUnmount();
            }

            // Step 2: Remove event listeners
            if (typeof view.removeEvents === 'function') {
                view.removeEvents();
            }

            // Step 3: Remove from viewMap
            if (this.viewMap.has(view.id)) {
                this.viewMap.delete(view.id);
            }

            // Step 4: Call unmounted lifecycle
            if (typeof view.unmounted === 'function') {
                view.unmounted();
            }

            // Step 5: Call destroy if defined
            if (typeof view.destroy === 'function') {
                view.destroy();
            }

            logger.log(`✅ View.unmountView: View ${view.id} unmounted successfully`);
            return true;

        } catch (error) {
            logger.error(`❌ View.unmountView: Error unmounting view ${view.id}:`, error);
            return false;
        }
    }

    /**
     * Reset view state
     * Clears view stacks but does NOT unmount views
     * Use clearOldRendering() for proper cleanup
     */
    resetView() {
        logger.log('🔄 View.resetView: Resetting view stacks');
        this.SUPER_VIEW_STACK = [];
        this.ALL_VIEW_STACK = [];
        this.PAGE_VIEW = null;

    }

    /**
     * Clear orphaned event data from all views
     * Call this when DOM changes significantly to prevent memory leaks
     */
    clearOrphanedEventData() {
        logger.log('🗑️ View.clearOrphanedEventData: Cleaning up orphaned event handlers');

        // Clear from all cached views
        Object.values(this.cachedViews).forEach(view => {
            if (view && typeof view.clearOrphanedEventData === 'function') {
                view.clearOrphanedEventData();
            }
        });

        // Clear from current views in stacks
        [...this.ALL_VIEW_STACK, ...this.SUPER_VIEW_STACK].forEach(view => {
            if (view && typeof view.clearOrphanedEventData === 'function') {
                view.clearOrphanedEventData();
            }
        });

        // Clear from current view
        if (this.CURRENT_VIEW && typeof this.CURRENT_VIEW.clearOrphanedEventData === 'function') {
            this.CURRENT_VIEW.clearOrphanedEventData();
        }

        if (this.CURRENT_SUPER_VIEW && typeof this.CURRENT_SUPER_VIEW.clearOrphanedEventData === 'function') {
            this.CURRENT_SUPER_VIEW.clearOrphanedEventData();
        }
    }


    // ============================================================================
    // SECTION FUNCTIONS
    // ============================================================================


    /**
     * Define a section
     * @param {string} name - Section name
     * @param {string} content - Section content
     * @param {string} type - Section type
     */
    section(name, content, type = 'string') {
        let oldContent = this._sections[name];
        this._sections[name] = content;
        if (oldContent !== content) {
            this._changedSections.push(name);
        }
    };

    /**
     * Yield a section content
     * @param {string} name - Section name
     * @param {string} defaultContent - Default content if section not found
     * @returns {string} Section content
     */
    yield(name, defaultContent = '') {
        return this._sections[name] || defaultContent;
    }
    yieldContent(name, defaultContent = '') {
        return this._sections[name] || defaultContent;
    }


    /**
     * Render all sections as HTML
     * @returns {string} Rendered sections HTML
     */
    renderSections() {
        let html = '';
        for (const [name, content] of Object.entries(this._sections)) {
            html += content;
        }
        return html;
    }

    /**
     * Check if section exists
     * @param {string} name - Section name
     * @returns {boolean} True if section exists
     */
    hasSection(name) {
        return name in this._sections;
    }

    /**
     * Get changed sections
     * @returns {string[]} Changed sections
     */
    getChangedSections() {
        return this._changedSections;
    };

    /**
     * Reset changed sections list
     */
    resetChangedSections() {
        this._changedSections = [];
    };

    /**
     * Check if section has changed
     * @param {string} name - Section name
     * @returns {boolean} True if section has changed
     */
    isChangedSection(name) {
        return this._changedSections.includes(name);
    };


    /**
     * Emit changed sections to subscribed elements
     */
    emitChangedSections() {
        this._changedSections.forEach(name => {
            if (this.SEO.updateItem(name, this._sections[name])) {
                return;
            }
            // Escape special characters in CSS selector
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Find elements subscribed to this section
            const subscribedElements = document.querySelectorAll(`[data-yield-subscribe-key*="${escapedName}"]`);

            subscribedElements.forEach(element => {
                const subscribeKey = element.getAttribute('data-yield-subscribe-key');
                const subscribeTarget = element.getAttribute('data-yield-subscribe-target');
                const subscribeAttr = element.getAttribute('data-yield-subscribe-attr');

                if (subscribeKey && subscribeKey.includes(name)) {
                    const sectionContent = this._sections[name] || '';

                    if (subscribeTarget === 'content' || subscribeTarget === 'children') {
                        element.innerHTML = sectionContent;
                    } else if (subscribeTarget === 'attr' || subscribeTarget === 'attribute') {
                        if (subscribeAttr) {
                            element.setAttribute(subscribeAttr, sectionContent);
                        }
                    } else {
                        element.innerHTML = sectionContent;
                    }
                }
            });

            // Find elements with spa-yield-attr containing section name
            const attrElements = document.querySelectorAll('[data-yield-attr]');
            attrElements.forEach(element => {
                const yieldAttr = element.getAttribute('data-yield-attr');

                if (yieldAttr && yieldAttr.includes(name)) {
                    const attrPairs = yieldAttr.split(',');

                    attrPairs.forEach(pair => {
                        let paths = pair.split(':');
                        let attrName = paths.shift();
                        let sectionName = paths.join(':');

                        if (sectionName && sectionName.trim() === name) {
                            const sectionContent = this._sections[name] || '';
                            element.setAttribute(attrName.trim(), sectionContent);
                        }
                    });
                }
            });

            // Find elements with app-yield-{name} attributes
            if (name.split(':').length <= 1) {
                const specialElements = document.querySelectorAll(`[data-yield-${escapedName}]`);
                specialElements.forEach(element => {
                    const sectionContent = this._sections[name] || '';
                    element.innerHTML = sectionContent;
                });

            }

            const contentElements = document.querySelectorAll(`[data-yield-content="${escapedName}"]`);
            contentElements.forEach(element => {
                element.innerHTML = this._sections[name] || '';
            });
            const childrenElements = document.querySelectorAll(`[data-yield-children="${escapedName}"]`);
            childrenElements.forEach(element => {
                element.innerHTML = this._sections[name] || '';
            });
        });

        // Reset changed sections after processing
        this.resetChangedSections();
    };


    loadServerData(data = {}) {

    }



    // ============================================================================
    // STACK FUNCTIONS
    // ============================================================================

    // Initialize stacks storage


    /**
     * Push content to a stack
     * @param {string} name - Stack name
     * @param {string} content - Content to push
     */
    push(name, content) {
        if (!this._stacks[name]) {
            this._stacks[name] = [];
        }
        this._stacks[name].push(content);
    };

    /**
     * Get stack content
     * @param {string} name - Stack name
     * @returns {string} Stack content
     */
    stack(name) {
        return this._stacks[name] ? this._stacks[name].join('') : '';
    };

    // ============================================================================
    // ONCE FUNCTIONS
    // ============================================================================

    // Initialize once storage

    /**
     * Execute content only once
     * @param {string} content - Content to execute once
     * @returns {string} Content if not executed before, empty string otherwise
     */
    once(content) {
        const hash = this._hashContent(content);
        if (!this._once[hash]) {
            this._once[hash] = true;
            return content;
        }
        return '';
    };

    /**
     * Hash content for once tracking
     * @param {string} content - Content to hash
     * @returns {string} Hash string
     */
    _hashContent(content) {
        let hash = 0;
        if (content.length === 0) return hash.toString();

        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return hash.toString();
    };

    // ============================================================================
    // AUTH FUNCTIONS
    // ============================================================================

    /**
     * Check if user is authenticated
     * @param {string} guard - Guard name (optional)
     * @returns {boolean} True if authenticated
     */
    isAuth(guard = null) {
        // This should be implemented based on your auth system
        // For now, return false as placeholder
        return false;
    };

    /**
     * Check if user has permission
     * @param {string} permission - Permission name
     * @param {*} model - Model instance (optional)
     * @returns {boolean} True if user has permission
     */
    can(permission, model = null) {
        // This should be implemented based on your permission system
        // For now, return false as placeholder
        return false;
    };

    // ============================================================================
    // ERROR FUNCTIONS
    // ============================================================================

    /**
     * Check if field has error
     * @param {string} field - Field name
     * @returns {boolean} True if field has error
     */
    hasError(field) {
        // This should be implemented based on your error handling system
        // For now, return false as placeholder
        return false;
    };

    /**
     * Get first error for field
     * @param {string} field - Field name
     * @returns {string} Error message
     */
    firstError(field) {
        // This should be implemented based on your error handling system
        // For now, return empty string as placeholder
        return '';
    };

    // ============================================================================
    // CSRF FUNCTIONS
    // ============================================================================

    /**
     * Get CSRF token
     * @returns {string} CSRF token
     */
    csrfToken() {
        // This should be implemented based on your CSRF system
        // For now, return empty string as placeholder
        return '';
    };

    // ============================================================================
    // LOOP FUNCTIONS
    // ============================================================================

    /**
     * Foreach loop helper
     * @param {Array|Object} items - Items to iterate
     * @param {Function} callback - Callback function
     * @returns {string} Rendered content
     */
    foreach(items, callback) {
        if (!items) return '';

        let result = '';

        if (Array.isArray(items)) {
            items.forEach((item, index) => {
                result += callback(item, index);
            });
        } else if (typeof items === 'object') {
            Object.entries(items).forEach(([key, value]) => {
                result += callback(value, key);
            });
        }

        return result;
    };


    /**
  * Get route URL
  * @param {string} name - Route name
  * @param {object} params - Route parameters
  * @returns {string} Route URL
  */
    route(name, params = {}) {
        return this.App.Router.getURL(name, params);
    }

}
