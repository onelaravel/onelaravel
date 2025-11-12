# Tài liệu yêu cầu Blade to JavaScript Compiler

## Tổng quan
Tài liệu này mô tả đầy đủ các yêu cầu cho việc compile từ Blade template sang JavaScript để sử dụng trong SPA (Single Page Application) context.

## 1. Cấu trúc View Object

### 1.1 Cấu trúc cơ bản
Mỗi view được compile thành một object JavaScript với cấu trúc:

```javascript
{
    render: function(__$spaViewData$__ = {}) {
        const __VIEW_ID__ = __$spaViewData$__.__VIEW_ID__ || SPA.View.generateViewId();
        // ... compiled content
    },
    init: function() {
        // ... init code from @onInit
    },
    destroy: function() {
        // ... destroy code
    },
    parent: 'layout.name', // từ @extends
    hasParent: true, // boolean
    sectionTypes: {
        'content': 'long',
        'title': 'short'
    },
    hasAwaitData: true, // boolean
    prerender: function(__$spaViewData$__ = {}) {
        // ... loading states
    }
}
```

### 1.2 Các thuộc tính
- **render**: Function chính để render view
- **init**: Function khởi tạo từ @onInit directive
- **destroy**: Function cleanup (tùy chọn)
- **parent**: Tên layout từ @extends directive
- **hasParent**: Boolean cho biết view có extend layout không
- **sectionTypes**: Object mapping section names với types ("short" hoặc "long")
- **hasAwaitData**: Boolean cho biết view có sử dụng @await directive không
- **prerender**: Function hiển thị loading states

## 2. Các Directive Blade cơ bản

### 2.1 Directive điều kiện

#### @if/@elseif/@else/@endif
```php
@if($user)
    <h1>Hello {{ $user->name }}</h1>
@elseif($guest)
    <h1>Welcome Guest</h1>
@else
    <h1>Please Login</h1>
@endif
```

**Output:**
```javascript
${SPA.View.execute(() => {
    if(user){
        return `
            <h1>Hello ${SPA.View.escString(user.name)}</h1>
        `;
    }
    else if(guest){
        return `
            <h1>Welcome Guest</h1>
        `;
    }else{
        return `
            <h1>Please Login</h1>
        `;
    }
    return '';
})}
```

### 2.2 Directive vòng lặp

#### @foreach
```php
@foreach($users as $id => $user)
    <li>{{ $id }}: {{ $user->name }}</li>
@endforeach
```

**Output:**
```javascript
${SPA.View.foreach(users, (user, id) => {
    return `
        <li>${SPA.View.escString(id)}: ${SPA.View.escString(user.name)}</li>
    `;
})}
```

```php
@foreach($users as $user)
    <li>{{ $user->name }}</li>
@endforeach
```

**Output:**
```javascript
${SPA.View.foreach(users, (user) => {
    return `
        <li>${SPA.View.escString(user.name)}</li>
    `;
})}
```

#### @for
```php
@for($i = 0; $i < 10; $i++)
    <span>Item {{ $i }}</span>
@endfor
```

**Output:**
```javascript

${SPA.View.execute(() => {
    let outputString = ``;
    for(let i = 0; i < 10; i++){
        outputString += `
            <span>Item ${SPA.View.escString(i)}</span>
        `;
    }
    return outputString;
})}

```

#### @while
```php
@while($condition)
    <p>Loop content</p>
@endwhile
```

**Output:**
```javascript
${SPA.View.execute(() => {
    let outputString = ``;
    while(condition){
        return `
            <p>Loop content</p>
        `;
    }
    return outputString;
})}
```

### 2.3 Directive khối

#### @php/@endphp
```php
@php
    $count = count($users);
    $total = $count * 2;
@endphp
```

**Output:**
```javascript

${SPA.View.execute(() => {
    count = SPA.View.count(users);
    total = count * 2;
    return '';
})}
```

#### @switch/@case/@default/@endswitch
```php
@switch($status)
    @case('active')
        <span class="active">Active</span>
        @break
    @case('inactive')
        <span class="inactive">Inactive</span>
        @break
    @default
        <span class="unknown">Unknown</span>
@endswitch
```

**Output:**
```javascript
${SPA.View.execute(() => {
    switch(status){
        case 'active':
            return `
                <span class="active">Active</span>
            `;
            break;
        case 'inactive':
            return `
                <span class="inactive">Inactive</span>
            `;
            break;
        default:
            return `
                <span class="unknown">Unknown</span>
            `;
            break;
    }
})}
```

## 3. Directive Layout

### 3.1 @extends
```php
@extends('layouts.app')
```

**Output:**
```javascript
this.parent = 'layouts.app';
return SPA.View.extendView('layouts.app');
```

