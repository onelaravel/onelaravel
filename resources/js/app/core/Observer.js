/**
 * Simple Observer System
 * Uses existing Dep, Watcher classes with super simple API
 */

// Import/define Dep and Watcher classes first
class Dep {
    constructor() {
        this.id = ++Dep.uid;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    }

    depend() {
        if (Dep.target) {
            this.addSub(Dep.target);
            Dep.target.addDep(this);
        }
    }

    notify() {
        const subs = this.subs.slice();
        subs.forEach(sub => sub.update());
    }
}

Dep.target = null;
Dep.uid = 0;

class Watcher {
    constructor(vm, expOrFn, cb, options = {}) {
        this.vm = vm;
        this.id = ++Watcher.uid;
        this.cb = cb;
        this.options = options;
        this.active = true;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = expOrFn.toString();

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parsePath(expOrFn);
        }

        this.value = this.get();
    }

    get() {
        this.pushTarget();
        let value;
        try {
            value = this.getter.call(this.vm, this.vm);
        } finally {
            this.popTarget();
            this.cleanupDeps();
        }
        return value;
    }

    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }

    update() {
        const oldValue = this.value;
        this.value = this.get();
        if (this.value !== oldValue || typeof this.value === 'object') {
            this.cb.call(this.vm, this.value, oldValue);
        }
    }

    teardown() {
        if (this.active) {
            this.deps.forEach(dep => dep.removeSub(this));
            this.active = false;
        }
    }

    pushTarget() {
        this.targetStack = this.targetStack || [];
        this.targetStack.push(Dep.target);
        Dep.target = this;
    }

    popTarget() {
        Dep.target = this.targetStack.pop();
    }

    parsePath(path) {
        const segments = path.split('.');
        return function(obj) {
            for (let i = 0; i < segments.length; i++) {
                if (!obj) return;
                obj = obj[segments[i]];
            }
            return obj;
        };
    }
}

Watcher.uid = 0;

// Global registry for simple API
const globalDeps = new Map();
const globalWatchers = new Map();

/**
 * Create observable data - Super simple API using existing classes
 * @param {*} data - Any data to make reactive
 * @returns {Proxy} - Reactive proxy of the data
 */
function ob(data) {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    // Don't double-wrap already observable objects
    if (data.__isObservable) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return createArrayProxy(data);
    }

    // Handle objects
    return createObjectProxy(data);
}

/**
 * Create proxy for objects using Dep/Watcher system
 */
function createObjectProxy(obj) {
    // Create deps for each property
    const deps = new Map();
    
    // Make nested objects observable
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            obj[key] = ob(obj[key]);
        }
        // Create dep for this property
        deps.set(key, new Dep());
    });

    const proxy = new Proxy(obj, {
        get(target, key) {
            // Return raw data for JSON serialization
            if (key === 'toJSON') {
                return () => toRaw(target);
            }

            // Mark as observer
            if (key === '__isObservable') {
                return true;
            }

            // Track dependency access
            const dep = deps.get(key);
            if (dep && Dep.target) {
                dep.depend();
            }

            return target[key];
        },

        set(target, key, newValue) {
            const oldValue = target[key];
            
            // Make new objects reactive
            if (newValue && typeof newValue === 'object') {
                newValue = ob(newValue);
            }

            target[key] = newValue;

            // Create dep for new properties
            if (!deps.has(key)) {
                deps.set(key, new Dep());
            }

            // Notify watchers
            const dep = deps.get(key);
            if (dep) {
                dep.notify();
            }

            return true;
        }
    });

    // Mark as observer
    Object.defineProperty(proxy, '__isObservable', {
        value: true,
        enumerable: false,
        writable: false
    });

    return proxy;
}

/**
 * Create proxy for arrays using Dep/Watcher system
 */
