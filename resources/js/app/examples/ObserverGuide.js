/**
 * 📚 Hướng Dẫn Sử Dụng Observer System: ob() và watch()
 * 
 * File này giải thích chi tiết cách sử dụng và cách hoạt động của hệ thống Observer
 */

import { ob, watch, computed, toRaw, isObserver } from '../core/Observer.js';

console.log('=== 📚 HƯỚNG DẪN SỬ DỤNG OBSERVER SYSTEM ===\n');

// ============================================================================
// 📖 PHẦN 1: CÁCH SỬ DỤNG CƠ BẢN
// ============================================================================

console.log('1️⃣ === CÁCH SỬ DỤNG CƠ BẢN ===');

/**
 * 🎯 Bước 1: Tạo Observer Object với ob()
 */
console.log('\n📋 Tạo observer object:');
const data = ob({
    name: 'John',
    age: 25,
    hobbies: ['reading', 'coding'],
    profile: {
        email: 'john@example.com',
        skills: ['JavaScript', 'React']
    }
});

console.log('✅ Đã tạo observer:', { data });
console.log('✅ Kiểm tra isObserver:', isObserver(data));

/**
 * 🎯 Bước 2: Watch Changes với watch()
 */
console.log('\n👀 Thiết lập watchers:');

// Watch simple property
const unwatchName = watch(data, 'name', (newVal, oldVal) => {
    console.log(`📝 Name changed: "${oldVal}" → "${newVal}"`);
});

// Watch nested property
const unwatchEmail = watch(data, 'profile.email', (newVal, oldVal) => {
    console.log(`📧 Email changed: "${oldVal}" → "${newVal}"`);
});

// Watch array
const unwatchHobbies = watch(data, 'hobbies', (newVal, oldVal) => {
    console.log(`🎯 Hobbies changed:`, newVal);
});

/**
 * 🎯 Bước 3: Thực hiện thay đổi để trigger watchers
 */
console.log('\n🔄 Thực hiện thay đổi:');

setTimeout(() => {
    console.log('\n--- Changing name ---');
    data.name = 'Jane';  // Triggers name watcher
}, 100);

setTimeout(() => {
    console.log('\n--- Changing email ---');
    data.profile.email = 'jane@example.com';  // Triggers email watcher
}, 200);

setTimeout(() => {
    console.log('\n--- Adding hobby ---');
    data.hobbies.push('gaming');  // Triggers hobbies watcher
}, 300);

setTimeout(() => {
    console.log('\n--- Removing hobby ---');
    data.hobbies.pop();  // Triggers hobbies watcher
}, 400);

// ============================================================================
// 📖 PHẦN 2: CÁCH HOẠT ĐỘNG BÊN TRONG
// ============================================================================

setTimeout(() => {
    console.log('\n\n2️⃣ === CÁCH HOẠT ĐỘNG BÊN TRONG ===');
    
    console.log('\n🔍 Cơ chế hoạt động:');
    console.log(`
📊 ARCHITECTURE:
┌─────────────────────────────────────────────────────────────┐
│                    Observer System                          │
├─────────────────────────────────────────────────────────────┤
│  ob(data)  →  Proxy Wrapper  →  Dep/Watcher Classes        │
│     ↓              ↓                    ↓                   │
│  Reactive     Track Access      Dependency Tracking        │
│   Object       & Changes         & Notifications          │
└─────────────────────────────────────────────────────────────┘

🔄 FLOW:
1. ob(data) → Tạo Proxy wrapper cho object
2. watch(obj, path, callback) → Tạo Watcher instance  
3. Access property → Proxy get() → Dep.depend() → Track dependency
4. Change property → Proxy set() → Dep.notify() → Trigger watchers
5. Watcher.update() → Execute callback với newVal, oldVal

🏗️ COMPONENTS:
• Dep: Dependency tracking system (subscribers)
• Watcher: Observer pattern implementation  
• Proxy: Intercept get/set operations
• ob(): Simple API wrapper cho Dep/Watcher
    `);
}, 500);

