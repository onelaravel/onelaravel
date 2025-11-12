/**
 * Simple Observable Examples
 * Demonstrates the super simple API
 */

import { ob, watch, computed, toRaw, isObservable } from '../core/Observer.js';

/**
 * Example 1: Basic usage - exactly what user wants
 */
export function exampleBasicUsage() {
    console.log('=== Example 1: Basic Usage ===');
    
    // Super simple creation
    let data = ob({
        a: 1, 
        b: 2, 
        c: ['item1', 'item2', 'item3'],
        nested: {
            x: 10,
            y: 20
        }
    });

    // Watch all changes
    const unwatch = watch(data, 'a', (newVal, oldVal) => {
        console.log(`data.a changed: ${oldVal} -> ${newVal}`);
    });

    watch(data, 'b', (newVal, oldVal) => {
        console.log(`data.b changed: ${oldVal} -> ${newVal}`);
    });

    watch(data, 'c', (newVal, oldVal) => {
        console.log(`data.c changed:`, newVal);
    });

    watch(data, 'nested.x', (newVal, oldVal) => {
        console.log(`data.nested.x changed: ${oldVal} -> ${newVal}`);
    });

    // Make changes - all reactive
    setTimeout(() => {
        console.log('Making changes...');
        data.a = 100;           // triggers watcher
    }, 100);

    setTimeout(() => {
        data.b++;               // triggers watcher
    }, 200);

    setTimeout(() => {
        data.c.push('new item'); // triggers watcher
    }, 300);

    setTimeout(() => {
        data.c.pop();           // triggers watcher
    }, 400);

    setTimeout(() => {
        data.nested.x = 999;    // triggers watcher
    }, 500);

    setTimeout(() => {
        // Test JSON serialization - clean output
        console.log('JSON serialization:');
        console.log(JSON.stringify(data, null, 2));
        
        // Show raw data
        console.log('Raw data:');
        console.log(toRaw(data));
        
        unwatch();
        console.log('Example 1 completed\n');
    }, 700);
}

/**
 * Example 2: Array operations
 */
export function exampleArrayOperations() {
    console.log('=== Example 2: Array Operations ===');
    
    let data = ob({
        items: [1, 2, 3],
        todos: [
            { id: 1, text: 'Task 1', done: false },
            { id: 2, text: 'Task 2', done: true }
        ]
    });

    // Watch array changes
    watch(data, 'items', (newVal) => {
        console.log('Items array changed:', newVal);
    });

    watch(data, 'todos', (newVal) => {
        console.log('Todos array changed, length:', newVal.length);
    });

    // All array operations are reactive
    setTimeout(() => {
        console.log('Testing array operations...');
        data.items.push(4);
    }, 100);

    setTimeout(() => {
        data.items.pop();
    }, 200);

    setTimeout(() => {
        data.items.unshift(0);
    }, 300);

    setTimeout(() => {
        data.items.splice(1, 1, 99);
    }, 400);

    setTimeout(() => {
        data.todos.push({ id: 3, text: 'New task', done: false });
    }, 500);

    setTimeout(() => {
        data.todos[0].done = true; // nested changes work too
    }, 600);

    setTimeout(() => {
        console.log('Final state:', JSON.stringify(data, null, 2));
        console.log('Example 2 completed\n');
    }, 800);
}

/**
 * Example 3: Computed values
 */
export function exampleComputedValues() {
    console.log('=== Example 3: Computed Values ===');
    
    let data = ob({
        firstName: 'John',
        lastName: 'Doe',
        items: [1, 2, 3, 4, 5]
    });

    // Computed properties
    const fullName = computed(() => {
        console.log('Computing full name...');
        return `${data.firstName} ${data.lastName}`;
    });

    const sum = computed(() => {
        console.log('Computing sum...');
        return data.items.reduce((a, b) => a + b, 0);
    });

    console.log('Initial computed values:');
    console.log('Full name:', fullName());
    console.log('Sum:', sum());

    setTimeout(() => {
        console.log('\nChanging firstName...');
        data.firstName = 'Jane';
        console.log('Full name:', fullName()); // re-computes
        console.log('Sum:', sum()); // uses cache
    }, 200);

    setTimeout(() => {
        console.log('\nAdding item...');
        data.items.push(6);
        console.log('Full name:', fullName()); // uses cache
        console.log('Sum:', sum()); // re-computes
    }, 400);

    setTimeout(() => {
        console.log('Example 3 completed\n');
    }, 600);
}

/**
 * Example 4: Nested object changes
 */
export function exampleNestedChanges() {
    console.log('=== Example 4: Nested Object Changes ===');
    
    let data = ob({
        user: {
            profile: {
                name: 'John',
                age: 30,
                preferences: {
                    theme: 'dark',
                    language: 'en'
                }
            },
            permissions: ['read', 'write']
        }
    });

    // Watch nested changes
    watch(data, 'user.profile.name', (newVal, oldVal) => {
        console.log(`Name changed: ${oldVal} -> ${newVal}`);
    });

    watch(data, 'user.profile.preferences.theme', (newVal, oldVal) => {
        console.log(`Theme changed: ${oldVal} -> ${newVal}`);
    });

    watch(data, 'user.permissions', (newVal) => {
        console.log('Permissions changed:', newVal);
    });

    setTimeout(() => {
        console.log('Changing nested properties...');
        data.user.profile.name = 'Jane';
    }, 100);

    setTimeout(() => {
        data.user.profile.preferences.theme = 'light';
    }, 200);

    setTimeout(() => {
        data.user.permissions.push('admin');
    }, 300);

    setTimeout(() => {
        // Add new nested property
        data.user.profile.email = 'jane@example.com';
        console.log('Added email, full data:');
        console.log(JSON.stringify(data, null, 2));
        console.log('Example 4 completed\n');
    }, 500);
}

