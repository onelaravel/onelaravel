# Vue-like System Proposal

## Tổng quan
Tạo một hệ thống view giống Vue.js với:
- **Single File Components** (.vue files)
- **Reactive Data**
- **Lifecycle Hooks**
- **Computed Properties**
- **Methods**
- **Template Syntax**

## Vue-like Directive System

### 1. Directive `@component` (Vue-like)
```blade
@component('welcome')
    <template>
        <div class="welcome-container">
            <h1>{{ title }}</h1>
            <p>{{ message }}</p>
            <button @click="increment">Count: {{ count }}</button>
        </div>
    </template>
    
    <script>
        export default {
            data() {
                return {
                    title: 'Welcome',
                    message: 'Hello World',
                    count: 0
                }
            },
            
            computed: {
                doubleCount() {
                    return this.count * 2;
                }
            },
            
            methods: {
                increment() {
                    this.count++;
                }
            },
            
            mounted() {
                console.log('Component mounted');
            }
        }
    </script>
    
    <style scoped>
        .welcome-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
        }
    </style>
@endComponent
```

### 2. Directive `@vue` (Simplified)
```blade
@vue($__VIEW_ID__)
    <template>
        <div class="vue-demo">
            <h1>{{ title }}</h1>
            <input v-model="name" placeholder="Enter your name">
            <p>Hello, {{ name }}!</p>
            <button @click="greet">Greet</button>
        </div>
    </template>
    
    <script>
        return {
            data: {
                title: 'Vue-like Demo',
                name: ''
            },
            
            methods: {
                greet() {
                    alert(`Hello, ${this.name}!`);
                }
            },
            
            mounted() {
                console.log('Vue component mounted');
            }
        }
    </script>
    
    <style>
        .vue-demo {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
    </style>
@endVue
```

## Implementation

### 1. Vue-like Component Parser
```php
class VueComponentParser {
    public function parse($content) {
        $sections = $this->extractSections($content);
        
        return [
            'template' => $sections['template'] ?? '',
            'script' => $sections['script'] ?? '',
            'style' => $sections['style'] ?? '',
            'options' => $this->parseScript($sections['script'] ?? '')
        ];
    }
    
    private function extractSections($content) {
        $sections = [];
        
        // Extract template
        if (preg_match('/<template>(.*?)<\/template>/s', $content, $matches)) {
            $sections['template'] = trim($matches[1]);
        }
        
        // Extract script
        if (preg_match('/<script>(.*?)<\/script>/s', $content, $matches)) {
            $sections['script'] = trim($matches[1]);
        }
        
        // Extract style
        if (preg_match('/<style[^>]*>(.*?)<\/style>/s', $content, $matches)) {
            $sections['style'] = trim($matches[1]);
        }
        
        return $sections;
    }
    
    private function parseScript($script) {
        // Parse Vue-like script syntax
        $options = [];
        
        // Extract data function
        if (preg_match('/data\s*\(\s*\)\s*{\s*return\s*({.*?})\s*}/s', $script, $matches)) {
            $options['data'] = $this->parseObject($matches[1]);
        }
        
        // Extract methods
        if (preg_match('/methods\s*:\s*({.*?})/s', $script, $matches)) {
            $options['methods'] = $this->parseObject($matches[1]);
        }
        
        // Extract computed
        if (preg_match('/computed\s*:\s*({.*?})/s', $script, $matches)) {
            $options['computed'] = $this->parseObject($matches[1]);
        }
        
        return $options;
    }
}
```

### 2. Vue-like Template Compiler
```php
class VueTemplateCompiler {
    public function compile($template, $options) {
        // Convert Vue template syntax to JavaScript
        $compiled = $template;
        
        // Convert {{ }} to JavaScript expressions
        $compiled = preg_replace('/\{\{\s*(.*?)\s*\}\}/', '${$1}', $compiled);
        
        // Convert v-model to event handlers
        $compiled = preg_replace('/v-model="([^"]+)"/', 'value="${$1}" oninput="this.setData(\'$1\', this.value)"', $compiled);
        
        // Convert @click to onclick
        $compiled = preg_replace('/@click="([^"]+)"/', 'onclick="this.$1()"', $compiled);
        
        return $compiled;
    }
}
```