#### @extends với data
```php
@extends('layouts.app', ['title' => 'Home', 'user' => $user])
```

**Output:**
```javascript
this.parent = 'layouts.app';
return SPA.View.extendView('layouts.app', {title: 'Home', user: user});
```

#### @extends với expression
```php
@extends($layout . 'base')
```

**Output:**
```javascript
this.parent = layout + 'base';
return SPA.View.extendView(this.parent);
```

### 3.2 @section/@endsection
```php
@section('content')
    <h1>{{ $title }}</h1>
    <p>{{ $content }}</p>
@endsection
```

**Output:**
```javascript
SPA.View.section('content', `
    <h1>${SPA.View.escString(title)}</h1>
    <p>${SPA.View.escString(content)}</p>
`);
```

#### Short section
```php
@section('title', $pageTitle)
```

**Output:**
```javascript
SPA.View.section('title', pageTitle);
```

### 3.3 @yield
```php
<h1>@yield('title')</h1>
<p>@yield('content', 'Default content')</p>
```

**Output:**
```javascript
<h1>${SPA.View.yield('title')}</h1>
<p>${SPA.View.yield('content', 'Default content')}</p>
```

## 4. Directive Include

### 4.1 @include
```php
@include('partials.header')
@include('partials.footer', ['year' => 2024])
```

**Output:**
```javascript
${SPA.View.include('partials.header', {})}
${SPA.View.include('partials.footer', {year: 2024})}
```

### 4.2 @includeIf
```php
@includeIf('partials.special', ['data' => $specialData])
```

**Output:**
```javascript
${SPA.View.includeIf('partials.special', {data: specialData})}
```

## 5. Directive tùy chỉnh

### 5.1 @vars
```php
@vars($users = [], $title = 'Test', $abc = 'ABC')
```

**Output:**
```javascript
const users = [];
const title = 'Test';
const abc = 'ABC';
```

#### @vars với arrays
```php
@vars($config = ['host' => 'localhost', 'port' => 3306], $items = [1, 2, 3])
```

**Output:**
```javascript
const config = {"host": "localhost", "port": 3306};
const items = [1, 2, 3];
```

### 5.2 @yieldAttr
```php
<div @yieldAttr('class', 'containerClass')>
    <input @yieldAttr('value', 'inputValue') @yieldAttr('placeholder', 'inputPlaceholder')>
</div>
```

**Output:**
```html
<div class="${SPA.View.yield('containerClass')}" spa-yield-attr="class:containerClass">
    <input value="${SPA.View.yield('inputValue')}" spa-yield-attr="value:inputValue" placeholder="${SPA.View.yield('inputPlaceholder')}" spa-yield-attr="placeholder:inputPlaceholder">
</div>
```

### 5.3 @subscribe

#### Simple syntax
```php
<div @subscribe('contentKey', 'content')>
    <span @subscribe('classKey', 'attr', 'class')>
</div>
```

**Output:**
```html
<div spa-yield-subscribe-key="contentKey" spa-yield-subscribe-target="content">
    <span spa-yield-subscribe-key="classKey" spa-yield-subscribe-target="attr" spa-yield-subscribe-attr="class">
</div>
```

#### Array syntax
```php
<div @subscribe(['class' => 'classKey', '#content' => 'contentKey', '#children' => 'childrenKey'])>
</div>
```

**Output:**
```html
<div spa-yield-attr="class:classKey" spa-yield-content="contentKey" spa-yield-children="childrenKey">
</div>
```

### 5.4 @onInit
```php
@onInit($__VIEW_ID__)
<script>
    SPA.query('.' + __VIEW_ID__).forEach(element => {
        console.log('Init', element);
    });
</script>
@endOnInit
```

**Output:**
```javascript
// Trong init function:
SPA.query('.' + __VIEW_ID__).forEach(element => {
    console.log('Init', element);
});
```

### 5.5 @await
```php
@await('client')
    <div>Loading...</div>
@endawait
```

**Output:**
- Directive bị loại bỏ hoàn toàn
- Tạo prerender function cho loading states

### 5.6 @serverside/@clientside
```php
@serverside
    <div>Server only content</div>
@endserverside

@clientside
    <div>Client only content</div>
@endclientside
```

**Output:**
```html
<!-- @serverside content bị loại bỏ -->
<div>Client only content</div>
```

## 6. Xử lý Output

### 6.1 Escaped output
```php
{{ $user->name }}
```

**Output:**
```javascript
${SPA.View.escString(user.name)}
```

### 6.2 Unescaped output
```php
{!! $htmlContent !!}
```

**Output:**
```javascript
${htmlContent}
```

### 6.3 Comments
```php
{{-- This is a comment --}}
```

**Output:**
```javascript
// Loại bỏ hoàn toàn
```

