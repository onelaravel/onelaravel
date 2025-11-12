/**
 * Observable Examples - Vue-like Reactive System
 * Demonstrates how to use the Observable class
 */

import { Observable, observableUtils } from '../core/Observer.js';

/**
 * Example 1: Basic reactive data
 */
export function exampleBasicReactivity() {
    console.log('=== Example 1: Basic Reactivity ===');
    
    const obs = new Observable({
        message: 'Hello World',
        count: 0,
        user: {
            name: 'John',
            age: 25
        },
        items: ['apple', 'banana', 'orange']
    }, {
        name: 'BasicExample'
    });

    // Watch for changes
    const unwatch = obs.$watch('message', (newVal, oldVal) => {
        console.log(`Message changed: "${oldVal}" -> "${newVal}"`);
    });

    // Make changes
    setTimeout(() => {
        console.log('Changing message...');
        obs.message = 'Hello Observable!';
    }, 100);

    setTimeout(() => {
        console.log('Changing count...');
        obs.count = 5;
    }, 200);

    setTimeout(() => {
        console.log('Changing nested property...');
        obs.user.name = 'Jane';
    }, 300);

    setTimeout(() => {
        console.log('Adding array item...');
        obs.items.push('grape');
    }, 400);

    setTimeout(() => {
        unwatch();
        console.log('Example 1 completed\n');
    }, 600);
}

/**
 * Example 2: Computed properties
 */
export function exampleComputedProperties() {
    console.log('=== Example 2: Computed Properties ===');
    
    const obs = new Observable({
        firstName: 'John',
        lastName: 'Doe',
        age: 25
    }, {
        name: 'ComputedExample',
        computed: {
            fullName() {
                console.log('Computing fullName...');
                return `${this.firstName} ${this.lastName}`;
            },
            isAdult() {
                console.log('Computing isAdult...');
                return this.age >= 18;
            },
            displayInfo() {
                return `${this.fullName} (${this.age} years old) - ${this.isAdult ? 'Adult' : 'Minor'}`;
            }
        }
    });

    // Initial computed values
    console.log('Full name:', obs.fullName);
    console.log('Is adult:', obs.isAdult);
    console.log('Display info:', obs.displayInfo);

    // Watch computed property
    const unwatch = obs.$watch('fullName', (newVal, oldVal) => {
        console.log(`Full name computed: "${oldVal}" -> "${newVal}"`);
    });

    // Change dependencies
    setTimeout(() => {
        console.log('\nChanging firstName...');
        obs.firstName = 'Jane';
        console.log('New full name:', obs.fullName);
    }, 100);

    setTimeout(() => {
        console.log('\nChanging age...');
        obs.age = 16;
        console.log('New display info:', obs.displayInfo);
    }, 200);

    setTimeout(() => {
        unwatch();
        console.log('Example 2 completed\n');
    }, 400);
}

/**
 * Example 3: Deep watching and nested objects
 */
export function exampleDeepWatching() {
    console.log('=== Example 3: Deep Watching ===');
    
    const obs = new Observable({
        config: {
            theme: 'dark',
            language: 'en',
            features: {
                notifications: true,
                autoSave: false
            }
        },
        users: [
            { id: 1, name: 'Alice', active: true },
            { id: 2, name: 'Bob', active: false }
        ]
    }, {
        name: 'DeepWatchExample'
    });

    // Watch nested object
    const unwatchConfig = obs.$watch('config', (newVal, oldVal) => {
        console.log('Config changed:', JSON.stringify(newVal, null, 2));
    }, { deep: true });

    // Watch array
    const unwatchUsers = obs.$watch('users', (newVal, oldVal) => {
        console.log('Users array changed, length:', newVal.length);
    }, { deep: true });

    // Make nested changes
    setTimeout(() => {
        console.log('Changing theme...');
        obs.config.theme = 'light';
    }, 100);

    setTimeout(() => {
        console.log('Changing nested feature...');
        obs.config.features.autoSave = true;
    }, 200);

    setTimeout(() => {
        console.log('Adding new user...');
        obs.users.push({ id: 3, name: 'Charlie', active: true });
    }, 300);

    setTimeout(() => {
        console.log('Modifying user...');
        obs.users[0].active = false;
    }, 400);

    setTimeout(() => {
        unwatchConfig();
        unwatchUsers();
        console.log('Example 3 completed\n');
    }, 600);
}