// ============================================================================
// 📖 PHẦN 3: EXAMPLES NÂNG CAO
// ============================================================================

setTimeout(() => {
    console.log('\n\n3️⃣ === EXAMPLES NÂNG CAO ===');
    
    // Example 1: Computed Properties
    console.log('\n🧮 Computed Properties:');
    const user = ob({
        firstName: 'John',
        lastName: 'Doe',
        items: [10, 20, 30]
    });
    
    const fullName = computed(() => {
        console.log('  🔄 Computing fullName...');
        return `${user.firstName} ${user.lastName}`;
    });
    
    const total = computed(() => {
        console.log('  🔄 Computing total...');
        return user.items.reduce((sum, item) => sum + item, 0);
    });
    
    console.log('Initial computed values:');
    console.log('📛 Full Name:', fullName());
    console.log('💰 Total:', total());
    
    setTimeout(() => {
        console.log('\n--- Changing firstName ---');
        user.firstName = 'Jane';
        console.log('📛 Full Name (recomputed):', fullName());
        console.log('💰 Total (cached):', total());
    }, 100);
    
    setTimeout(() => {
        console.log('\n--- Adding item ---');
        user.items.push(40);
        console.log('📛 Full Name (cached):', fullName());
        console.log('💰 Total (recomputed):', total());
    }, 200);
    
}, 1000);

setTimeout(() => {
    // Example 2: Array Operations
    console.log('\n\n🗂️ Array Operations:');
    const todoList = ob({
        todos: [
            { id: 1, text: 'Learn Observer Pattern', done: false },
            { id: 2, text: 'Build App', done: false }
        ]
    });
    
    watch(todoList, 'todos', (newVal) => {
        console.log(`📋 Todo list updated: ${newVal.length} items`);
        newVal.forEach((todo, index) => {
            console.log(`  ${index + 1}. ${todo.text} ${todo.done ? '✅' : '⏳'}`);
        });
    });
    
    setTimeout(() => {
        console.log('\n--- Adding todo ---');
        todoList.todos.push({ id: 3, text: 'Test Everything', done: false });
    }, 100);
    
    setTimeout(() => {
        console.log('\n--- Completing first todo ---');
        todoList.todos[0].done = true;
    }, 200);
    
    setTimeout(() => {
        console.log('\n--- Removing completed todos ---');
        todoList.todos = todoList.todos.filter(todo => !todo.done);
    }, 300);
    
}, 1500);