## 7. Xử lý PHP sang JavaScript

### 7.1 Biến và object
```php
$user->name
$errors->has('email')
$array['key']
```

**Output:**
```javascript
user.name
SPA.View.hasError('email')
array.key
```

### 7.2 Array conversion
```php
['a' => 1, 'b' => 2]  // Associative array
[1, 2, 3]            // Numeric array
```

**Output:**
```javascript
{"a": 1, "b": 2}     // Object
[1, 2, 3]           // Array
```

### 7.3 String concatenation
```php
$abc . 'def'
$test . $demo
```

**Output:**
```javascript
abc + 'def'
test + demo
```

### 7.4 Function calls
```php
count($array)
isset($var)
empty($value)
```

**Output:**
```javascript
SPA.View.count(array)
SPA.View.isset(var)
SPA.View.empty(value)
```

## 8. Xử lý Sections

### 8.1 Section Types
- **Short sections**: `@section('name', $value)` → `SPA.View.section('name', value);`
- **Long sections**: `@section('name') ... @endsection` → `SPA.View.section('name', `...`);`

### 8.2 Extended Views
- Tất cả sections được collect vào `sections` array
- Nội dung bên ngoài sections → `outerContent`
- Tự động tạo `SPA.View.section('content', outerContent)` nếu cần

### 8.3 Regular Views
- Sections được convert thành proper JavaScript syntax
- Multiple return statements được consolidate

## 9. Prerender Function

### 9.1 Có @await directive
```javascript
function(__$spaViewData$__ = {}) {
    const __VIEW_ID__ = __$spaViewData$__.__VIEW_ID__ || SPA.View.generateViewId();
    
    // Long sections show loading
    SPA.View.section('content', `<div class="spa-preloader" ref="${__VIEW_ID__}">${SPA.View.text('loading')}</div>`);
    
    return SPA.View.renderSections();
}
```

### 9.2 Không có @await directive
```javascript
function(__$spaViewData$__ = {}) {
    const __VIEW_ID__ = __$spaViewData$__.__VIEW_ID__ || SPA.View.generateViewId();
    return null;
}
```

## 10. Xử lý đặc biệt

### 10.1 Unique Loop Variables
- Tạo `__outputString` unique cho mỗi vòng lặp lồng nhau
- Tránh ghi đè biến trong nested loops

### 10.2 Error Handling
- Try-catch cho view loading
- Validation cho directive parameters
- Fallback cho missing functions

### 10.3 Special Characters
- Escape CSS selectors trong `querySelectorAll`
- Handle quotes trong string literals
- Proper escaping cho template literals

### 10.4 Multiscope Compilation
- Support multiple scopes (web, admin, spa)
- File-based scope management
- Merge scopes vào final output

## 11. Performance Requirements

### 11.1 Optimization
- Optimize regex patterns
- Minimize string operations
- Efficient array processing
- Memory management cho large templates

### 11.2 Caching
- Cache compiled results
- Incremental compilation
- Hot reload support

## 12. Error Messages

### 12.1 Directive Errors
- `@yieldAttr directive requires at least 2 parameters: attrKey and yieldKey`
- `@subscribe directive requires at least 2 parameters: yieldKey and targetKey`

### 12.2 Compilation Errors
- Syntax errors trong Blade template
- Missing closing directives
- Invalid parameter types

## 13. Testing Requirements

### 13.1 Unit Tests
- Test từng directive riêng biệt
- Test complex nested structures
- Test error cases

### 13.2 Integration Tests
- Test full compilation pipeline
- Test với real-world templates
- Test performance với large files

## 14. File Structure

```
compile.py              # Main compiler
build.py                # Build orchestrator
directive.md            # Directive examples
BLADE_TO_JS_COMPILER_REQUIREMENTS.md  # This document
```

## 15. Usage Examples

### 15.1 Basic Usage
```bash
python3 build.py web resources/views
```

### 15.2 Multiple Scopes
```bash
python3 build.py web resources/views
python3 build.py admin resources/views
python3 build.py spa resources/views
```

### 15.3 Output Files
- `public/static/spa/scopes/web.js` - Web scope
- `public/static/spa/scopes/admin.js` - Admin scope  
- `public/static/spa/spa.view.templates.js` - Final merged output

## 16. Future Enhancements

### 16.1 Planned Features
- TypeScript support
- Source maps
- Hot module replacement
- Advanced caching strategies

### 16.2 Performance Improvements
- Parallel compilation
- Incremental builds
- Tree shaking
- Code splitting

---

**Lưu ý**: Tài liệu này được cập nhật thường xuyên để phản ánh các thay đổi trong compiler. Vui lòng kiểm tra phiên bản mới nhất trước khi implement.
