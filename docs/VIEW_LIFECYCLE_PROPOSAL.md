# View Lifecycle System Proposal

## Tổng quan
Dựa vào cơ chế view hiện tại trong `main.js`, đề xuất một lifecycle system hoàn chỉnh cho views.

## Lifecycle Hooks

### 1. View Creation Lifecycle
```javascript
// Trong AppViewEngine constructor
const AppViewEngine = function (path, config) {
    // ... existing code ...
    
    // Lifecycle hooks
    this.lifecycle = {
        beforeCreate: config.beforeCreate || function() {},
        created: config.created || function() {},
        beforeMount: config.beforeMount || function() {},
        mounted: config.mounted || function() {},
        beforeUpdate: config.beforeUpdate || function() {},
        updated: config.updated || function() {},
        beforeDestroy: config.beforeDestroy || function() {},
        destroyed: config.destroyed || function() {}
    };
    
    // Call beforeCreate
    this.lifecycle.beforeCreate.call(this);
}
```

### 2. View Mounting Lifecycle
```javascript
// Trong App.View.loadView()
async loadView(name, data = {}, scope = 'web') {
    // ... existing code ...
    
    // Call beforeMount
    if (viewEngine.lifecycle) {
        viewEngine.lifecycle.beforeMount.call(viewEngine);
    }
    
    // Mount view
    const result = await this.renderView(view);
    
    // Call mounted
    if (viewEngine.lifecycle) {
        viewEngine.lifecycle.mounted.call(viewEngine);
    }
    
    return result;
}
```

### 3. View Update Lifecycle
```javascript
// Trong App.View.renderView()
renderView(view) {
    // ... existing code ...
    
    // Call beforeUpdate
    if (view.lifecycle) {
        view.lifecycle.beforeUpdate.call(view);
    }
    
    // Render view
    const result = view.render();
    
    // Call updated
    if (view.lifecycle) {
        view.lifecycle.updated.call(view);
    }
    
    return result;
}
```

### 4. View Destruction Lifecycle
```javascript
// Trong AppViewEngine.remove()
remove() {
    // Call beforeDestroy
    if (this.lifecycle) {
        this.lifecycle.beforeDestroy.call(this);
    }
    
    // Remove view
    this.master.removeChild(this);
    this.children.forEach(child => child.remove());
    this.master = null;
    this.children = [];
    
    // Call destroyed
    if (this.lifecycle) {
        this.lifecycle.destroyed.call(this);
    }
    
    return this;
}
```

## Template Integration

### 1. Trong Blade Compiler
```javascript
// Trong main_compiler.py
def generate_view_function(self, view_name, sections_info, template_content):
    return f"""
    '{view_name}': function {view_name}(data = {{}}) {{
        const __VIEW_PATH__ = '{view_name}';
        const __VIEW_ID__ = App.View.generateViewId();
        const __WRAPPER_ELEMENT__ = document.createElement('template');
        const refs = [];
        
        // Lifecycle hooks
        const lifecycle = {{
            beforeCreate: function() {{
                // Called before view creation
                console.log('View {view_name} beforeCreate');
            }},
            created: function() {{
                // Called after view creation
                console.log('View {view_name} created');
            }},
            beforeMount: function() {{
                // Called before view mounting
                console.log('View {view_name} beforeMount');
            }},
            mounted: function() {{
                // Called after view mounting
                console.log('View {view_name} mounted');
            }},
            beforeUpdate: function() {{
                // Called before view update
                console.log('View {view_name} beforeUpdate');
            }},
            updated: function() {{
                // Called after view update
                console.log('View {view_name} updated');
            }},
            beforeDestroy: function() {{
                // Called before view destruction
                console.log('View {view_name} beforeDestroy');
            }},
            destroyed: function() {{
                // Called after view destruction
                console.log('View {view_name} destroyed');
            }}
        }};
        
        // ... existing code ...
        
        return new App.View.Engine('{view_name}', {{
            // ... existing config ...
            lifecycle: lifecycle
        }});
    }}
    """
```