setTimeout(() => {
    // Example 3: Performance Test
    console.log('\n\n⚡ Performance Test:');
    const perfData = ob({ counter: 0, updates: 0 });
    
    let changeCount = 0;
    watch(perfData, 'counter', () => {
        changeCount++;
    });
    
    const iterations = 1000;
    const startTime = performance.now();
    
    console.log(`Testing ${iterations} rapid updates...`);
    for (let i = 0; i < iterations; i++) {
        perfData.counter = i;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    setTimeout(() => {
        console.log('📊 Performance Results:');
        console.log(`  • Updates: ${iterations}`);
        console.log(`  • Changes detected: ${changeCount}`);
        console.log(`  • Duration: ${duration.toFixed(2)}ms`);
        console.log(`  • Average: ${(duration/iterations).toFixed(4)}ms per update`);
        console.log(`  • Speed: ${Math.round(iterations/(duration/1000))} updates/sec`);
    }, 100);
    
}, 2000);

// ============================================================================
// 📖 PHẦN 4: BEST PRACTICES
// ============================================================================

setTimeout(() => {
    console.log('\n\n4️⃣ === BEST PRACTICES ===');
    
    console.log(`
💡 BEST PRACTICES:

1. 🎯 CREATING OBSERVERS:
   ✅ const data = ob({ user: { name: 'John' } })
   ❌ const data = ob(null) // Won't work
   ❌ const data = ob('string') // Won't work

2. 👀 WATCHING CHANGES:
   ✅ watch(data, 'user.name', callback)
   ✅ watch(data, 'items', callback)  
   ❌ watch(data, 'nonexistent', callback) // No error but won't trigger

3. 🧮 COMPUTED PROPERTIES:
   ✅ const computed = computed(() => data.a + data.b)
   ✅ Always call computed() to get value
   ❌ Don't store computed result in variable

4. 🔄 UNSUBSCRIBING:
   ✅ const unwatch = watch(data, 'prop', callback)
   ✅ unwatch() // Clean up when done
   ❌ Forgetting to unsubscribe causes memory leaks

5. 📊 JSON SERIALIZATION:
   ✅ JSON.stringify(data) // Clean output
   ✅ toRaw(data) // Get raw object
   ❌ Don't access internal __isObservable property

6. 🏗️ NESTED OBJECTS:
   ✅ Automatic deep reactivity
   ✅ data.user.profile.email = 'new@email.com' // Works
   ✅ data.items.push(newItem) // Works

7. ⚡ PERFORMANCE:
   ✅ Batch multiple changes when possible
   ✅ Use computed for derived values
   ❌ Don't create observers in loops
   ❌ Don't watch too many granular properties
    `);
    
}, 2500);

// ============================================================================
// 📖 PHẦN 5: COMMON PATTERNS
// ============================================================================

setTimeout(() => {
    console.log('\n\n5️⃣ === COMMON PATTERNS ===');
    
    // Pattern 1: State Management
    console.log('\n🗄️ Pattern 1: State Management');
    const appState = ob({
        user: null,
        loading: false,
        error: null,
        data: []
    });
    
    // Watch loading state
    watch(appState, 'loading', (isLoading) => {
        console.log(`🔄 Loading: ${isLoading ? 'ON' : 'OFF'}`);
    });
    
    // Watch errors
    watch(appState, 'error', (error) => {
        if (error) {
            console.log(`❌ Error: ${error}`);
        }
    });
    
    // Simulate API call
    setTimeout(() => {
        appState.loading = true;
        setTimeout(() => {
            appState.user = { name: 'John', id: 1 };
            appState.loading = false;
            console.log(`✅ User loaded: ${appState.user.name}`);
        }, 100);
    }, 100);
    
    // Pattern 2: Form Validation
    console.log('\n📝 Pattern 2: Form Validation');
    const form = ob({
        email: '',
        password: '',
        errors: {}
    });
    
    watch(form, 'email', (email) => {
        if (email && !email.includes('@')) {
            form.errors.email = 'Invalid email format';
        } else {
            delete form.errors.email;
        }
        console.log(`📧 Email validation: ${email} → ${form.errors.email || 'Valid'}`);
    });
    
    setTimeout(() => {
        form.email = 'invalid-email';
        setTimeout(() => {
            form.email = 'valid@email.com';
        }, 100);
    }, 300);
    
}, 3000);

setTimeout(() => {
    console.log('\n\n6️⃣ === DEBUGGING TIPS ===');
    
    console.log(`
🐛 DEBUGGING TIPS:

1. 🔍 CHECK IF OBJECT IS OBSERVER:
   console.log(isObserver(data)) // Should be true

2. 👀 VERIFY WATCHER SETUP:
   const unwatch = watch(data, 'prop', (newVal, oldVal) => {
     console.log('Watcher triggered:', newVal, oldVal)
   })

3. 📊 INSPECT RAW DATA:
   console.log(toRaw(data)) // See original data structure

4. 🎯 TEST PROPERTY ACCESS:
   console.log(data.prop) // Should trigger dependency tracking

5. 🔄 VERIFY CHANGES:
   data.prop = 'new value' // Should trigger watchers

6. 📝 LOG COMPUTED EXECUTION:
   const computed = computed(() => {
     console.log('Computing...') // Debug computed calls
     return data.a + data.b
   })

7. 🧹 CLEAN UP WATCHERS:
   unwatch() // Prevent memory leaks
    `);
    
    console.log('\n🎉 === HƯỚNG DẪN HOÀN TẤT ===');
    console.log('Bạn đã hiểu cách sử dụng Observer System với ob() và watch()!');
    
}, 3500);

// Export for testing
export {
    // Re-export core functions for convenience
    ob, watch, computed, toRaw, isObserver
};