# Observable System Documentation

🌟 **Vue-like Reactive Data Management System**

## Tổng quan

Observable System là một hệ thống quản lý dữ liệu reactive được lấy cảm hứng từ Vue.js, cung cấp tính năng reactive data binding, computed properties, watchers và lifecycle hooks.

## Tính năng chính

### ✅ **Reactive Data**
- Automatic dependency tracking
- Deep object/array reactivity
- Proxy-based implementation

### ✅ **Computed Properties**
- Cached computed values
- Automatic dependency tracking
- Lazy evaluation

### ✅ **Watchers**
- Deep watching
- Immediate execution
- Async update queue

### ✅ **Lifecycle Hooks**
- created, updated, destroyed
- Automatic cleanup

### ✅ **Performance Optimized**
- Batched updates
- Efficient dependency tracking
- Memory management

## Quick Start

### 1. Basic Usage
```javascript
import { Observable } from './core/Observable.js';

const obs = new Observable({
    message: 'Hello World',
    count: 0,
    user: {
        name: 'John',
        age: 25
    }
}, {
    name: 'MyObservable'
});

// Watch changes
const unwatch = obs.$watch('message', (newVal, oldVal) => {
    console.log(`Message changed: ${oldVal} -> ${newVal}`);
});

// Make changes - will trigger watcher
obs.message = 'Hello Observable!';
```

### 2. Computed Properties
```javascript
const obs = new Observable({
    firstName: 'John',
    lastName: 'Doe'
}, {
    computed: {
        fullName() {
            return `${this.firstName} ${this.lastName}`;
        },
        initials() {
            return `${this.firstName[0]}${this.lastName[0]}`;
        }
    }
});

console.log(obs.fullName); // "John Doe"
obs.firstName = 'Jane';
console.log(obs.fullName); // "Jane Doe" - automatically updated
```

### 3. Watchers
```javascript
const obs = new Observable({
    items: [],
    filter: ''
}, {
    watch: {
        items: {
            handler(newItems) {
                console.log('Items changed:', newItems.length);
            },
            deep: true,
            immediate: true
        },
        filter(newFilter) {
            console.log('Filter changed:', newFilter);
        }
    }
});
```

### 4. Lifecycle Hooks
```javascript
const obs = new Observable({
    data: 'initial'
}, {
    created() {
        console.log('Observable created!');
    },
    updated() {
        console.log('Data updated!');
    },
    destroyed() {
        console.log('Observable destroyed!');
    }
});
```

## API Reference

### Constructor
```javascript
new Observable(data, options)
```

**Parameters:**
- `data` (Object): Initial reactive data
- `options` (Object): Configuration options

**Options:**
```javascript
{
    name: 'ObservableName',          // Instance name for debugging
    deep: true,                      // Deep reactivity (default: true)
    computed: {                      // Computed properties
        propertyName() { return ... }
    },
    watch: {                         // Watchers
        propertyName: {
            handler(newVal, oldVal) {},
            deep: true,
            immediate: true
        }
    },
    created() {},                    // Lifecycle hooks
    updated() {},
    destroyed() {}
}
```

### Instance Methods

#### $watch(expOrFn, callback, options)
Subscribe to data changes:
```javascript
// Watch property
const unwatch = obs.$watch('count', (newVal, oldVal) => {
    console.log('Count changed:', newVal);
});

// Watch expression
obs.$watch(() => this.user.name, (newName) => {
    console.log('Name changed:', newName);
});

// With options
obs.$watch('items', callback, {
    deep: true,      // Watch nested changes
    immediate: true  // Execute immediately
});

// Unsubscribe
unwatch();
```

#### $set(target, key, value)
Add reactive property:
```javascript
obs.$set(obs.user, 'email', 'john@example.com');
```

#### $delete(target, key)
Remove reactive property:
```javascript
obs.$delete(obs.user, 'email');
```

#### $destroy()
Cleanup and destroy instance:
```javascript
obs.$destroy();
```

