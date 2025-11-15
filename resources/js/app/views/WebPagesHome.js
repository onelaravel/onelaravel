export function WebPagesHome($$$DATA$$$ = {}, systemData = {}) {
    const {App, View, __base__, __layout__, __page__, __component__, __partial__, __system__, __env = {}, __helper = {}} = systemData;
    const __VIEW_PATH__ = 'web.pages.home';
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

    self.setup('web.pages.home', {
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
        "scripts":{
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
        renderLongSections: ["content","scripts"],
        renderSections: ["meta:title","meta:description","meta:keywords","content","scripts"],
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

${this.__section('meta:title', 'One Laravel - Advanced SPA Framework', 'string')}
${this.__section('meta:description', 'One Laravel combines Laravel\'s powerful backend with modern SPA capabilities for lightning-fast, reactive web applications.', 'string')}
${this.__section('meta:keywords', 'Laravel, SPA, PHP, JavaScript, Framework, Reactive, One Laravel, Web Development', 'string')}

${this.__section('content', `<!-- Hero Section -->
<section class="hero">
<div class="container">
<h1 class="fade-in">One Laravel</h1>
<p class="fade-in">The next-generation SPA framework that seamlessly blends Laravel's power with modern frontend reactivity</p>

<div class="hero-actions" style="margin-top: 2rem;">
<a href="${App.View.escString(App.Helper.url('/docs'))}" class="btn btn-large" data-navigate="/web/docs">Get Started</a>
<a href="${App.View.escString(App.Helper.url('/examples'))}" class="btn btn-secondary btn-large" data-navigate="/web/examples">View Examples</a>
</div>

<!-- Quick Demo -->
<div class="hero-demo" style="margin-top: 3rem; text-align: left;">
<div class="code-block">
<pre><code class="syntax-highlight">// Create reactive components with One Laravel
@useState(0, $count, $setCountFn)
&lt;div&gt;
    &lt;h3&gt;Counter: {{ count }}&lt;/h3&gt;
    &lt;button data-click="updateCount"&gt;Increment&lt;/button&gt;
&lt;/div&gt;

&lt;script&gt;
function updateCount() {
    this.updateStateByKey('count', count + 1);
}
&lt;/script&gt;
</code></pre>
</div>
</div>
</div>
</section>

<!-- Features Section -->
<section class="features">
<div class="container">
<h2 class="text-center mb-5">Why Choose One Laravel?</h2>

<div class="features-grid">
<!-- Feature 1: Laravel Integration -->
<div class="feature-card">
<div class="feature-icon">⚡</div>
<h3 class="feature-title">Laravel Integration</h3>
<p class="feature-description">
Built on top of Laravel, inheriting all its powerful features like Eloquent ORM,
middleware, authentication, and more. No need to learn a completely new framework.
</p>
</div>

<!-- Feature 2: Reactive Frontend -->
<div class="feature-card">
<div class="feature-icon">🔄</div>
<h3 class="feature-title">Reactive Frontend</h3>
<p class="feature-description">
Create dynamic, reactive user interfaces with automatic state management.
Components update automatically when data changes, just like Vue or React.
</p>
</div>

<!-- Feature 3: SPA Performance -->
<div class="feature-card">
<div class="feature-icon">🚀</div>
<h3 class="feature-title">SPA Performance</h3>
<p class="feature-description">
Lightning-fast navigation with client-side routing. Pages load instantly
without full page refreshes, providing a native app-like experience.
</p>
</div>

<!-- Feature 4: Blade Templates -->
<div class="feature-card">
<div class="feature-icon">🎨</div>
<h3 class="feature-title">Enhanced Blade</h3>
<p class="feature-description">
Use familiar Blade syntax with added superpowers. Create components,
manage state, and handle events with intuitive directives.
</p>
</div>

<!-- Feature 5: No Build Step -->
<div class="feature-card">
<div class="feature-icon">🛠️</div>
<h3 class="feature-title">No Complex Build</h3>
<p class="feature-description">
Write your frontend code in PHP and Blade templates. Our compiler
automatically generates optimized JavaScript. No webpack configuration needed.
</p>
</div>

<!-- Feature 6: SEO Friendly -->
<div class="feature-card">
<div class="feature-icon">🔍</div>
<h3 class="feature-title">SEO Optimized</h3>
<p class="feature-description">
Server-side rendering ensures your SPA is fully SEO-friendly.
Search engines can crawl and index your content properly.
</p>
</div>
</div>
</div>
</section>

<!-- Code Example Section -->
<section class="py-5" style="background: var(--bg-secondary);">
<div class="container">
<h2 class="text-center mb-5">See It In Action</h2>

<div class="example-container">
<div class="example-header">Creating a Todo App Component</div>

<div class="example-code">
<pre><code class="syntax-highlight">
@const([$todos, $setTodos] = useState([['text' => 'Learn One Laravel', 'completed' => false], ['text' => 'Build a SPA', 'completed' => false]]));
@const([$newTodo, $setNewTodo] = useState(''));

&lt;div class="todo-app"&gt;
    &lt;h2&gt;My Todo List&lt;/h2&gt;
    
    &lt;form data-submit="addTodo"&gt;
        &lt;input type="text" 
               data-input="updateNewTodo" 
               value="{{ newTodo }}" 
               placeholder="Add a new todo..."&gt;
        &lt;button type="submit"&gt;Add&lt;/button&gt;
    &lt;/form&gt;
    
    &lt;ul&gt;
        @verbatim
            
        @foreach($todos as $index => $todo)
            &lt;li class="{{ $todo['completed'] ? 'completed' : '' }}"&gt;
                &lt;span&gt;{{ $todo['text'] }}&lt;/span&gt;
                &lt;button data-click="toggleTodo({{ $index }})"&gt;Toggle&lt;/button&gt;
                &lt;button data-click="removeTodo({{ $index }})"&gt;Remove&lt;/button&gt;
            &lt;/li&gt;
        @endforeach
    &lt;/ul&gt;
&lt;/div&gt;

&lt;script&gt;
function addTodo(event) {
    event.preventDefault();
    if (newTodo.trim()) {
        const newTodos = [...todos, { text: newTodo, completed: false }];
        this.updateStateByKey('todos', newTodos);
        this.updateStateByKey('newTodo', '');
    }
}

function updateNewTodo(event) {
    this.updateStateByKey('newTodo', event.target.value);
}

function toggleTodo(index) {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    this.updateStateByKey('todos', updatedTodos);
}

function removeTodo(index) {
    const updatedTodos = todos.filter((_, i) => i !== index);
    this.updateStateByKey('todos', updatedTodos);
}
&lt;/script&gt;
@endverbatim
</code></pre>
</div>

<div class="example-preview">
<strong>Result:</strong> A fully functional, reactive todo application with automatic state management and DOM updates.
</div>
</div>

<div class="text-center mt-4">
<a href="${App.View.escString(App.Helper.url('/examples'))}" class="btn btn-outline" data-navigate="/web/examples">
View More Examples →
</a>
</div>
</div>
</section>

<!-- Stats Section -->
<section class="py-5">
<div class="container">
<h2 class="text-center mb-5">Built for Performance</h2>

<div class="stats-grid">
<div class="stat-card">
<span class="stat-number">< 50KB</span>
<div class="stat-label">Runtime Size</div>
</div>
<div class="stat-card">
<span class="stat-number">< 100ms</span>
<div class="stat-label">Navigation Speed</div>
</div>
<div class="stat-card">
<span class="stat-number">100%</span>
<div class="stat-label">Laravel Compatible</div>
</div>
<div class="stat-card">
<span class="stat-number">0</span>
<div class="stat-label">Build Dependencies</div>
</div>
</div>
</div>
</section>

<!-- Getting Started Section -->
<section class="py-5" style="background: var(--gradient-primary); color: white;">
<div class="container text-center">
<h2 class="mb-3">Ready to Get Started?</h2>
<p class="mb-4" style="font-size: 1.2rem; opacity: 0.9;">
Install One Laravel and build your first reactive application in minutes
</p>

<div class="code-block" style="text-align: left; margin: 2rem 0;">
<pre><code># Install via Composer
composer create-project one-laravel/laravel my-app

# Start developing
cd my-app
php artisan serve</code></pre>
</div>

<a href="${App.View.escString(App.Helper.url('/docs'))}" class="btn btn-secondary btn-large" data-navigate="/web/docs">
Read the Documentation
</a>
</div>
</section>`, 'html')}

${this.__section('scripts', `<script>
// Add some interactive elements to the home page
document.addEventListener('DOMContentLoaded', function() {
// Animate hero elements on load
const heroElements = document.querySelectorAll('.hero .fade-in');
heroElements.forEach((el, index) => {
setTimeout(() => {
el.style.opacity = '1';
el.style.transform = 'translateY(0)';
}, index * 200);
});

// Add hover effects to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
card.addEventListener('mouseenter', function() {
this.style.transform = 'translateY(-8px) scale(1.02)';
});

card.addEventListener('mouseleave', function() {
this.style.transform = 'translateY(0) scale(1)';
});
});

// Animate stats when they come into view
const observerOptions = {
threshold: 0.5,
rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const statNumber = entry.target.querySelector('.stat-number');
const originalText = statNumber.textContent;

// Simple counter animation for numbers
if (originalText.includes('ms') || originalText.includes('KB')) {
let start = 0;
const end = parseInt(originalText);
const duration = 1000;
const increment = end / (duration / 16);

const counter = setInterval(() => {
start += increment;
if (start >= end) {
start = end;
clearInterval(counter);
}
statNumber.textContent = originalText.replace(/\d+/, Math.floor(start));
}, 16);
}

statsObserver.unobserve(entry.target);
}
});
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
statsObserver.observe(card);
});
});
</script>

<style>
.hero .fade-in {
opacity: 0;
transform: translateY(30px);
transition: all 0.6s ease-out;
}

.btn-large {
padding: 1rem 2rem;
font-size: 1.1rem;
}

.hero-actions {
display: flex;
gap: 1rem;
justify-content: center;
flex-wrap: wrap;
}

.hero-demo {
max-width: 800px;
margin: 3rem auto 0;
}

@media (max-width: 768px) {
.hero h1 {
font-size: 2.5rem;
}

.hero p {
font-size: 1.1rem;
}

.hero-actions {
flex-direction: column;
align-items: center;
}

.btn-large {
width: 100%;
max-width: 300px;
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