### 2. Custom Lifecycle Hooks
```javascript
// Trong view template
@onInit
<script>
    // Custom lifecycle hooks
    this.lifecycle.beforeMount = function() {
        // Initialize data
        this.data = { ...this.data, customData: 'value' };
    };
    
    this.lifecycle.mounted = function() {
        // Setup event listeners
        this.setupEventListeners();
    };
    
    this.lifecycle.beforeDestroy = function() {
        // Cleanup
        this.cleanup();
    };
</script>
@endonInit
```

## Utility Functions

### 1. Lifecycle Helpers
```javascript
// Trong App.View
App.View.lifecycle = {
    // Mixin lifecycle hooks
    mixin: function(target, source) {
        if (source.lifecycle) {
            target.lifecycle = { ...target.lifecycle, ...source.lifecycle };
        }
    },
    
    // Call lifecycle hook
    callHook: function(view, hookName, ...args) {
        if (view.lifecycle && view.lifecycle[hookName]) {
            return view.lifecycle[hookName].apply(view, args);
        }
    },
    
    // Register global lifecycle hook
    registerGlobalHook: function(hookName, callback) {
        if (!App.View.globalLifecycle) {
            App.View.globalLifecycle = {};
        }
        App.View.globalLifecycle[hookName] = callback;
    }
};
```

### 2. View State Management
```javascript
// Trong AppViewEngine
const AppViewEngine = function (path, config) {
    // ... existing code ...
    
    // View state
    this.state = {
        isCreated: false,
        isMounted: false,
        isDestroyed: false,
        lastUpdate: null
    };
    
    // State getters
    this.isCreated = () => this.state.isCreated;
    this.isMounted = () => this.state.isMounted;
    this.isDestroyed = () => this.state.isDestroyed;
}
```

## Event System

### 1. View Events
```javascript
// Trong AppViewEngine
const AppViewEngine = function (path, config) {
    // ... existing code ...
    
    // Event system
    this.events = {};
    
    // Emit event
    this.emit = function(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback.apply(this, args);
            });
        }
    };
    
    // Listen to event
    this.on = function(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    };
    
    // Remove event listener
    this.off = function(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    };
}
```

### 2. Global Events
```javascript
// Trong App.View
App.View.events = {
    // Global event system
    emit: function(eventName, ...args) {
        // Emit to all views
        Object.values(App.View.viewEngines).forEach(view => {
            view.emit(eventName, ...args);
        });
    },
    
    // Listen to global events
    on: function(eventName, callback) {
        // Register global listener
    }
};
```

## Performance Optimization

### 1. Lazy Loading
```javascript
// Trong App.View
App.View.lazyLoad = function(viewName, loader) {
    return function(data = {}) {
        return loader().then(view => {
            return view(data);
        });
    };
};
```

### 2. View Caching
```javascript
// Trong App.View
App.View.cache = {
    views: new Map(),
    
    get: function(key) {
        return this.views.get(key);
    },
    
    set: function(key, value) {
        this.views.set(key, value);
    },
    
    clear: function() {
        this.views.clear();
    }
};
```

## Best Practices

### 1. Lifecycle Hook Usage
```javascript
// Good practices
beforeCreate: function() {
    // Initialize data, setup initial state
    this.data = { ...this.data, initialData: 'value' };
},

mounted: function() {
    // Setup DOM event listeners, start timers
    this.setupEventListeners();
    this.startTimer();
},

beforeDestroy: function() {
    // Cleanup event listeners, stop timers
    this.removeEventListeners();
    this.stopTimer();
}
```

### 2. Error Handling
```javascript
// Trong lifecycle hooks
mounted: function() {
    try {
        this.setupEventListeners();
    } catch (error) {
        console.error('Error in mounted hook:', error);
        App.View.emit('view:error', this, error);
    }
}
```

## Implementation Priority

1. **Phase 1**: Basic lifecycle hooks (beforeCreate, created, beforeMount, mounted)
2. **Phase 2**: Update lifecycle hooks (beforeUpdate, updated)
3. **Phase 3**: Destruction lifecycle hooks (beforeDestroy, destroyed)
4. **Phase 4**: Event system integration
5. **Phase 5**: Performance optimization features

## Benefits

1. **Predictable**: Clear lifecycle stages for views
2. **Flexible**: Customizable hooks for different use cases
3. **Maintainable**: Easy to debug and maintain
4. **Performance**: Optimized rendering and cleanup
5. **Extensible**: Easy to add new features and hooks
