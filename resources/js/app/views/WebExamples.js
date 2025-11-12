export function WebExamples($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'web.examples';
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

    self.setup('web.examples', {
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

${this.__section('meta:title', 'Examples - One Laravel Framework', 'string')}
${this.__section('meta:description', 'Interactive examples and demos showcasing One Laravel features - from simple counters to complex applications.', 'string')}
${this.__section('meta:keywords', 'One Laravel examples, Laravel SPA demos, reactive components examples', 'string')}

${this.__section('content', `<!-- Hero Section -->
<section class="hero" style="padding: 3rem 0;">
<div class="container">
<h1>Interactive Examples</h1>
<p>Live demos and code examples showcasing One Laravel's capabilities</p>
</div>
</section>

<section class="py-4">
<div class="container">
<!-- Example Categories -->
<div class="examples-filter mb-4">
<div class="row">
<div class="col-12">
<div class="filter-tabs">
<button class="filter-tab active" data-filter="all">All Examples</button>
<button class="filter-tab" data-filter="basic">Basic</button>
<button class="filter-tab" data-filter="forms">Forms</button>
<button class="filter-tab" data-filter="api">API Integration</button>
<button class="filter-tab" data-filter="advanced">Advanced</button>
</div>
</div>
</div>
</div>

<!-- Examples Grid -->
<div class="examples-grid">
<div class="row">
<!-- Counter Example -->
<div class="col-lg-6 mb-4" data-category="basic">
<div class="example-card">
<div class="example-header">
<h3>Reactive Counter</h3>
<div class="example-tags">
<span class="tag tag-basic">Basic</span>
<span class="tag tag-state">State</span>
</div>
</div>

<div class="example-description">
<p>A simple counter demonstrating reactive state management and event handling.</p>
</div>

<div class="example-demo">
<div class="demo-container" id="counter-demo">
<div class="counter-component">
<h4>Count: <span id="counter-value">0</span></h4>
<div class="btn-group">
<button class="btn btn-outline-secondary" onclick="updateCounter(-1)">-</button>
<button class="btn btn-outline-secondary" onclick="updateCounter(1)">+</button>
<button class="btn btn-outline-secondary" onclick="resetCounter()">Reset</button>
</div>
</div>
</div>
</div>

<div class="example-code">
<div class="code-tabs">
<button class="code-tab active" data-lang="blade">Blade</button>
<button class="code-tab" data-lang="js">JavaScript</button>
</div>
<div class="code-content">
<div class="code-block active" data-lang="blade">
<pre><code class="syntax-highlight">

&lt;div class="counter-component"&gt;
    &lt;h4&gt;Count: ${App.View.escString(count)}&lt;/h4&gt;
    &lt;div class="btn-group"&gt;
        &lt;button data-click="decrement"&gt;-&lt;/button&gt;
        &lt;button data-click="increment"&gt;+&lt;/button&gt;
        &lt;button data-click="reset"&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
&lt;/div&gt;</code></pre>
</div>
<div class="code-block" data-lang="js">
<pre><code class="syntax-highlight">function increment() {
    this.updateStateByKey('count', count + 1);
}

function decrement() {
    this.updateStateByKey('count', count - 1);
}

function reset() {
    this.updateStateByKey('count', 0);
}</code></pre>
</div>
</div>
</div>
</div>
</div>

<!-- Todo List Example -->
<div class="col-lg-6 mb-4" data-category="basic forms">
<div class="example-card">
<div class="example-header">
<h3>Todo List</h3>
<div class="example-tags">
<span class="tag tag-basic">Basic</span>
<span class="tag tag-forms">Forms</span>
<span class="tag tag-list">Lists</span>
</div>
</div>

<div class="example-description">
<p>Interactive todo list with add, toggle, and delete functionality.</p>
</div>

<div class="example-demo">
<div class="demo-container" id="todo-demo">
<div class="todo-app">
<div class="input-group mb-3">
<input type="text" id="todo-input" class="form-control" placeholder="Add new todo...">
<button class="btn btn-primary" onclick="addTodo()">Add</button>
</div>
<ul id="todo-list" class="list-unstyled">
<!-- Todos will be added here -->
</ul>
</div>
</div>
</div>

<div class="example-code">
<div class="code-tabs">
<button class="code-tab active" data-lang="blade">Blade</button>
<button class="code-tab" data-lang="js">JavaScript</button>
</div>
<div class="code-content">
<div class="code-block active" data-lang="blade">
<pre><code class="syntax-highlight">

&lt;div class="todo-app"&gt;
    &lt;div class="input-group"&gt;
        &lt;input type="text"
               data-model="newTodo"
               placeholder="Add todo..."&gt;
        &lt;button data-click="addTodo"&gt;Add&lt;/button&gt;
    &lt;/div&gt;

    &lt;ul&gt;
        @foreach($todos as $index => $todo)
            &lt;li class="${App.View.escString(todo['completed'] ? 'completed' : '')}"&gt;
                &lt;input type="checkbox"
                       data-change="toggleTodo(${App.View.escString(index)})"
                       ${App.View.escString(todo['completed'] ? 'checked' : '')}&gt;
                ${App.View.escString(todo['text'])}
                &lt;button data-click="deleteTodo(${App.View.escString(index)})"&gt;×&lt;/button&gt;
            &lt;/li&gt;
        @endforeach
    &lt;/ul&gt;
&lt;/div&gt;</code></pre>
</div>
<div class="code-block" data-lang="js">
<pre><code class="syntax-highlight">function addTodo() {
    if (newTodo.trim()) {
        const newTodos = [...todos, {
            text: newTodo,
            completed: false
        }];
        this.updateRealState({
            todos: newTodos,
            newTodo: ''
        });
    }
}

function toggleTodo(index) {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    this.updateStateByKey('todos', updatedTodos);
}

function deleteTodo(index) {
    const filteredTodos = todos.filter((_, i) => i !== index);
    this.updateStateByKey('todos', filteredTodos);
}</code></pre>
</div>
</div>
</div>
</div>
</div>

<!-- API Integration Example -->
<div class="col-lg-6 mb-4" data-category="api advanced">
<div class="example-card">
<div class="example-header">
<h3>User Directory</h3>
<div class="example-tags">
<span class="tag tag-api">API</span>
<span class="tag tag-advanced">Advanced</span>
<span class="tag tag-async">Async</span>
</div>
</div>

<div class="example-description">
<p>Fetch and display users from an API with loading states and error handling.</p>
</div>

<div class="example-demo">
<div class="demo-container" id="users-demo">
<div class="users-app">
<div class="mb-3">
<button class="btn btn-primary" onclick="fetchUsers()">Load Users</button>
<button class="btn btn-outline-secondary" onclick="clearUsers()">Clear</button>
</div>
<div id="users-loading" class="text-center" style="display: none;">
<div class="spinner-border" role="status">
<span class="visually-hidden">Loading...</span>
</div>
</div>
<div id="users-list"></div>
</div>
</div>
</div>

<div class="example-code">
<div class="code-tabs">
<button class="code-tab active" data-lang="blade">Blade</button>
<button class="code-tab" data-lang="js">JavaScript</button>
</div>
<div class="code-content">
<div class="code-block active" data-lang="blade">
<pre><code class="syntax-highlight">

&lt;div class="users-app"&gt;
    &lt;button data-click="fetchUsers"&gt;Load Users&lt;/button&gt;

    @if($loading)
        &lt;div class="loading"&gt;Loading...&lt;/div&gt;
    @endif

    @if($error)
        &lt;div class="alert alert-danger"&gt;${App.View.escString(error)}&lt;/div&gt;
    @endif

    @if(!empty($users))
        &lt;div class="users-grid"&gt;
            @foreach($users as $user)
                &lt;div class="user-card"&gt;
                    &lt;h4&gt;${App.View.escString(user['name'])}&lt;/h4&gt;
                    &lt;p&gt;${App.View.escString(user['email'])}&lt;/p&gt;
                    &lt;small&gt;${App.View.escString(user['company']['name'])}&lt;/small&gt;
                &lt;/div&gt;
            @endforeach
        &lt;/div&gt;
    @endif
&lt;/div&gt;</code></pre>
</div>
<div class="code-block" data-lang="js">
<pre><code class="syntax-highlight">async function fetchUsers() {
    this.updateRealState({
        loading: true,
        error: null
    });

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        this.updateRealState({
            users: users,
            loading: false
        });
    } catch (error) {
        this.updateRealState({
            error: 'Failed to load users: ' + error.message,
            loading: false
        });
    }
}</code></pre>
</div>
</div>
</div>
</div>
</div>

<!-- Dynamic Form Example -->
<div class="col-lg-6 mb-4" data-category="forms advanced">
<div class="example-card">
<div class="example-header">
<h3>Dynamic Form Builder</h3>
<div class="example-tags">
<span class="tag tag-forms">Forms</span>
<span class="tag tag-advanced">Advanced</span>
<span class="tag tag-validation">Validation</span>
</div>
</div>

<div class="example-description">
<p>Build forms dynamically with real-time validation and conditional fields.</p>
</div>

<div class="example-demo">
<div class="demo-container" id="form-demo">
<div class="dynamic-form">
<div class="mb-3">
<label class="form-label">Name *</label>
<input type="text" class="form-control" id="form-name" onInput="validateForm()">
<div class="form-error" id="name-error"></div>
</div>

<div class="mb-3">
<label class="form-label">Email *</label>
<input type="email" class="form-control" id="form-email" onInput="validateForm()">
<div class="form-error" id="email-error"></div>
</div>

<div class="mb-3">
<label class="form-label">Role</label>
<select class="form-control" id="form-role" onChange="handleRoleChange()">
<option value="">Select role...</option>
<option value="user">User</option>
<option value="admin">Admin</option>
<option value="developer">Developer</option>
</select>
</div>

<div id="conditional-fields" style="display: none;"></div>

<button class="btn btn-primary" id="submit-btn" disabled onclick="submitForm()">
Submit Form
</button>
</div>
</div>
</div>

<div class="example-code">
<div class="code-tabs">
<button class="code-tab active" data-lang="blade">Blade</button>
<button class="code-tab" data-lang="js">JavaScript</button>
</div>
<div class="code-content">
<div class="code-block active" data-lang="blade">
<pre><code class="syntax-highlight">

&lt;form data-submit="handleSubmit"&gt;
    &lt;div class="form-group"&gt;
        &lt;label&gt;Name *&lt;/label&gt;
        &lt;input type="text"
               data-model="form.name"
               data-input="validateField('name')"&gt;
        @if(isset($errors['name']))
            &lt;div class="error"&gt;${App.View.escString(errors['name'])}&lt;/div&gt;
        @endif
    &lt;/div&gt;

    &lt;div class="form-group"&gt;
        &lt;label&gt;Role&lt;/label&gt;
        &lt;select data-model="form.role" data-change="handleRoleChange"&gt;
            &lt;option value=""&gt;Select...&lt;/option&gt;
            &lt;option value="user"&gt;User&lt;/option&gt;
            &lt;option value="admin"&gt;Admin&lt;/option&gt;
        &lt;/select&gt;
    &lt;/div&gt;

    @if($form['role'] === 'admin')
        &lt;div class="form-group"&gt;
            &lt;label&gt;Admin Level&lt;/label&gt;
            &lt;input type="number" data-model="form.adminLevel"&gt;
        &lt;/div&gt;
    @endif

    &lt;button type="submit"
            ${App.View.escString(!isValid ? 'disabled' : '')}&gt;
        Submit
    &lt;/button&gt;
&lt;/form&gt;</code></pre>
</div>
<div class="code-block" data-lang="js">
<pre><code class="syntax-highlight">function validateField(field) {
    const errors = { ...this.errors };
    const value = this.form[field];

    switch(field) {
        case 'name':
            errors.name = value.length < 2 ? 'Name must be at least 2 characters' : null;
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.email = !emailRegex.test(value) ? 'Invalid email format' : null;
            break;
    }

    const isValid = Object.values(errors).every(error => !error);

    this.updateRealState({
        errors: errors,
        isValid: isValid
    });
}

function handleRoleChange() {
    // Conditional field logic based on role
    if (this.form.role === 'admin') {
        this.updateStateByKey('form.adminLevel', 1);
    }
}</code></pre>
</div>
</div>
</div>
</div>
</div>

<!-- Real-time Chat Example -->
<div class="col-lg-12 mb-4" data-category="advanced api">
<div class="example-card">
<div class="example-header">
<h3>Real-time Chat Interface</h3>
<div class="example-tags">
<span class="tag tag-advanced">Advanced</span>
<span class="tag tag-api">API</span>
<span class="tag tag-realtime">Real-time</span>
<span class="tag tag-websockets">WebSockets</span>
</div>
</div>

<div class="example-description">
<p>Complete chat interface with real-time messaging, user presence, and typing indicators.</p>
</div>

<div class="example-demo">
<div class="demo-container" id="chat-demo">
<div class="chat-app">
<div class="chat-header">
<h5>One Laravel Chat</h5>
<div class="online-status">
<span class="status-dot online"></span>
<span id="user-count">1 user online</span>
</div>
</div>

<div class="chat-messages" id="chat-messages">
<div class="message received">
<div class="message-avatar">👋</div>
<div class="message-content">
<div class="message-author">System</div>
<div class="message-text">Welcome to One Laravel Chat! This is a demo.</div>
<div class="message-time">Just now</div>
</div>
</div>
</div>

<div class="typing-indicator" id="typing-indicator" style="display: none;">
<span>Someone is typing...</span>
</div>

<div class="chat-input">
<input type="text" id="message-input" placeholder="Type a message..." onKeyPress="handleMessageKeyPress(event)">
<button class="btn btn-primary" onclick="sendMessage()">Send</button>
</div>
</div>
</div>
</div>

<div class="example-code">
<div class="code-tabs">
<button class="code-tab active" data-lang="blade">Blade</button>
<button class="code-tab" data-lang="js">JavaScript</button>
<button class="code-tab" data-lang="php">PHP Backend</button>
</div>
<div class="code-content">
<div class="code-block active" data-lang="blade">
<pre><code class="syntax-highlight">

&lt;div class="chat-app"&gt;
    &lt;div class="chat-header"&gt;
        &lt;h5&gt;Chat Room&lt;/h5&gt;
        &lt;div class="status ${App.View.escString(connected ? 'online' : 'offline')}"&gt;
            ${App.View.escString(connected ? 'Connected' : 'Disconnected')}
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="messages-container"&gt;
        @foreach($messages as $message)
            &lt;div class="message ${App.View.escString(message['user'] === currentUser ? 'sent' : 'received')}"&gt;
                &lt;div class="message-author"&gt;${App.View.escString(message['user'])}&lt;/div&gt;
                &lt;div class="message-text"&gt;${App.View.escString(message['text'])}&lt;/div&gt;
                &lt;div class="message-time"&gt;${App.View.escString(message['timestamp'])}&lt;/div&gt;
            &lt;/div&gt;
        @endforeach
    &lt;/div&gt;

    @if($typing)
        &lt;div class="typing-indicator"&gt;Someone is typing...&lt;/div&gt;
    @endif

    &lt;div class="message-input"&gt;
        &lt;input type="text"
               data-model="newMessage"
               data-keyup="handleTyping"
               data-keydown="handleEnter"
               placeholder="Type a message..."&gt;
        &lt;button data-click="sendMessage"&gt;Send&lt;/button&gt;
    &lt;/div&gt;
&lt;/div&gt;</code></pre>
</div>
<div class="code-block" data-lang="js">
<pre><code class="syntax-highlight">let websocket = null;

function connectToChat() {
    websocket = new WebSocket('ws://localhost:8080/chat');

    websocket.onopen = () => {
        this.updateStateByKey('connected', true);
    };

    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
            const newMessages = [...this.messages, data.message];
            this.updateStateByKey('messages', newMessages);
        } else if (data.type === 'typing') {
            this.updateStateByKey('typing', data.typing);
        }
    };

    websocket.onclose = () => {
        this.updateStateByKey('connected', false);
        // Attempt to reconnect
        setTimeout(connectToChat, 3000);
    };
}

function sendMessage() {
    if (this.newMessage.trim() && websocket) {
        websocket.send(JSON.stringify({
            type: 'message',
            message: {
                user: this.currentUser,
                text: this.newMessage,
                timestamp: new Date().toLocaleTimeString()
            }
        }));

        this.updateStateByKey('newMessage', '');
    }
}

function handleTyping() {
    if (websocket) {
        websocket.send(JSON.stringify({
            type: 'typing',
            user: this.currentUser,
            typing: this.newMessage.length > 0
        }));
    }
}</code></pre>
</div>
<div class="code-block" data-lang="php">
<pre><code class="syntax-highlight">&lt;?php
// routes/channels.php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{room}', function ($user, $room) {
    return ['id' => $user->id, 'name' => $user->name];
});

// app/Events/MessageSent.php
class MessageSent implements ShouldBroadcast
{
    public function __construct(
        public string $message,
        public string $user,
        public string $room = 'general'
    ) {}

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->room);
    }
}

// Controller
class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->validate([
            'message' => 'required|string|max:500',
            'room' => 'required|string'
        ]);

        broadcast(new MessageSent(
            $message['message'],
            auth()->user()->name,
            $message['room']
        ));

        return response()->json(['status' => 'sent']);
    }
}</code></pre>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- Call to Action -->
<div class="text-center mt-5">
<div class="cta-section">
<h3>Ready to build your own?</h3>
<p>Get started with One Laravel and create amazing reactive SPAs</p>
<div class="btn-group">
<a href="${App.View.escString(App.Helper.url('/docs'))}" class="btn btn-primary" data-navigate="/web/docs">
View Documentation
</a>
<a href="https://github.com/one-laravel/framework" class="btn btn-outline-primary" target="_blank">
View on GitHub
</a>
</div>
</div>
</div>
</div>
</section>`, 'html')}

${this.__section('scripts', `<script>
document.addEventListener('DOMContentLoaded', function() {
// Filter functionality
document.querySelectorAll('.filter-tab').forEach(tab => {
tab.addEventListener('click', function() {
const filter = this.dataset.filter;

// Update active tab
document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
this.classList.add('active');

// Filter examples
document.querySelectorAll('[data-category]').forEach(example => {
const categories = example.dataset.category.split(' ');
if (filter === 'all' || categories.includes(filter)) {
example.style.display = 'block';
} else {
example.style.display = 'none';
}
});
});
});

// Code tab switching
document.querySelectorAll('.code-tab').forEach(tab => {
tab.addEventListener('click', function() {
const lang = this.dataset.lang;
const container = this.closest('.example-code');

// Update active tab
container.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
this.classList.add('active');

// Show corresponding code block
container.querySelectorAll('.code-block').forEach(block => {
block.classList.remove('active');
if (block.dataset.lang === lang) {
block.classList.add('active');
}
});
});
});

initializeDemos();
});

// Initialize interactive demos
function initializeDemos() {
// Counter demo
let counterValue = 0;
window.updateCounter = function(delta) {
counterValue += delta;
document.getElementById('counter-value').textContent = counterValue;
};

window.resetCounter = function() {
counterValue = 0;
document.getElementById('counter-value').textContent = counterValue;
};

// Todo demo
let todos = [];
window.addTodo = function() {
const input = document.getElementById('todo-input');
if (input.value.trim()) {
todos.push({
id: Date.now(),
text: input.value,
completed: false
});
input.value = '';
renderTodos();
}
};

window.toggleTodo = function(id) {
const todo = todos.find(t => t.id === id);
if (todo) {
todo.completed = !todo.completed;
renderTodos();
}
};

window.deleteTodo = function(id) {
todos = todos.filter(t => t.id !== id);
renderTodos();
};

function renderTodos() {
const list = document.getElementById('todo-list');
list.innerHTML = todos.map(todo => \`
<li class="todo-item ${todo.completed ? 'completed' : ''}">
<input type="checkbox" ${todo.completed ? 'checked' : ''}
onchange="toggleTodo(${todo.id})">
<span class="todo-text">${todo.text}</span>
<button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">×</button>
</li>
\`).join('');
}

// Users demo
window.fetchUsers = async function() {
const loading = document.getElementById('users-loading');
const list = document.getElementById('users-list');

loading.style.display = 'block';
list.innerHTML = '';

try {
const response = await fetch('https://jsonplaceholder.typicode.com/users');
const users = await response.json();

loading.style.display = 'none';
list.innerHTML = users.slice(0, 4).map(user => \`
<div class="user-card mb-3 p-3 border rounded">
<h6>${user.name}</h6>
<p class="mb-1">${user.email}</p>
<small class="text-muted">${user.company.name}</small>
</div>
\`).join('');
} catch (error) {
loading.style.display = 'none';
list.innerHTML = \`<div class="alert alert-danger">Error: ${error.message}</div>\`;
}
};

window.clearUsers = function() {
document.getElementById('users-list').innerHTML = '';
};

// Form demo
window.validateForm = function() {
const name = document.getElementById('form-name').value;
const email = document.getElementById('form-email').value;
const submitBtn = document.getElementById('submit-btn');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

let valid = true;

if (name.length < 2) {
nameError.textContent = 'Name must be at least 2 characters';
valid = false;
} else {
nameError.textContent = '';
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
emailError.textContent = 'Please enter a valid email';
valid = false;
} else {
emailError.textContent = '';
}

submitBtn.disabled = !valid;
};

window.handleRoleChange = function() {
const role = document.getElementById('form-role').value;
const conditionalFields = document.getElementById('conditional-fields');

if (role === 'admin') {
conditionalFields.style.display = 'block';
conditionalFields.innerHTML = \`
<div class="mb-3">
<label class="form-label">Admin Level</label>
<select class="form-control">
<option>Level 1</option>
<option>Level 2</option>
<option>Level 3</option>
</select>
</div>
\`;
} else if (role === 'developer') {
conditionalFields.style.display = 'block';
conditionalFields.innerHTML = \`
<div class="mb-3">
<label class="form-label">Programming Languages</label>
<input type="text" class="form-control" placeholder="e.g., PHP, JavaScript, Python">
</div>
\`;
} else {
conditionalFields.style.display = 'none';
}
};

window.submitForm = function() {
alert('Form submitted successfully! (This is just a demo)');
};

// Chat demo
window.handleMessageKeyPress = function(event) {
if (event.key === 'Enter') {
sendMessage();
}
};

window.sendMessage = function() {
const input = document.getElementById('message-input');
const messages = document.getElementById('chat-messages');

if (input.value.trim()) {
const messageHtml = \`
<div class="message sent">
<div class="message-avatar">👤</div>
<div class="message-content">
<div class="message-author">You</div>
<div class="message-text">${input.value}</div>
<div class="message-time">${new Date().toLocaleTimeString()}</div>
</div>
</div>
\`;

messages.insertAdjacentHTML('beforeend', messageHtml);
input.value = '';
messages.scrollTop = messages.scrollHeight;

// Simulate response
setTimeout(() => {
const responseHtml = \`
<div class="message received">
<div class="message-avatar">🤖</div>
<div class="message-content">
<div class="message-author">Bot</div>
<div class="message-text">Thanks for trying the One Laravel chat demo!</div>
<div class="message-time">${new Date().toLocaleTimeString()}</div>
</div>
</div>
\`;
messages.insertAdjacentHTML('beforeend', responseHtml);
messages.scrollTop = messages.scrollHeight;
}, 1000);
}
};
}
</script>

<style>
.examples-filter {
border-bottom: 1px solid var(--border-color);
}

.filter-tabs {
display: flex;
gap: 1rem;
flex-wrap: wrap;
}

.filter-tab {
padding: 0.75rem 1.5rem;
border: none;
background: transparent;
color: var(--text-secondary);
border-radius: 0.5rem;
cursor: pointer;
transition: all 0.2s ease;
}

.filter-tab:hover {
background: var(--bg-light);
color: var(--text-primary);
}

.filter-tab.active {
background: var(--primary-color);
color: white;
}

.example-card {
border: 1px solid var(--border-color);
border-radius: 0.75rem;
overflow: hidden;
height: 100%;
transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.example-card:hover {
transform: translateY(-2px);
box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.example-header {
padding: 1.5rem;
border-bottom: 1px solid var(--border-color);
display: flex;
justify-content: space-between;
align-items: flex-start;
}

.example-tags {
display: flex;
gap: 0.5rem;
flex-wrap: wrap;
}

.tag {
padding: 0.25rem 0.75rem;
border-radius: 1rem;
font-size: 0.875rem;
font-weight: 500;
}

.tag-basic { background: var(--success-light); color: var(--success-dark); }
.tag-forms { background: var(--info-light); color: var(--info-dark); }
.tag-api { background: var(--warning-light); color: var(--warning-dark); }
.tag-advanced { background: var(--danger-light); color: var(--danger-dark); }
.tag-state { background: var(--primary-light); color: var(--primary-dark); }
.tag-list { background: var(--secondary-light); color: var(--secondary-dark); }
.tag-async { background: var(--purple-light); color: var(--purple-dark); }
.tag-realtime { background: var(--orange-light); color: var(--orange-dark); }
.tag-websockets { background: var(--teal-light); color: var(--teal-dark); }
.tag-validation { background: var(--pink-light); color: var(--pink-dark); }

.example-description {
padding: 1rem 1.5rem;
background: var(--bg-light);
}

.example-demo {
padding: 1.5rem;
background: white;
border-bottom: 1px solid var(--border-color);
}

.demo-container {
min-height: 150px;
}

.example-code {
background: var(--code-bg);
}

.code-tabs {
display: flex;
border-bottom: 1px solid var(--border-color);
}

.code-tab {
padding: 0.75rem 1rem;
border: none;
background: transparent;
color: var(--text-secondary);
cursor: pointer;
border-bottom: 2px solid transparent;
}

.code-tab.active {
color: var(--primary-color);
border-bottom-color: var(--primary-color);
}

.code-content {
position: relative;
}

.code-block {
display: none;
max-height: 400px;
overflow-y: auto;
}

.code-block.active {
display: block;
}

.code-block pre {
margin: 0;
padding: 1.5rem;
background: transparent;
}

/* Demo-specific styles */
.counter-component {
text-align: center;
padding: 2rem;
}

.counter-component h4 {
font-size: 2rem;
margin-bottom: 1rem;
}

.todo-item {
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.75rem;
border: 1px solid var(--border-color);
border-radius: 0.5rem;
margin-bottom: 0.5rem;
}

.todo-item.completed .todo-text {
text-decoration: line-through;
opacity: 0.6;
}

.user-card {
text-align: center;
}

.chat-app {
border: 1px solid var(--border-color);
border-radius: 0.5rem;
height: 400px;
display: flex;
flex-direction: column;
}

.chat-header {
padding: 1rem;
border-bottom: 1px solid var(--border-color);
display: flex;
justify-content: space-between;
align-items: center;
background: var(--bg-light);
}

.status-dot {
display: inline-block;
width: 8px;
height: 8px;
border-radius: 50%;
margin-right: 0.5rem;
}

.status-dot.online {
background: var(--success-color);
}

.chat-messages {
flex: 1;
overflow-y: auto;
padding: 1rem;
}

.message {
display: flex;
gap: 0.75rem;
margin-bottom: 1rem;
}

.message.sent {
flex-direction: row-reverse;
}

.message-avatar {
width: 32px;
height: 32px;
border-radius: 50%;
background: var(--primary-light);
display: flex;
align-items: center;
justify-content: center;
font-size: 0.875rem;
}

.message-content {
flex: 1;
max-width: 70%;
}

.message.sent .message-content {
text-align: right;
}

.message-author {
font-size: 0.875rem;
font-weight: 500;
color: var(--text-secondary);
margin-bottom: 0.25rem;
}

.message-text {
background: var(--bg-light);
padding: 0.75rem;
border-radius: 1rem;
word-wrap: break-word;
}

.message.sent .message-text {
background: var(--primary-color);
color: white;
}

.message-time {
font-size: 0.75rem;
color: var(--text-secondary);
margin-top: 0.25rem;
}

.typing-indicator {
padding: 0.5rem 1rem;
font-style: italic;
color: var(--text-secondary);
border-top: 1px solid var(--border-color);
}

.chat-input {
display: flex;
gap: 0.5rem;
padding: 1rem;
border-top: 1px solid var(--border-color);
}

.chat-input input {
flex: 1;
}

.form-error {
color: var(--danger-color);
font-size: 0.875rem;
margin-top: 0.25rem;
}

.cta-section {
padding: 3rem;
background: var(--bg-light);
border-radius: 1rem;
text-align: center;
}

@media (max-width: 768px) {
.filter-tabs {
justify-content: center;
}

.example-header {
flex-direction: column;
gap: 1rem;
}

.chat-app {
height: 300px;
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