/**
 * Example 4: Multiple watchers and immediate execution
 */
export function exampleMultipleWatchers() {
    console.log('=== Example 4: Multiple Watchers ===');
    
    const obs = new Observable({
        counter: 0,
        status: 'idle'
    }, {
        name: 'MultiWatchExample',
        watch: {
            // Watcher defined in options
            counter: {
                handler(newVal, oldVal) {
                    console.log(`Counter watcher: ${oldVal} -> ${newVal}`);
                    if (newVal > 5) {
                        this.status = 'high';
                    } else if (newVal > 0) {
                        this.status = 'active';
                    } else {
                        this.status = 'idle';
                    }
                },
                immediate: true
            }
        }
    });

    // Additional runtime watchers
    const unwatch1 = obs.$watch('status', (newVal, oldVal) => {
        console.log(`Status changed: ${oldVal} -> ${newVal}`);
    }, { immediate: true });

    const unwatch2 = obs.$watch('counter', (newVal) => {
        if (newVal % 2 === 0) {
            console.log(`Counter is even: ${newVal}`);
        }
    });

    // Make rapid changes
    let count = 0;
    const interval = setInterval(() => {
        count++;
        obs.counter = count;
        
        if (count >= 8) {
            clearInterval(interval);
            setTimeout(() => {
                unwatch1();
                unwatch2();
                console.log('Example 4 completed\n');
            }, 100);
        }
    }, 50);
}

/**
 * Example 5: Lifecycle hooks and utilities
 */
export function exampleLifecycleAndUtils() {
    console.log('=== Example 5: Lifecycle and Utilities ===');
    
    const obs = new Observable({
        name: 'Test Instance',
        value: 100
    }, {
        name: 'LifecycleExample',
        created() {
            console.log('✅ Observable created:', this._name);
        },
        updated() {
            console.log('🔄 Observable updated');
        },
        destroyed() {
            console.log('🗑️ Observable destroyed');
        }
    });

    // Use utility methods
    console.log('Initial data:', obs.getData());
    console.log('JSON representation:', obs.toJSON());
    console.log('Debug info:', obs._debug());

    // Check reactivity
    console.log('Is reactive:', observableUtils.isReactive(obs._data));

    // Set and delete operations
    setTimeout(() => {
        console.log('Using $set to add new property...');
        obs.$set(obs._data, 'newProp', 'new value');
        console.log('New data:', obs.getData());
    }, 100);

    setTimeout(() => {
        console.log('Using $delete to remove property...');
        obs.$delete(obs._data, 'value');
        console.log('After deletion:', obs.getData());
    }, 200);

    setTimeout(() => {
        console.log('Destroying observable...');
        obs.$destroy();
        console.log('Example 5 completed\n');
    }, 300);
}

/**
 * Example 6: Performance testing
 */
export function examplePerformanceTest() {
    console.log('=== Example 6: Performance Test ===');
    
    const obs = new Observable({
        counter: 0,
        data: {}
    }, {
        name: 'PerformanceTest'
    });

    let changeCount = 0;
    const unwatch = obs.$watch('counter', () => {
        changeCount++;
    });

    const startTime = performance.now();
    const iterations = 1000;

    console.log(`Starting performance test with ${iterations} iterations...`);

    // Batch updates
    for (let i = 0; i < iterations; i++) {
        obs.counter = i;
        obs.$set(obs.data, `key${i}`, `value${i}`);
    }

    setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`Performance test completed:`);
        console.log(`- Iterations: ${iterations}`);
        console.log(`- Changes detected: ${changeCount}`);
        console.log(`- Duration: ${duration.toFixed(2)}ms`);
        console.log(`- Average per change: ${(duration / iterations).toFixed(4)}ms`);
        console.log(`- Changes per second: ${Math.round(iterations / (duration / 1000))}`);
        
        unwatch();
        obs.$destroy();
        console.log('Example 6 completed\n');
    }, 100);
}