### 3. Vue-like JavaScript Runtime
```javascript
class VueLikeComponent {
    constructor(options) {
        this.data = options.data || {};
        this.methods = options.methods || {};
        this.computed = options.computed || {};
        this.lifecycle = {
            mounted: options.mounted || function() {},
            beforeDestroy: options.beforeDestroy || function() {}
        };
        
        this.reactiveData = this.makeReactive(this.data);
        this.setupComputed();
        this.setupMethods();
    }
    
    makeReactive(data) {
        const self = this;
        return new Proxy(data, {
            set(target, key, value) {
                target[key] = value;
                self.updateDOM();
                return true;
            }
        });
    }
    
    setData(key, value) {
        this.reactiveData[key] = value;
    }
    
    setupComputed() {
        Object.keys(this.computed).forEach(key => {
            Object.defineProperty(this.reactiveData, key, {
                get: () => this.computed[key].call(this),
                enumerable: true,
                configurable: true
            });
        });
    }
    
    setupMethods() {
        Object.keys(this.methods).forEach(key => {
            this[key] = this.methods[key].bind(this);
        });
    }
    
    updateDOM() {
        // Update DOM with reactive data
        this.render();
    }
    
    render() {
        // Render component
    }
}
```

## Vue-like Directives

### 1. Directive `@component`
```php
protected function registerComponentDirective(){
    Blade::directive('component', function ($expression) {
        $componentName = trim($expression, "'\"");
        return "<?php \$__env->startSection('component_{$componentName}'); ?>";
    });

    Blade::directive('endcomponent', function ($expression) {
        return "<?php \$__env->endSection(); \$__helper->compileComponent(\$__VIEW_ID__, \$__env->yieldContent('component_' . \$expression)); ?>";
    });
}
```

### 2. Directive `@vue`
```php
protected function registerVueDirective(){
    Blade::directive('vue', function ($expression) {
        return "<?php \$__env->startSection(\$__VIEW_ID__ . '_vue'); ?>";
    });

    Blade::directive('endvue', function ($expression) {
        return "<?php \$__env->endSection(); \$__helper->compileVue(\$__VIEW_ID__, \$__env->yieldContent('{\$__VIEW_ID__}_vue')); ?>";
    });
}
```

## Vue-like Template Syntax

### 1. Interpolation
```blade
<!-- Vue syntax -->
<h1>{{ title }}</h1>
<p>{{ message }}</p>

<!-- Compiled to -->
<h1>${title}</h1>
<p>${message}</p>
```

### 2. Directives
```blade
<!-- Vue syntax -->
<input v-model="name">
<button @click="submit">Submit</button>
<div v-if="show">Content</div>

<!-- Compiled to -->
<input value="${name}" oninput="this.setData('name', this.value)">
<button onclick="this.submit()">Submit</button>
<div style="display: ${show ? 'block' : 'none'}">Content</div>
```

### 3. Computed Properties
```blade
<!-- Vue syntax -->
<p>Double count: {{ doubleCount }}</p>

<!-- Compiled to -->
<p>Double count: ${doubleCount}</p>
```

## Usage Examples

### 1. Simple Vue-like Component
```blade
@vue($__VIEW_ID__)
    <template>
        <div class="counter">
            <h2>{{ title }}</h2>
            <p>Count: {{ count }}</p>
            <button @click="increment">+</button>
            <button @click="decrement">-</button>
        </div>
    </template>
    
    <script>
        return {
            data: {
                title: 'Counter',
                count: 0
            },
            
            methods: {
                increment() {
                    this.count++;
                },
                
                decrement() {
                    this.count--;
                }
            },
            
            mounted() {
                console.log('Counter mounted');
            }
        }
    </script>
    
    <style>
        .counter {
            text-align: center;
            padding: 20px;
        }
        
        .counter button {
            margin: 0 10px;
            padding: 10px 20px;
        }
    </style>
@endVue
```

### 2. Form Component
```blade
@vue($__VIEW_ID__)
    <template>
        <form @submit="handleSubmit">
            <input v-model="form.name" placeholder="Name">
            <input v-model="form.email" placeholder="Email">
            <button type="submit">Submit</button>
        </form>
    </template>
    
    <script>
        return {
            data: {
                form: {
                    name: '',
                    email: ''
                }
            },
            
            methods: {
                handleSubmit(e) {
                    e.preventDefault();
                    console.log('Form submitted:', this.form);
                }
            }
        }
    </script>
@endVue
```

## Benefits

1. **Familiar Syntax**: Giống Vue.js
2. **Reactive**: Data binding tự động
3. **Component-based**: Tái sử dụng components
4. **Lifecycle**: Hooks như Vue
5. **Performance**: Optimized rendering
6. **Developer Experience**: Dễ học và sử dụng

## Implementation Priority

1. **Phase 1**: Basic Vue-like syntax ({{ }}, v-model, @click)
2. **Phase 2**: Component system (@component)
3. **Phase 3**: Reactive data system
4. **Phase 4**: Computed properties
5. **Phase 5**: Advanced features (v-if, v-for, etc.)