### Utility Methods

#### getData()
Get snapshot of current data:
```javascript
const data = obs.getData();
console.log(data); // { message: '...', count: 0, ... }
```

#### toJSON()
Export as JSON:
```javascript
const json = obs.toJSON();
console.log(JSON.stringify(json));
```

#### _debug()
Get debug information:
```javascript
console.log(obs._debug());
// {
//   name: 'MyObservable',
//   uid: 1,
//   data: {...},
//   watchers: 2,
//   computedWatchers: 1,
//   isDestroyed: false
// }
```

## Global Utilities

### Browser Console Access
```javascript
// Available globally
window.Observable        // Main class
window.observableUtils   // Utility functions
window.observable        // Convenience methods
window.ObservableExamples // Examples

// Quick creation
const obs = observable.create({ count: 0 });

// Reactive reference
const ref = observable.ref(0);
ref.value = 5;

// Reactive object
const reactive = observable.reactive({ message: 'hello' });

// Global store
const store = observable.createStore({
    user: { name: 'Guest' },
    settings: { theme: 'dark' }
});
```

### Convenience Methods
```javascript
// Create reactive reference
const count = observable.ref(0);
count.value++; // Reactive

// Create computed
const double = observable.computed(() => count.value * 2);

// Watch changes
const unwatch = observable.watch(
    () => count.value,
    (newVal) => console.log('Count:', newVal)
);

// Next tick
observable.nextTick(() => {
    console.log('After updates');
});
```

## Advanced Usage

### Deep Watching
```javascript
const obs = new Observable({
    config: {
        theme: 'dark',
        features: {
            notifications: true
        }
    }
});

obs.$watch('config', (newConfig) => {
    console.log('Config changed anywhere');
}, { deep: true });

// This will trigger the watcher
obs.config.features.notifications = false;
```

### Array Reactivity
```javascript
const obs = new Observable({
    items: [1, 2, 3]
});

obs.$watch('items', (newItems) => {
    console.log('Items changed:', newItems.length);
}, { deep: true });

// All these trigger the watcher
obs.items.push(4);
obs.items.splice(0, 1);
obs.items[0] = 99;
```

### Computed with Setter
```javascript
const obs = new Observable({
    firstName: 'John',
    lastName: 'Doe'
}, {
    computed: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(value) {
                const names = value.split(' ');
                this.firstName = names[0];
                this.lastName = names[names.length - 1];
            }
        }
    }
});

obs.fullName = 'Jane Smith'; // Sets firstName and lastName
```

### Conditional Watching
```javascript
const obs = new Observable({
    mode: 'development',
    debugLevel: 1
});

// Only watch in development
if (obs.mode === 'development') {
    obs.$watch('debugLevel', (level) => {
        console.log('Debug level:', level);
    });
}
```

## Performance Optimization

### Batched Updates
Updates are automatically batched using microtasks:
```javascript
obs.count = 1;
obs.count = 2;
obs.count = 3;
// Only triggers watchers once with final value
```

### Lazy Computed
Computed properties are cached and only re-computed when dependencies change:
```javascript
const obs = new Observable({
    items: [1, 2, 3, 4, 5]
}, {
    computed: {
        expensiveSum() {
            console.log('Computing sum...'); // Only logs when items change
            return this.items.reduce((sum, item) => sum + item, 0);
        }
    }
});

console.log(obs.expensiveSum); // Computes
console.log(obs.expensiveSum); // Uses cache
obs.items.push(6);
console.log(obs.expensiveSum); // Re-computes
```

### Memory Management
```javascript
// Always cleanup watchers
const unwatch = obs.$watch('data', callback);
// Later...
unwatch();

// Or destroy entire observable
obs.$destroy();
```

## Debugging

### Debug Mode
```javascript
// Enable global debug
observable.debug.enableAll();

// Check reactivity
console.log(observableUtils.isReactive(obj));

// Get raw object
const raw = observableUtils.toRaw(reactiveObj);
```

