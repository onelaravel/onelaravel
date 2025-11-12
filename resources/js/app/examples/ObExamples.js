/**
 * Simple ob() function examples
 * Demonstrates the simple reactive object creation
 */

import { ob } from '../core/Observer.js';

/**
 * Example 1: Simple reactive object
 */
export function exampleSimpleOb() {
    console.log('=== Example: Simple ob() Usage ===');
    
    // Create reactive data - super simple!
    const data = ob({
        a: 1,
        b: 2,
        c: [1, 2, 3],
        user: {
            name: 'John',
            age: 25
        }
    });

    // Watch all changes
    const unwatch = data.$watch('change', (change) => {
        console.log('📊 Change detected:', {
            type: change.type,
            key: change.key,
            oldValue: change.oldValue,
            newValue: change.newValue
        });
    });

    // Watch specific property
    const unwatchA = data.$watch('change:a', (change) => {
        console.log('🎯 Property "a" changed:', change.oldValue, '->', change.newValue);
    });

    // Make changes - all reactive!
    setTimeout(() => {
        console.log('\n1. Changing data.a...');
        data.a = 10; // Triggers watchers
    }, 100);

    setTimeout(() => {
        console.log('\n2. Incrementing data.b...');
        data.b++; // Triggers watchers
    }, 200);

    setTimeout(() => {
        console.log('\n3. Array operations...');
        data.c.push(4); // Triggers watchers
        data.c.pop();   // Triggers watchers
    }, 300);

    setTimeout(() => {
        console.log('\n4. Nested object changes...');
        data.user.name = 'Jane'; // Triggers watchers
        data.user.age = 30;      // Triggers watchers
    }, 400);

    setTimeout(() => {
        console.log('\n5. Adding new property...');
        data.newProp = 'I am new!'; // Triggers watchers
    }, 500);

    setTimeout(() => {
        console.log('\n6. Deleting property...');
        delete data.b; // Triggers watchers
    }, 600);

    setTimeout(() => {
        console.log('\n7. JSON conversion (clean data):');
        console.log('JSON.stringify(data):', JSON.stringify(data));
        console.log('data.toJSON():', JSON.stringify(data.toJSON()));
        
        // Cleanup
        unwatch();
        unwatchA();
        console.log('\nSimple ob() example completed! ✅\n');
    }, 700);
}

/**
 * Example 2: Array operations
 */
export function exampleObArrays() {
    console.log('=== Example: ob() with Arrays ===');
    
    const data = ob({
        numbers: [1, 2, 3],
        todos: [
            { id: 1, text: 'Task 1', done: false },
            { id: 2, text: 'Task 2', done: true }
        ]
    });

    // Watch array changes
    const unwatch = data.$watch('change', (change) => {
        if (change.type === 'array') {
            console.log(`🔀 Array ${change.method}:`, change.args, '-> result:', change.result);
        } else {
            console.log('📊 Data change:', change.key, change.oldValue, '->', change.newValue);
        }
    });

    // Array operations
    setTimeout(() => {
        console.log('\n1. Push to array...');
        data.numbers.push(4, 5);
    }, 100);

    setTimeout(() => {
        console.log('\n2. Pop from array...');
        const popped = data.numbers.pop();
        console.log('Popped value:', popped);
    }, 200);

    setTimeout(() => {
        console.log('\n3. Splice array...');
        data.numbers.splice(1, 1, 99);
    }, 300);

    setTimeout(() => {
        console.log('\n4. Modify array item...');
        data.todos[0].done = true;
    }, 400);

    setTimeout(() => {
        console.log('\n5. Add new todo...');
        data.todos.push({ id: 3, text: 'New task', done: false });
    }, 500);

    setTimeout(() => {
        console.log('\n6. Sort array...');
        data.numbers.sort((a, b) => b - a);
    }, 600);

    setTimeout(() => {
        console.log('\nFinal state:');
        console.log('Numbers:', data.numbers);
        console.log('Todos:', data.todos);
        console.log('Clean JSON:', JSON.stringify(data.toJSON(), null, 2));
        
        unwatch();
        console.log('\nArray example completed! ✅\n');
    }, 700);
}

/**
 * Example 3: Complex nested operations
 */
export function exampleObNested() {
    console.log('=== Example: ob() Nested Objects ===');
    
    const data = ob({
        user: {
            profile: {
                name: 'John',
                email: 'john@example.com',
                preferences: {
                    theme: 'dark',
                    notifications: true
                }
            },
            posts: [
                { id: 1, title: 'First post', likes: 0 },
                { id: 2, title: 'Second post', likes: 5 }
            ]
        },
        settings: {
            app: {
                version: '1.0.0',
                features: ['feature1', 'feature2']
            }
        }
    });

    // Watch all changes
    let changeCount = 0;
    const unwatch = data.$watch('change', (change) => {
        changeCount++;
        console.log(`📊 Change #${changeCount}:`, {
            type: change.type,
            key: change.key,
            newValue: change.newValue
        });
    });

    // Deep nested changes
    setTimeout(() => {
        console.log('\n1. Deep nested property change...');
        data.user.profile.preferences.theme = 'light';
    }, 100);

    setTimeout(() => {
        console.log('\n2. Array operation in nested object...');
        data.user.posts.push({ id: 3, title: 'Third post', likes: 2 });
    }, 200);

    setTimeout(() => {
        console.log('\n3. Modify array item property...');
        data.user.posts[0].likes = 10;
    }, 300);

    setTimeout(() => {
        console.log('\n4. Add new nested object...');
        data.user.profile.social = {
            twitter: '@john',
            github: 'john-dev'
        };
    }, 400);

    setTimeout(() => {
        console.log('\n5. Array of strings operation...');
        data.settings.app.features.push('feature3');
        data.settings.app.features.splice(0, 1);
    }, 500);

    setTimeout(() => {
        console.log('\nFinal nested structure:');
        console.log('Clean JSON output:');
        console.log(JSON.stringify(data.toJSON(), null, 2));
        console.log(`\nTotal changes detected: ${changeCount}`);
        
        unwatch();
        console.log('\nNested example completed! ✅\n');
    }, 600);
}