/**
 * Example 7: Array reactivity
 */
export function exampleArrayReactivity() {
    console.log('=== Example 7: Array Reactivity ===');
    
    const obs = new Observable({
        todos: [
            { id: 1, text: 'Learn Vue', done: false },
            { id: 2, text: 'Build Observable', done: true }
        ],
        numbers: [1, 2, 3, 4, 5]
    }, {
        name: 'ArrayExample',
        computed: {
            completedTodos() {
                return this.todos.filter(todo => todo.done);
            },
            totalSum() {
                return this.numbers.reduce((sum, num) => sum + num, 0);
            }
        }
    });

    // Watch arrays
    const unwatchTodos = obs.$watch('todos', (newVal) => {
        console.log(`Todos changed, total: ${newVal.length}, completed: ${obs.completedTodos.length}`);
    }, { deep: true });

    const unwatchSum = obs.$watch('totalSum', (newVal, oldVal) => {
        console.log(`Sum changed: ${oldVal} -> ${newVal}`);
    });

    // Array operations
    setTimeout(() => {
        console.log('Adding new todo...');
        obs.todos.push({ id: 3, text: 'Test Arrays', done: false });
    }, 100);

    setTimeout(() => {
        console.log('Completing first todo...');
        obs.todos[0].done = true;
    }, 200);

    setTimeout(() => {
        console.log('Adding number...');
        obs.numbers.push(6);
    }, 300);

    setTimeout(() => {
        console.log('Removing number...');
        obs.numbers.splice(0, 1);
    }, 400);

    setTimeout(() => {
        console.log('Final computed values:');
        console.log('- Completed todos:', obs.completedTodos.length);
        console.log('- Total sum:', obs.totalSum);
        
        unwatchTodos();
        unwatchSum();
        obs.$destroy();
        console.log('Example 7 completed\n');
    }, 600);
}

/**
 * Run all examples
 */
export function runAllObservableExamples() {
    console.log('🚀 Starting Observable Examples...\n');
    
    exampleBasicReactivity();
    
    setTimeout(() => exampleComputedProperties(), 1000);
    setTimeout(() => exampleDeepWatching(), 2000);
    setTimeout(() => exampleMultipleWatchers(), 3000);
    setTimeout(() => exampleLifecycleAndUtils(), 4000);
    setTimeout(() => examplePerformanceTest(), 5000);
    setTimeout(() => exampleArrayReactivity(), 6500);
    
    setTimeout(() => {
        console.log('🎉 All Observable examples completed!');
        console.log('\nAvailable utilities:');
        console.log('- window.Observable - Main class');
        console.log('- window.observableUtils - Utility functions');
        console.log('- ObservableExamples.* - Individual examples');
    }, 8000);
}

// Browser global access
if (typeof window !== 'undefined') {
    window.ObservableExamples = {
        exampleBasicReactivity,
        exampleComputedProperties,
        exampleDeepWatching,
        exampleMultipleWatchers,
        exampleLifecycleAndUtils,
        examplePerformanceTest,
        exampleArrayReactivity,
        runAllObservableExamples
    };
}

export {
    exampleBasicReactivity,
    exampleComputedProperties,
    exampleDeepWatching,
    exampleMultipleWatchers,
    exampleLifecycleAndUtils,
    examplePerformanceTest,
    exampleArrayReactivity,
    runAllObservableExamples
};