export function WebDocs($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'web.docs';
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

    self.setup('web.docs', {
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
        hasAwaitData: true,
        hasFetchData: true,
        subscribe: ["count", "onCountChange"],
        fetch: {"url": `users`, "method": "GET", "data": {}, "headers": {}},
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

${this.__section('meta:title', 'Documentation - One Laravel Framework', 'string')}
${this.__section('meta:description', 'Complete documentation for One Laravel - Learn how to build reactive SPAs with Laravel and Blade templates.', 'string')}
${this.__section('meta:keywords', 'One Laravel docs, Laravel SPA documentation, Blade reactive components', 'string')}

${this.__section('content', `<!-- Hero Section -->
<section class="hero" style="padding: 3rem 0;">
<div class="container">
<h1>Documentation</h1>
<p>Everything you need to build amazing SPAs with One Laravel</p>
</div>
</section>

<section class="py-4">
<div class="container">
<div class="row">
<!-- Sidebar Navigation -->
<div class="col-3">
<div class="docs-nav">
<h4 style="margin-bottom: 1rem;">Getting Started</h4>
<ul>
<li><a href="#installation" class="active">Installation</a></li>
<li><a href="#quick-start">Quick Start</a></li>
<li><a href="#directory-structure">Directory Structure</a></li>
</ul>

<h4 style="margin: 2rem 0 1rem;">Core Concepts</h4>
<ul>
<li><a href="#reactive-components">Reactive Components</a></li>
<li><a href="#state-management">State Management</a></li>
<li><a href="#event-handling">Event Handling</a></li>
<li><a href="#lifecycle-methods">Lifecycle Methods</a></li>
</ul>

<h4 style="margin: 2rem 0 1rem;">Advanced Topics</h4>
<ul>
<li><a href="#spa-routing">SPA Routing</a></li>
<li><a href="#component-communication">Component Communication</a></li>
<li><a href="#performance">Performance</a></li>
<li><a href="#testing">Testing</a></li>
</ul>

<h4 style="margin: 2rem 0 1rem;">API Reference</h4>
<ul>
<li><a href="#directives">Blade Directives</a></li>
<li><a href="#javascript-api">JavaScript API</a></li>
<li><a href="#configuration">Configuration</a></li>
</ul>
</div>
</div>

<!-- Main Content -->
<div class="col-9">
<div class="docs-content">
<!-- Installation -->
<section id="installation" class="mb-5">
<h2>Installation</h2>
<div class="breadcrumb">
<span class="breadcrumb-item">Documentation</span>
<span class="breadcrumb-item">Getting Started</span>
<span class="breadcrumb-item">Installation</span>
</div>

<p>One Laravel can be installed via Composer. Make sure you have PHP 8.1 or higher installed.</p>

<div class="alert alert-info">
<strong>Prerequisites:</strong> PHP 8.1+, Composer, Node.js 16+ (for asset compilation)
</div>

<div class="example-container">
<div class="example-header">Create New Project</div>
<div class="example-code">
                                    <pre><code># Create a new One Laravel project
composer create-project one-laravel/laravel my-spa-app

# Navigate to the project directory
cd my-spa-app

# Install dependencies
composer install
npm install

# Set up environment
cp .env.example .env
php artisan key:generate

# Start development server
php artisan serve</code></pre>
</div>
</div>

<h3>Add to Existing Laravel Project</h3>
<p>You can also add One Laravel to an existing Laravel application:</p>

<div class="example-container">
<div class="example-header">Install Package</div>
<div class="example-code">
                                    <pre><code># Install One Laravel package
composer require one-laravel/framework

# Publish configuration
php artisan vendor:publish --provider="OneLaravel\ServiceProvider"

# Compile assets
php artisan one:compile</code></pre>
</div>
</div>
</section>

<!-- Quick Start -->
<section id="quick-start" class="mb-5">
<h2>Quick Start</h2>
<div class="breadcrumb">
<span class="breadcrumb-item">Documentation</span>
<span class="breadcrumb-item">Getting Started</span>
<span class="breadcrumb-item">Quick Start</span>
</div>

<p>Let's create your first reactive component in One Laravel. We'll build a simple counter.</p>

<div class="example-container">
<div class="example-header">resources/views/components/counter.blade.php</div>
<div class="example-code">
                                    <pre><code class="syntax-highlight">
@useState(0, $count, $setCount)

&lt;div class="counter-component"&gt;
    &lt;h3&gt;Counter: {{ $count }}&lt;/h3&gt;
    
    &lt;div&gt;
        &lt;button data-click="decrement"&gt;-&lt;/button&gt;
        &lt;button data-click="increment"&gt;+&lt;/button&gt;
        &lt;button data-click="reset"&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
    
    &lt;p&gt;
        @if ($count > 0)
            Positive number!
        @elseif($count < 0)
            Negative number!
        @else
            Zero!
        @endif
    &lt;/p&gt;
&lt;/div&gt;

&lt;script&gt;
function increment() {
    this.updateStateByKey('count', count + 1);
}

function decrement() {
    this.updateStateByKey('count', count - 1);
}

function reset() {
    this.updateStateByKey('count', 0);
}
&lt;/script&gt;
</code></pre>
</div>
<div class="example-preview">
<strong>Result:</strong> A fully reactive counter that updates the DOM automatically when state changes.
</div>
</div>

<h3>Using the Component</h3>
<div class="example-container">
<div class="example-header">resources/views/welcome.blade.php</div>
<div class="example-code">
                                    <pre><code>
@extends('layouts.app')

@section('content')
    &lt;div class="container"&gt;
        &lt;h1&gt;Welcome to One Laravel&lt;/h1&gt;
        
        
        @include('components.counter')
    &lt;/div&gt;
@endsection
</code></pre>
</div>
</div>
</section>
<!-- Reactive Components -->
                        <section id="reactive-components" class="mb-5">
                            <h2>Reactive Components</h2>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Documentation</span>
                                <span class="breadcrumb-item">Core Concepts</span>
                                <span class="breadcrumb-item">Reactive Components</span>
                            </div>

                            <p>One Laravel components automatically update when their state changes. This is achieved through a reactive system similar to Vue.js or React.</p>

                            <h3>State Declaration</h3>
                            <p>Use the <code class="code-inline">@useState</code> directive to declare reactive state:</p>

                            <div class="example-container">
                                <div class="example-header">State Declaration Examples</div>
                                <div class="example-code">
                                    <pre><code class="syntax-highlight">

@const([$message, $setMessage] = useState('Hello World'))
@useState(['message' => 'Hello World'])



@const([$user, $setUser] = useState([
    'name' => 'John Doe',
    'email' => 'john@example.com',
]))

@const([$todos, $setTodos] = useState([]))
@const([$loading, $setLoading] = useState(false))
@const([$count, $setCount] = useState(0))
                                    </code></pre>
                                </div>
                            </div>

                            <h3>Computed Properties</h3>
                            <p>Create computed values that automatically update when dependencies change:</p>

                            <div class="example-container">
                                <div class="example-header">Computed Properties</div>
                                <div class="example-code">
                                    <pre><code class="syntax-highlight">

@const([$firstName, $setFirstName] = useState('John'))
@const([$lastName, $setLastName] = useState('Doe'))

&lt;div&gt;
    &lt;p&gt;Full Name: {{ $firstName . ' ' . $lastName }}&lt;/p&gt;
    &lt;p&gt;Initials: {{ substr($firstName, 0, 1) . substr($lastName, 0, 1) }}&lt;/p&gt;
&lt;/div&gt;
                                </code></pre>
                                </div>
                            </div>
                        </section>

<!-- State Management -->
<section id="state-management" class="mb-5">
<h2>State Management</h2>
<div class="breadcrumb">
<span class="breadcrumb-item">Documentation</span>
<span class="breadcrumb-item">Core Concepts</span>
<span class="breadcrumb-item">State Management</span>
</div>

<p>One Laravel provides several ways to update component state:</p>

<div class="table">
<table>
<thead>
<tr>
<th>Method</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>updateStateByKey()</code></td>
<td>Update a single state property</td>
<td><code>this.updateStateByKey('count', 5)</code></td>
</tr>
<tr>
<td><code>updateRealState()</code></td>
<td>Update multiple state properties</td>
<td><code>this.updateRealState({count: 5, loading: false})</code></td>
</tr>
<tr>
<td><code>useState()</code></td>
<td>Get current state value</td>
<td><code>const [count, setCount] = useState(0)</code></td>
</tr>
</tbody>
</table>
</div>

<div class="alert alert-warning">
<strong>Important:</strong> Always use the provided methods to update state. Direct assignment won't trigger reactivity.
</div>
</section>

<!-- Event Handling -->
<section id="event-handling" class="mb-5">
<h2>Event Handling</h2>
<div class="breadcrumb">
<span class="breadcrumb-item">Documentation</span>
<span class="breadcrumb-item">Core Concepts</span>
<span class="breadcrumb-item">Event Handling</span>
</div>

<p>Handle user interactions with data attributes:</p>

<div class="example-container">
<div class="example-header">Event Handling Examples</div>
<div class="example-code">
                                    <pre><code class="syntax-highlight">&lt;!-- Click events --&gt;
&lt;button data-click="handleClick"&gt;Click Me&lt;/button&gt;

&lt;!-- Form events --&gt;
&lt;input type="text" data-input="handleInput" data-change="handleChange"&gt;
&lt;form data-submit="handleSubmit"&gt;...&lt;/form&gt;

&lt;!-- Mouse events --&gt;
&lt;div data-mouseenter="showTooltip" data-mouseleave="hideTooltip"&gt;
    Hover me
&lt;/div&gt;

&lt;!-- Keyboard events --&gt;
&lt;input data-keydown="handleKeyDown" data-keyup="handleKeyUp"&gt;

&lt;script&gt;
function handleClick(event) {
    console.log('Button clicked!', event);
}

function handleInput(event) {
    this.updateStateByKey('inputValue', event.target.value);
}

function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
}
&lt;/script&gt;</code></pre>
</div>
</div>
</section>
<!-- API Reference -->
                        <section id="directives" class="mb-5">
                            <h2>Blade Directives</h2>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Documentation</span>
                                <span class="breadcrumb-item">API Reference</span>
                                <span class="breadcrumb-item">Blade Directives</span>
                            </div>

                            <p>One Laravel extends Blade with reactive directives:</p>

                            <div class="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Directive</th>
                                            <th>Description</th>
                                            <th>Example</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>@useState</code></td>
                                            <td>Declare reactive state</td>
                                            <td><code>@useState(['count' => 0])</code></td>
                                        </tr>
                                        <tr>
                                            <td><code>@fetch</code></td>
                                            <td>Fetch data from API</td>
                                            <td><code>@fetch('users', '/api/users')</code></td>
                                        </tr>
                                        <tr>
                                            <td><code>@await</code></td>
                                            <td>Handle async operations</td>
                                            <td><code>@await('fetchUsers')</code></td>
                                        </tr>
                                        <tr>
                                            <td><code>@subscribe</code></td>
                                            <td>Subscribe to state changes</td>
                                            <td><code>@subscribe('count', 'onCountChange')</code></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="text-center mt-5">
                                <a href="{{ url('/examples') }}" class="btn btn-primary" data-navigate="/web/examples">
                                    See More Examples →
                                </a>
                            </div>
                        </section>
</div>
</div>
</div>
</div>
</section>`, 'html')}

${this.__section('scripts', `<script>
document.addEventListener('DOMContentLoaded', function() {
// Smooth scrolling for navigation links
document.querySelectorAll('.docs-nav a[href^="#"]').forEach(link => {
link.addEventListener('click', function(e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});

// Update active link
document.querySelectorAll('.docs-nav a').forEach(l => l.classList.remove('active'));
this.classList.add('active');

// Update URL without triggering navigation
history.pushState(null, null, this.getAttribute('href'));
}
});
});

// Highlight current section on scroll
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const id = entry.target.id;
document.querySelectorAll('.docs-nav a').forEach(link => {
link.classList.remove('active');
if (link.getAttribute('href') === \`#${id}\`) {
link.classList.add('active');
}
});
}
});
}, {
rootMargin: '-20% 0px -70% 0px'
});

document.querySelectorAll('section[id]').forEach(section => {
observer.observe(section);
});
});
</script>

<style>
.docs-content h2 {
border-bottom: 2px solid var(--bg-light);
padding-bottom: 0.5rem;
margin-bottom: 1.5rem;
}

.docs-content h3 {
color: var(--primary-color);
margin-top: 2rem;
}

.docs-nav {
position: sticky;
top: 2rem;
max-height: calc(100vh - 4rem);
overflow-y: auto;
}

@media (max-width: 768px) {
.docs-nav {
position: static;
margin-bottom: 2rem;
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