/**
 * Example 4: Performance test with ob()
 */
export function exampleObPerformance() {
    console.log('=== Example: ob() Performance Test ===');
    
    const data = ob({
        counter: 0,
        items: [],
        stats: { total: 0, avg: 0 }
    });

    let changeCount = 0;
    const unwatch = data.$watch('change', () => {
        changeCount++;
    });

    const startTime = performance.now();
    const iterations = 1000;

    console.log(`Starting performance test with ${iterations} operations...`);

    // Rapid changes
    for (let i = 0; i < iterations; i++) {
        data.counter = i;
        data.items.push(i);
        data.stats.total = i * 2;
        
        if (i % 100 === 0) {
            data.stats.avg = data.stats.total / (i + 1);
        }
    }

    setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`\nPerformance Results:`);
        console.log(`- Operations: ${iterations * 3} (counter + push + stats)`);
        console.log(`- Changes detected: ${changeCount}`);
        console.log(`- Duration: ${duration.toFixed(2)}ms`);
        console.log(`- Avg per operation: ${(duration / (iterations * 3)).toFixed(4)}ms`);
        console.log(`- Operations per second: ${Math.round((iterations * 3) / (duration / 1000))}`);
        
        console.log(`\nFinal state:`);
        console.log(`- Counter: ${data.counter}`);
        console.log(`- Items length: ${data.items.length}`);
        console.log(`- Stats: ${JSON.stringify(data.stats)}`);
        
        unwatch();
        console.log('\nPerformance test completed! ✅\n');
    }, 100);
}

/**
 * Example 5: JSON serialization test
 */
export function exampleObSerialization() {
    console.log('=== Example: ob() JSON Serialization ===');
    
    const data = ob({
        string: 'hello',
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 2, { nested: 'value' }],
        object: {
            nested: {
                deep: {
                    value: 'found'
                }
            }
        },
        date: new Date(),
        regex: /test/g
    });

    console.log('\n1. Original reactive object:');
    console.log('typeof data:', typeof data);
    console.log('data.__isReactive:', data.__isReactive);

    console.log('\n2. JSON.stringify(data):');
    try {
        const jsonStr = JSON.stringify(data);
        console.log(jsonStr);
        
        // Parse back
        const parsed = JSON.parse(jsonStr);
        console.log('Parsed back:', parsed);
    } catch (e) {
        console.log('JSON.stringify error:', e.message);
    }

    console.log('\n3. data.toJSON():');
    const cleanData = data.toJSON();
    console.log('Clean data:', cleanData);
    console.log('typeof cleanData:', typeof cleanData);
    console.log('cleanData.__isReactive:', cleanData.__isReactive);

    console.log('\n4. JSON.stringify(data.toJSON()):');
    const cleanJsonStr = JSON.stringify(cleanData);
    console.log(cleanJsonStr);

    console.log('\n5. Verify no reactive properties in clean data:');
    function hasReactiveProps(obj, path = '') {
        if (!obj || typeof obj !== 'object') return false;
        
        for (const key in obj) {
            if (key.startsWith('__') || key.startsWith('$')) {
                console.log(`❌ Found reactive prop: ${path}.${key}`);
                return true;
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (hasReactiveProps(obj[key], `${path}.${key}`)) {
                    return true;
                }
            }
        }
        return false;
    }

    const hasReactive = hasReactiveProps(cleanData);
    console.log(hasReactive ? '❌ Clean data contains reactive properties' : '✅ Clean data has no reactive properties');

    console.log('\nSerialization example completed! ✅\n');
}

/**
 * Run all ob() examples
 */
export function runAllObExamples() {
    console.log('🚀 Starting ob() Examples...\n');
    
    exampleSimpleOb();
    
    setTimeout(() => exampleObArrays(), 1000);
    setTimeout(() => exampleObNested(), 2000);
    setTimeout(() => exampleObPerformance(), 3000);
    setTimeout(() => exampleObSerialization(), 4500);
    
    setTimeout(() => {
        console.log('🎉 All ob() examples completed!');
        console.log('\nAvailable in console:');
        console.log('- ob({ data }) - Create reactive object');
        console.log('- data.$watch(key, callback) - Watch changes');
        console.log('- data.toJSON() - Get clean data');
        console.log('- JSON.stringify(data) - Serialize reactive object');
    }, 6000);
}

// Browser global access
if (typeof window !== 'undefined') {
    window.ObExamples = {
        exampleSimpleOb,
        exampleObArrays,
        exampleObNested,
        exampleObPerformance,
        exampleObSerialization,
        runAllObExamples
    };
}

export {
    exampleSimpleOb,
    exampleObArrays,
    exampleObNested,
    exampleObPerformance,
    exampleObSerialization,
    runAllObExamples
};