### Debug Information
```javascript
// Instance debug info
console.log(obs._debug());

// Global debug
observable.debug.logAll();
```

## Examples

### Todo App
```javascript
const todoApp = new Observable({
    todos: [],
    filter: 'all'
}, {
    computed: {
        filteredTodos() {
            if (this.filter === 'completed') {
                return this.todos.filter(todo => todo.done);
            }
            if (this.filter === 'active') {
                return this.todos.filter(todo => !todo.done);
            }
            return this.todos;
        },
        
        stats() {
            const total = this.todos.length;
            const completed = this.todos.filter(t => t.done).length;
            return { total, completed, remaining: total - completed };
        }
    },
    
    watch: {
        todos: {
            handler() {
                console.log('Todos updated:', this.stats);
            },
            deep: true
        }
    }
});

// Add todo
todoApp.todos.push({ id: 1, text: 'Learn Observable', done: false });

// Toggle todo
todoApp.todos[0].done = true;

// Filter todos
todoApp.filter = 'completed';
console.log(todoApp.filteredTodos);
```

### Counter with History
```javascript
const counter = new Observable({
    value: 0,
    history: []
}, {
    watch: {
        value: {
            handler(newVal, oldVal) {
                this.history.push({
                    from: oldVal,
                    to: newVal,
                    timestamp: Date.now()
                });
            },
            immediate: false
        }
    }
});

counter.value = 5;
counter.value = 10;
console.log(counter.history);
```

## Testing

### Unit Tests
```javascript
// Test reactivity
const obs = observable.create({ count: 0 });
let watchedValue = null;

obs.$watch('count', (newVal) => {
    watchedValue = newVal;
});

obs.count = 5;
console.assert(watchedValue === 5, 'Watcher should be triggered');

// Test computed
const computed = observable.create({
    x: 2,
    y: 3
}, {
    computed: {
        sum() { return this.x + this.y; }
    }
});

console.assert(computed.sum === 5, 'Computed should work');
computed.x = 5;
console.assert(computed.sum === 8, 'Computed should update');
```

### Performance Tests
```javascript
observable.examples.performance(); // Run built-in performance test
```

## Browser Console Usage

```javascript
// Quick start in console
const obs = observable.create({ message: 'Hello' });
obs.$watch('message', console.log);
obs.message = 'World';

// Run examples
observable.examples.run();

// Help
observable.help();
```

## Integration

### With ViewEngine (if needed)
```javascript
// In ViewEngine context
const obs = new Observable(this.data);

// Sync with ViewEngine state
obs.$watch('someProperty', (newVal) => {
    this.states.__updateStateByKey('someProperty', newVal);
});
```

### With DOM
```javascript
const app = new Observable({
    title: 'My App',
    theme: 'dark'
});

// Update DOM when data changes
app.$watch('title', (newTitle) => {
    document.title = newTitle;
});

app.$watch('theme', (newTheme) => {
    document.body.className = newTheme;
});
```

## Best Practices

1. **Always cleanup watchers**:
```javascript
const unwatch = obs.$watch('data', callback);
// Later...
unwatch();
```

2. **Use computed for derived data**:
```javascript
// Good
computed: {
    fullName() { return `${this.first} ${this.last}`; }
}

// Avoid
watch: {
    first() { this.fullName = `${this.first} ${this.last}`; },
    last() { this.fullName = `${this.first} ${this.last}`; }
}
```

3. **Prefer deep watching for objects**:
```javascript
obs.$watch('config', callback, { deep: true });
```

4. **Use meaningful names**:
```javascript
new Observable(data, { name: 'UserProfile' });
```

5. **Leverage lifecycle hooks**:
```javascript
new Observable(data, {
    created() {
        // Initialize
    },
    destroyed() {
        // Cleanup
    }
});
```

---

**Observable System giờ đã sẵn sàng để sử dụng! 🚀**