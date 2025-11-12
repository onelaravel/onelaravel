export function WebAbout($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'web.about';
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

    self.setup('web.about', {
        superView: 'layouts.base',
        hasSuperView: true,
        viewType: 'view',
        sections: {
        "meta:title":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:description":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "meta:keywords":{
            "type":"short",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "content":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        },
        "styles":{
            "type":"long",
            "preloader":false,
            "useVars":false,
            "script":{}
        }
    },
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
        hasSections: true,
        hasSectionPreload: false,
        hasPrerender: false,
        renderLongSections: ["content","styles"],
        renderSections: ["meta:title","meta:description","meta:keywords","content","styles"],
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

${this.__section('meta:title', 'About One Laravel - Advanced SPA Framework', 'string')}
${this.__section('meta:description', 'Learn about One Laravel, the innovative framework that bridges Laravel backend with modern SPA frontend capabilities.', 'string')}
${this.__section('meta:keywords', 'About One Laravel, Laravel SPA, Framework History, Team, Mission', 'string')}

${this.__section('content', `<!-- Hero Section -->
<section class="hero" style="padding: 4rem 0;">
<div class="container">
<h1>About One Laravel</h1>
<p>Revolutionizing web development by seamlessly merging Laravel's robustness with modern SPA capabilities</p>
</div>
</section>

<!-- Mission Section -->
<section class="py-5">
<div class="container">
<div class="row">
<div class="col-6">
<h2>Our Mission</h2>
<p>
One Laravel was born from a simple belief: developers shouldn't have to choose between
Laravel's powerful backend capabilities and modern frontend reactivity. We set out to
create a framework that gives you the best of both worlds.
</p>
<p>
Our mission is to empower developers to build lightning-fast, reactive web applications
without sacrificing the productivity and elegance that Laravel is known for.
</p>
</div>
<div class="col-6">
<div class="card">
<h3 class="card-title">Core Values</h3>
<ul style="color: var(--text-secondary); line-height: 1.8;">
<li><strong>Simplicity:</strong> Complex problems, simple solutions</li>
<li><strong>Performance:</strong> Speed without compromising functionality</li>
<li><strong>Developer Experience:</strong> Joy in coding, every day</li>
<li><strong>Community:</strong> Built by developers, for developers</li>
<li><strong>Innovation:</strong> Pushing the boundaries of what's possible</li>
</ul>
</div>
</div>
</div>
</div>
</section>

<!-- The Story Section -->
<section class="py-5" style="background: var(--bg-secondary);">
<div class="container">
<h2 class="text-center mb-5">The Story Behind One Laravel</h2>

<div class="timeline" style="max-width: 800px; margin: 0 auto;">
<div class="timeline-item" style="margin-bottom: 3rem; position: relative; padding-left: 3rem;">
<div style="position: absolute; left: 0; top: 0; width: 2rem; height: 2rem; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
<h4>The Problem</h4>
<p>
We found ourselves constantly switching between Laravel for backend logic and
React/Vue for frontend interactivity. The context switching was slowing us down,
and we were maintaining two separate codebases with different paradigms.
</p>
</div>

<div class="timeline-item" style="margin-bottom: 3rem; position: relative; padding-left: 3rem;">
<div style="position: absolute; left: 0; top: 0; width: 2rem; height: 2rem; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
<h4>The Vision</h4>
<p>
What if we could write reactive frontend components using familiar Blade syntax?
What if state management could be as simple as Laravel's Eloquent models?
What if we didn't need complex build tools and configurations?
</p>
</div>

<div class="timeline-item" style="margin-bottom: 3rem; position: relative; padding-left: 3rem;">
<div style="position: absolute; left: 0; top: 0; width: 2rem; height: 2rem; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">3</div>
<h4>The Innovation</h4>
<p>
We developed a revolutionary compiler that transforms Blade templates into reactive
JavaScript components. Server-side rendering for SEO, client-side reactivity for UX,
all in one unified framework.
</p>
</div>

<div class="timeline-item" style="position: relative; padding-left: 3rem;">
<div style="position: absolute; left: 0; top: 0; width: 2rem; height: 2rem; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">4</div>
<h4>The Result</h4>
<p>
One Laravel - a framework that lets you build modern, reactive applications using
the Laravel skills you already have. No new languages to learn, no complex
configurations to manage.
</p>
</div>
</div>
</div>
</section>

<!-- Technical Architecture -->
<section class="py-5">
<div class="container">
<h2 class="text-center mb-5">Technical Architecture</h2>

<div class="row">
<div class="col-4">
<div class="card text-center">
<div class="feature-icon" style="margin: 0 auto 1rem;">🔧</div>
<h4>Blade Compiler</h4>
<p>
Advanced PHP-to-JavaScript compiler that transforms Blade templates into
optimized, reactive components while preserving Laravel's syntax and conventions.
</p>
</div>
</div>

<div class="col-4">
<div class="card text-center">
<div class="feature-icon" style="margin: 0 auto 1rem;">⚡</div>
<h4>Reactive Engine</h4>
<p>
Lightweight JavaScript runtime that provides Vue-like reactivity with automatic
dependency tracking and efficient DOM updates.
</p>
</div>
</div>

<div class="col-4">
<div class="card text-center">
<div class="feature-icon" style="margin: 0 auto 1rem;">🔄</div>
<h4>SPA Router</h4>
<p>
Intelligent client-side router that works seamlessly with Laravel routes,
providing instant navigation while maintaining SEO compatibility.
</p>
</div>
</div>
</div>

<div class="text-center mt-5">
<a href="${App.View.escString(App.Helper.url('/docs'))}" class="btn btn-outline" data-navigate="/web/docs">
Explore Technical Documentation →
</a>
</div>
</div>
</section>

<!-- Key Features Deep Dive -->
<section class="py-5" style="background: var(--bg-secondary);">
<div class="container">
<h2 class="text-center mb-5">What Makes One Laravel Different</h2>

<div class="features-grid">
<div class="feature-card">
<h4>Zero Learning Curve</h4>
<p>
If you know Laravel and Blade, you already know One Laravel. We extend familiar
concepts rather than replacing them with new paradigms.
</p>
</div>

<div class="feature-card">
<h4>Progressive Enhancement</h4>
<p>
Start with traditional Laravel views and progressively add reactivity where needed.
No need to rewrite your entire application.
</p>
</div>

<div class="feature-card">
<h4>Performance Focused</h4>
<p>
Our compiler generates highly optimized JavaScript with automatic dead code elimination
and intelligent component splitting.
</p>
</div>

<div class="feature-card">
<h4>SEO by Default</h4>
<p>
Server-side rendering is built-in, not an afterthought. Your SPA is fully crawlable
and indexable from day one.
</p>
</div>

<div class="feature-card">
<h4>Developer Tools</h4>
<p>
Rich debugging experience with Vue DevTools integration, comprehensive error messages,
and development-friendly source maps.
</p>
</div>

<div class="feature-card">
<h4>Laravel Ecosystem</h4>
<p>
Full compatibility with Laravel packages, middleware, events, and all the tools
you're already using in your Laravel projects.
</p>
</div>
</div>
</div>
</section>

<!-- Community & Support -->
<section class="py-5">
<div class="container">
<h2 class="text-center mb-5">Community & Support</h2>

<div class="row">
<div class="col-6">
<h3>Open Source</h3>
<p>
One Laravel is proudly open source, licensed under MIT. We believe great tools
should be accessible to everyone, regardless of budget or company size.
</p>

<h3>Community Driven</h3>
<p>
Our roadmap is shaped by real developer needs. Every feature request is considered,
every bug report is valued, and every contribution is welcomed.
</p>

<a href="https://github.com/one-laravel/framework" class="btn btn-outline" target="_blank">
View on GitHub →
</a>
</div>

<div class="col-6">
<div class="card">
<h4>Get Involved</h4>
<ul style="list-style: none; padding: 0;">
<li style="margin-bottom: 1rem;">
<strong>🐛 Report Issues:</strong><br>
Found a bug? Let us know on GitHub
</li>
<li style="margin-bottom: 1rem;">
<strong>💡 Feature Requests:</strong><br>
Have an idea? Start a discussion
</li>
<li style="margin-bottom: 1rem;">
<strong>📝 Documentation:</strong><br>
Help improve our docs
</li>
<li style="margin-bottom: 1rem;">
<strong>💬 Community:</strong><br>
Join our Discord server
</li>
</ul>
</div>
</div>
</div>
</div>
</section>

<!-- Future Roadmap -->
<section class="py-5" style="background: var(--gradient-primary); color: white;">
<div class="container">
<h2 class="text-center mb-5">What's Coming Next</h2>

<div class="row">
<div class="col-3">
<div style="text-align: center; margin-bottom: 2rem;">
<h4>Q1 2025</h4>
<ul style="list-style: none; padding: 0; opacity: 0.9;">
<li>• Mobile optimizations</li>
<li>• Testing utilities</li>
<li>• Performance profiler</li>
</ul>
</div>
</div>

<div class="col-3">
<div style="text-align: center; margin-bottom: 2rem;">
<h4>Q2 2025</h4>
<ul style="list-style: none; padding: 0; opacity: 0.9;">
<li>• Component library</li>
<li>• CLI improvements</li>
<li>• IDE extensions</li>
</ul>
</div>
</div>

<div class="col-3">
<div style="text-align: center; margin-bottom: 2rem;">
<h4>Q3 2025</h4>
<ul style="list-style: none; padding: 0; opacity: 0.9;">
<li>• PWA support</li>
<li>• Offline capabilities</li>
<li>• Advanced routing</li>
</ul>
</div>
</div>

<div class="col-3">
<div style="text-align: center; margin-bottom: 2rem;">
<h4>Q4 2025</h4>
<ul style="list-style: none; padding: 0; opacity: 0.9;">
<li>• Real-time features</li>
<li>• Advanced animations</li>
<li>• Enterprise tools</li>
</ul>
</div>
</div>
</div>

<div class="text-center mt-4">
<a href="${App.View.escString(App.Helper.url('/contact'))}" class="btn btn-secondary" data-navigate="/web/contact">
Share Your Ideas
</a>
</div>
</div>
</section>`, 'html')}

${this.__section('styles', `<style>
.timeline-item::before {
content: '';
position: absolute;
left: 1rem;
top: 2rem;
bottom: -3rem;
width: 2px;
background: var(--bg-light);
}

.timeline-item:last-child::before {
display: none;
}

@media (max-width: 768px) {
.timeline-item {
padding-left: 2rem !important;
}

.timeline-item > div:first-child {
width: 1.5rem !important;
height: 1.5rem !important;
font-size: 0.8rem;
}

.timeline-item::before {
left: 0.75rem;
}
}
</style>`, 'html')}`;
            } catch(e) {
                __outputRenderedContent__ = this.__showError(e.message);
                console.warn(e);
            }
            return this.__extends('layouts.base');
            },
        init: function() {  },
        destroy: function() {}
    });
    return self;
        }