function createArrayProxy(arr) {
    // Create dep for array
    const arrayDep = new Dep();
    const lengthDep = new Dep();
    
    // Make array items observable
    arr.forEach((item, index) => {
        if (item && typeof item === 'object') {
            arr[index] = ob(item);
        }
    });

    // Reactive array methods using existing Dep system
    const reactiveArrayMethods = {
        push(...items) {
            items.forEach((item, index) => {
                if (item && typeof item === 'object') {
                    items[index] = ob(item);
                }
            });
            const result = Array.prototype.push.apply(this, items);
            arrayDep.notify();
            lengthDep.notify();
            return result;
        },

        pop() {
            const result = Array.prototype.pop.call(this);
            arrayDep.notify();
            lengthDep.notify();
            return result;
        },

        shift() {
            const result = Array.prototype.shift.call(this);
            arrayDep.notify();
            lengthDep.notify();
            return result;
        },

        unshift(...items) {
            items.forEach((item, index) => {
                if (item && typeof item === 'object') {
                    items[index] = ob(item);
                }
            });
            const result = Array.prototype.unshift.apply(this, items);
            arrayDep.notify();
            lengthDep.notify();
            return result;
        },

        splice(start, deleteCount, ...items) {
            items.forEach((item, index) => {
                if (item && typeof item === 'object') {
                    items[index] = ob(item);
                }
            });
            const result = Array.prototype.splice.apply(this, [start, deleteCount, ...items]);
            arrayDep.notify();
            lengthDep.notify();
            return result;
        },

        sort(compareFn) {
            Array.prototype.sort.call(this, compareFn);
            arrayDep.notify();
            return this;
        },

        reverse() {
            Array.prototype.reverse.call(this);
            arrayDep.notify();
            return this;
        }
    };

    const proxy = new Proxy(arr, {
        get(target, key) {
            // Return raw data for JSON serialization
            if (key === 'toJSON') {
                return () => target.map(item => toRaw(item));
            }

            // Mark as observer
            if (key === '__isObservable') {
                return true;
            }

            // Return reactive array methods
            if (reactiveArrayMethods[key]) {
                return reactiveArrayMethods[key].bind(target);
            }

            // Track access
            if (key === 'length') {
                if (Dep.target) {
                    lengthDep.depend();
                }
            } else if (Dep.target) {
                arrayDep.depend();
            }

            return target[key];
        },

        set(target, key, newValue) {
            const oldValue = target[key];
            
            // Make new objects reactive
            if (newValue && typeof newValue === 'object') {
                newValue = ob(newValue);
            }

            target[key] = newValue;

            // Notify watchers
            if (key === 'length') {
                lengthDep.notify();
            } else {
                arrayDep.notify();
            }

            return true;
        }
    });

    return proxy;
}

/**
 * Watch function using existing Watcher class
 */
function watch(obj, path, callback, options = {}) {
    if (!obj || !obj.__isObservable) {
        console.warn('watch() can only be used with observer objects');
        return () => {};
    }

    // Parse path function
    const parsePath = (path) => {
        const segments = path.split('.');
        return function(obj) {
            for (let i = 0; i < segments.length; i++) {
                if (!obj) return;
                obj = obj[segments[i]];
            }
            return obj;
        };
    };

    // Create watcher using existing Watcher class
    const watcher = new Watcher(
        obj,
        () => parsePath(path)(obj),
        (newVal, oldVal) => callback(newVal, oldVal),
        options
    );

    // Store watcher for cleanup
    const watcherId = `${path}_${Date.now()}_${Math.random()}`;
    globalWatchers.set(watcherId, watcher);

    // Return unwatch function
    return function unwatch() {
        watcher.teardown();
        globalWatchers.delete(watcherId);
    };
}

/**
 * Get raw data without proxy
 */
function toRaw(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toRaw(item));
    }

    const raw = {};
    Object.keys(obj).forEach(key => {
        if (key !== '__isObservable') {
            raw[key] = toRaw(obj[key]);
        }
    });

    return raw;
}

/**
 * Check if object is observer
 */
function isObserver(obj) {
    return obj && typeof obj === 'object' && obj.__isObservable === true;
}

/**
 * Computed property helper using existing Watcher
 */
function computed(getter) {
    let value;
    let dirty = true;
    let watcher;

    const computedValue = () => {
        if (dirty) {
            // Create watcher for computed dependency tracking
            if (watcher) {
                watcher.teardown();
            }
            
            watcher = new Watcher(
                {},
                getter,
                () => { dirty = true; },
                { lazy: true }
            );
            
            value = watcher.get();
            dirty = false;
        }
        return value;
    };

    return computedValue;
}

// Export main functions
export { ob, watch, computed, toRaw, isObserver, Dep, Watcher };

// Global access
// if (typeof window !== 'undefined') {
//     window.ob = ob;
//     window.watch = watch;
//     window.computed = computed;
//     window.toRaw = toRaw;
//     window.isObserver = isObserver;
    
//     console.log(`
// 🌟 Simple Observer Ready! (Using Dep/Watcher classes)

// Usage:
//   const data = ob({ count: 0, items: [] })
  
//   watch(data, 'count', (newVal, oldVal) => {
//     console.log('Count changed:', newVal)
//   })
  
//   data.count = 5 // triggers watcher
//   data.items.push('new item') // triggers watcher
  
//   JSON.stringify(data) // clean output, no extra properties
//     `);
// }

/**
 * NOTE: Simple Observer System now uses Dep/Watcher classes.
 * This provides the simple API (ob, watch, computed) backed by robust Vue-like system.
 * No legacy code needed - everything above is the complete implementation.
 */