/**
 * Example 5: Performance test
 */
export function examplePerformanceTest() {
    console.log('=== Example 5: Performance Test ===');
    
    let data = ob({
        counter: 0,
        items: []
    });

    let changeCount = 0;
    watch(data, 'counter', () => {
        changeCount++;
    });

    const startTime = performance.now();
    const iterations = 1000;

    console.log(`Testing ${iterations} updates...`);
    
    for (let i = 0; i < iterations; i++) {
        data.counter = i;
    }

    setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`Performance results:`);
        console.log(`- Updates: ${iterations}`);
        console.log(`- Changes detected: ${changeCount}`);
        console.log(`- Time: ${duration.toFixed(2)}ms`);
        console.log(`- Average: ${(duration / iterations).toFixed(4)}ms per update`);
        console.log(`- Updates/sec: ${Math.round(iterations / (duration / 1000))}`);
        console.log('Example 5 completed\n');
    }, 100);
}

/**
 * Example 6: Real-world todo app
 */
export function exampleTodoApp() {
    console.log('=== Example 6: Todo App ===');
    
    let app = ob({
        newTodo: '',
        todos: [
            { id: 1, text: 'Learn Observable', done: false },
            { id: 2, text: 'Build awesome app', done: false }
        ],
        filter: 'all' // all, active, completed
    });

    // Computed values
    const filteredTodos = computed(() => {
        if (app.filter === 'active') {
            return app.todos.filter(todo => !todo.done);
        }
        if (app.filter === 'completed') {
            return app.todos.filter(todo => todo.done);
        }
        return app.todos;
    });

    const stats = computed(() => {
        const total = app.todos.length;
        const completed = app.todos.filter(t => t.done).length;
        return {
            total,
            completed,
            remaining: total - completed
        };
    });

    // Watch changes
    watch(app, 'todos', () => {
        const s = stats();
        console.log(`Todos updated: ${s.total} total, ${s.completed} completed, ${s.remaining} remaining`);
    });

    // App methods
    const addTodo = (text) => {
        if (text.trim()) {
            app.todos.push({
                id: Date.now(),
                text: text.trim(),
                done: false
            });
            app.newTodo = '';
        }
    };

    const toggleTodo = (id) => {
        const todo = app.todos.find(t => t.id === id);
        if (todo) {
            todo.done = !todo.done;
        }
    };

    const removeTodo = (id) => {
        const index = app.todos.findIndex(t => t.id === id);
        if (index > -1) {
            app.todos.splice(index, 1);
        }
    };

    // Simulate user interactions
    setTimeout(() => {
        console.log('Adding new todo...');
        addTodo('Test reactive system');
    }, 100);

    setTimeout(() => {
        console.log('Completing first todo...');
        toggleTodo(1);
    }, 200);

    setTimeout(() => {
        console.log('Changing filter to completed...');
        app.filter = 'completed';
        console.log('Filtered todos:', filteredTodos());
    }, 300);

    setTimeout(() => {
        console.log('Removing a todo...');
        removeTodo(2);
    }, 400);

    setTimeout(() => {
        console.log('Final app state:');
        console.log(JSON.stringify(app, null, 2));
        console.log('Example 6 completed\n');
    }, 600);
}

/**
 * Run all examples
 */
export function runAllSimpleExamples() {
    console.log('🚀 Starting Simple Observable Examples...\n');
    
    exampleBasicUsage();
    
    setTimeout(() => exampleArrayOperations(), 1000);
    setTimeout(() => exampleComputedValues(), 2000);
    setTimeout(() => exampleNestedChanges(), 3000);
    setTimeout(() => examplePerformanceTest(), 4000);
    setTimeout(() => exampleTodoApp(), 5000);
    
    setTimeout(() => {
        console.log('🎉 All simple examples completed!');
        console.log('\nSimple API Summary:');
        console.log('- ob(data) - Make data reactive');
        console.log('- watch(obj, path, callback) - Watch changes');
        console.log('- computed(fn) - Computed values');
        console.log('- toRaw(obj) - Get raw data');
        console.log('- isObservable(obj) - Check if reactive');
    }, 7000);
}

// Browser global access
if (typeof window !== 'undefined') {
    window.SimpleObservableExamples = {
        exampleBasicUsage,
        exampleArrayOperations,
        exampleComputedValues,
        exampleNestedChanges,
        examplePerformanceTest,
        exampleTodoApp,
        runAllSimpleExamples
    };
}

export {
    exampleBasicUsage,
    exampleArrayOperations,
    exampleComputedValues,
    exampleNestedChanges,
    examplePerformanceTest,
    exampleTodoApp,
    runAllSimpleExamples
};