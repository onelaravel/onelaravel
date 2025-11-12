# 📚 Tài Liệu Custom Directives - One Laravel

**Ngày cập nhật**: 2025-01-27

Tài liệu này mô tả chi tiết tất cả các custom directives trong One Laravel, bao gồm cách sử dụng trong Blade template và đầu ra JavaScript sau khi compile.

---

## 📋 Mục Lục

1. [State Management Directives](#1-state-management-directives)
2. [Binding Directives](#2-binding-directives)
3. [Event Directives](#3-event-directives)
4. [Reactive Directives](#4-reactive-directives)
5. [Template Directives](#5-template-directives)
6. [Block Directives](#6-block-directives)
7. [Server/Client Side Directives](#7-serverclient-side-directives)
8. [Lifecycle Directives](#8-lifecycle-directives)
9. [Resource Directives](#9-resource-directives)

---

## 1. State Management Directives

### 1.1. `@vars` - Khai báo variables nhận từ data

**Mục đích**: Khai báo **MỘT LẦN** ở đầu file để khai báo các biến sẽ nhận từ controller (SSR) hoặc data khi gọi API (client).

**Cú pháp Blade**:
```blade
{{-- Khai báo MỘT LẦN ở đầu file --}}
@vars($user, $posts = [], $count = 0)
```

**Đầu ra PHP**:
```php
<?php if (!isset($user) || empty($user)) $user = null; ?>
<?php if (!isset($posts) || empty($posts)) $posts = []; ?>
<?php if (!isset($count) || empty($count)) $count = 0; ?>
<?php $__helper->addViewData($__VIEW_PATH__, $__VIEW_ID__, ['user' => $user, 'posts' => $posts, 'count' => $count]); ?>
```

**Đầu ra JavaScript**:
```javascript
// Variables được destructure từ __$spaViewData$__
let {user, posts = [], count = 0} = __$spaViewData$__ || {};

export function ViewName($$$DATA$$$ = {}, systemData = {}) {
    // Variables đã được khai báo và sẵn sàng sử dụng
    // $$$DATA$$$ được truyền vào sẽ được destructure vào các variables này
}
```

**Cách truyền data:**

**Server-Side Rendering (SSR)**:
```php
// Trong Controller
return view('profile')->with([
    'user' => $user,
    'posts' => $posts,
    'count' => 100
]);
```

**Client-Side Rendering**:
```javascript
// Gọi API và render view
const data = await fetch('/api/profile').then(r => r.json());
ViewEngine.render('profile', {
    user: data.user,
    posts: data.posts,
    count: data.count
});
```

**Ví dụ sử dụng**:
```blade
@vars($user, $posts = [], $count = 0)

<div>
    <h1>Welcome {{ $user->name ?? 'Guest' }}</h1>
    <p>Posts: {{ count($posts) }}</p>
    <p>Count: {{ $count }}</p>
</div>
```

**Lưu ý:**
- Chỉ khai báo **MỘT LẦN** ở đầu file
- Tất cả variables trong `@vars` sẽ được destructure từ data được truyền vào view
- Có thể set giá trị mặc định với `=` (ví dụ: `$posts = []`)

---

### 1.2. `@let` - Khai báo biến local

**Mục đích**: Khai báo biến local trong view, hỗ trợ destructuring.

**Cú pháp Blade**:
```blade
@let($count = 0)
@let($name = 'John', $age = 25)
@let([$count, $setCount] = useState(0))
@let({$name, $email} = $user)
```

**Đầu ra PHP**:
```php
<?php $count = 0; ?>
<?php $name = 'John'; $age = 25; ?>
<?php [$count, $setCount] = useState(0); ?>
<?php ['name' => $name, 'email' => $email] = (array) $user; ?>
```

**Đầu ra JavaScript**:
```javascript
// Variables được khai báo trong view scope (ngoài render function)
const count = 0;
const name = 'John';
const age = 25;
const [count, setCount] = useState(0);
const {name, email} = user;

// Trong render function, variables đã có sẵn trong scope
render: function() {
    // Có thể sử dụng count, name, age trực tiếp
}
```

**Ví dụ sử dụng**:
```blade
@let([$count, $setCount] = useState(0))

<div>
    <p>Count: {{ $count }}</p>
    <button @click($setCount($count + 1))>Increment</button>
</div>
```

---

### 1.3. `@const` - Khai báo hằng số

**Mục đích**: Khai báo hằng số trong view.

**Cú pháp Blade**:
```blade
@const(MAX_COUNT = 100)
@const(API_URL = 'https://api.example.com')
```

**Đầu ra PHP**:
```php
<?php const MAX_COUNT = 100; ?>
<?php const API_URL = 'https://api.example.com'; ?>
```

**Đầu ra JavaScript**:
```javascript
// Constants được khai báo trong view scope
const MAX_COUNT = 100;
const API_URL = 'https://api.example.com';

// Trong render function, constants đã có sẵn trong scope
render: function() {
    // Có thể sử dụng MAX_COUNT, API_URL trực tiếp
}
```

**Ví dụ sử dụng**:
```blade
@const(MAX_COUNT = 100)

<div>
    @if($count < MAX_COUNT)
        <p>Count is below maximum</p>
    @endif
</div>
```

---

### 1.4. `@useState` - React-like State Management

**Mục đích**: Khai báo state với setter function, tương tự React hooks. **Yêu cầu 3 tham số**: giá trị khởi tạo, tên state variable, tên setter function.

**Cú pháp Blade**:
```blade
@useState(0, $count, $setCount)
@useState('', $name, $setName)
@useState([], $items, $setItems)
@useState(0, 'count', 'setCount')  // Có thể dùng string thay vì variable
```

**Đầu ra PHP**:
```php
<?php [$count, $setCount] = useState(0); ?>
<?php [$name, $setName] = useState(''); ?>
<?php [$items, $setItems] = useState([]); ?>
```

**Đầu ra JavaScript**:
```javascript
// useState được khai báo trong view scope
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [items, setItems] = useState([]);

// Trong render function, state variables đã có sẵn trong scope
render: function() {
    // Có thể sử dụng count, name, items, setCount, setName, setItems trực tiếp
}
```

**Ví dụ sử dụng**:
```blade
@useState(0, $count, $setCount)

<div>
    <p>Count: {{ $count }}</p>
    <button @click($setCount($count + 1))>Increment</button>
    <button @click($setCount($count - 1))>Decrement</button>
</div>
```

**Lưu ý**: 
- `@useState` yêu cầu đúng 3 tham số: `@useState(initialValue, stateName, setterName)`
- Được compile thành JavaScript `useState` hook và tự động được quản lý bởi `View.State`
- Nếu thiếu tham số, directive sẽ bị bỏ qua với comment warning

---

## 2. Binding Directives

### 2.1. `@val` / `@bind` - Two-way Data Binding

**Mục đích**: Tạo two-way data binding giữa element và state. `@val` và `@bind` là aliases của nhau.

**Cú pháp Blade**:
```blade
<input @val($username) type="text">
<input @bind($email) type="email">
<input @val($user['name']) type="text">
<input @val($userState->name) type="text">
```

**Đầu ra PHP**:
```php
<input data-binding="username" type="text">
<input data-binding="email" type="email">
<input data-binding="user.name" type="text">
<input data-binding="userState.name" type="text">
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
<input data-binding="username" type="text">
<input data-binding="email" type="email">
<input data-binding="user.name" type="text">
<input data-binding="userState.name" type="text">

// Hệ thống tự động bind khi hydrate
```

**Ví dụ sử dụng**:
```blade
@let([$username, $setUsername] = useState(''))

<div>
    <input @val($username) type="text" placeholder="Username">
    <p>Current username: {{ $username }}</p>
</div>
```

**Lưu ý**: 
- `@val` và `@bind` hoàn toàn giống nhau, chỉ khác tên
- Hỗ trợ nested properties: `$user['name']` → `user.name`, `$userState->name` → `userState.name`
- Hỗ trợ nested parentheses: `@val($user->getData()['name'])`

---

## 3. Event Directives

### 3.1. Event Directives Overview

One Laravel hỗ trợ hơn 80 DOM events. Tất cả đều sử dụng cú pháp `@eventName(handler)`.

**Các event phổ biến**:
- `@click` - Click event
- `@change` - Change event
- `@input` - Input event
- `@submit` - Submit event
- `@focus` - Focus event
- `@blur` - Blur event
- `@keyup` - Keyup event
- `@keydown` - Keydown event
- `@mouseover` - Mouseover event
- `@mouseout` - Mouseout event
- Và nhiều events khác...

### 3.2. Simple Event Handlers

**Cú pháp Blade**:
```blade
<button @click(handleClick())>Click me</button>
<button @click(handleClick(@event))>Click with event</button>
<input @change(handleChange(@event))>
```

**Đầu ra PHP**:
```php
<button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'handleClick', 'params' => []]]); ?>>Click me</button>
<button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'handleClick', 'params' => ["@EVENT"]]]); ?>>Click with event</button>
<input <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'change', [['handler' => 'handleChange', 'params' => ["@EVENT"]]]); ?>>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function - events được add vào attributes
render: function() {
    return `
        <button ${this.__addEventConfig("click", [{"handler":"handleClick","params":[]}])}>Click me</button>
        <button ${this.__addEventConfig("click", [{"handler":"handleClick","params":["@EVENT"]}])}>Click with event</button>
        <input ${this.__addEventConfig("change", [{"handler":"handleChange","params":["@EVENT"]}])}>
    `;
}

// Khi hydrate, hệ thống scan và add event listeners
// Config được lưu trong view data và được xử lý bởi ViewEngine
```

**Lưu ý**: Tất cả event directives đều sử dụng `addEventListener` với config array format, không còn dùng `addEventQuickHandle`.

### 3.3. State Setter Events

**Cú pháp Blade**:
```blade
@let([$count, $setCount] = useState(0))

<button @click($setCount($count + 1))>Increment</button>
<button @click($count++)>Increment (++)</button>
<button @click($count += 10)>Add 10</button>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
render: function() {
    return `
        <button ${this.__addEventConfig("click", [(event) => setCount(count + 1)])}>Increment</button>
        <button ${this.__addEventConfig("click", [() => count++])}>Increment (++)</button>
        <button ${this.__addEventConfig("click", [() => count += 10])}>Add 10</button>
    `;
}
```

### 3.4. Multiple Handlers

**Cú pháp Blade**:
```blade
<button @click($count++; handleClick(@event); logCount($count))>Multiple Actions</button>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
render: function() {
    return `
        <button ${this.__addEventConfig("click", [
            () => count++,
            {"handler":"handleClick","params":["@EVENT"]},
            {"handler":"logCount","params":[() => count]}
        ])}>Multiple Actions</button>
    `;
}
```

### 3.5. Complex Event Handlers với Nested Functions

**Cú pháp Blade**:
```blade
<button @click(nestedCall(outerFunc($count, @event), innerFunc(@attr('type'))))>Complex</button>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
render: function() {
    return `
        <button ${this.__addEventConfig("click", [{
            "handler": "nestedCall",
            "params": [
                {
                    "handler": "outerFunc",
                    "params": [() => count, "@EVENT"]
                },
                {
                    "handler": "innerFunc",
                    "params": ["#ATTR:type"]
                }
            ]
        }])}>Complex</button>
    `;
}
```

### 3.6. Special Parameters

**Các tham số đặc biệt**:
- `@event` / `@Event` / `@EVENT` → `"@EVENT"` (sẽ được thay thế bằng event object khi runtime)
- `@attr('name')` → `"#ATTR:name"` (lấy attribute value)
- `@prop('name')` → `"#PROP:name"` (lấy property value)
- `@val('name')` / `@value('name')` → `"#VALUE:name"` (lấy binding value)

**Cú pháp Blade**:
```blade
<button @click(handleClick(@event, @attr('data-id'), @prop('value')))>Click</button>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
render: function() {
    return `
        <button ${this.__addEventConfig("click", [{
            "handler": "handleClick",
            "params": ["@EVENT", "#ATTR:data-id", "#PROP:value"]
        }])}>Click</button>
    `;
}
```

**Ví dụ sử dụng**:
```blade
@let([$count, $setCount] = useState(0))

<div>
    <button @click($setCount($count + 1))>Increment</button>
    <button @click(handleClick(@event, $count))>Handle Click</button>
    <button @click($count++; $setCount($count * 2), logCount($count))>Complex</button>
</div>
```

---

## 4. Subscription Configuration Directives

### 4.1. `@subscribe` / `@dontsubscribe` - Config Auto Re-render Behavior

**Mục đích**: Khai báo **MỘT LẦN** ở đầu file để cấu hình subscription behavior cho toàn bộ view. Điều khiển xem view có tự động re-render khi state thay đổi hay không.

**Cú pháp Blade**:
```blade
{{-- Khai báo MỘT LẦN ở đầu file, thường ngay sau @vars --}}

{{-- 1. Subscribe tất cả states (mặc định nếu có @vars/@let/@useState) --}}
@subscribe(@all)
@subscribe(true)

{{-- 2. Subscribe một state cụ thể --}}
@subscribe($count)

{{-- 3. Subscribe nhiều states --}}
@subscribe($count, $name)
@subscribe([$count, $name, $email])

{{-- 4. KHÔNG subscribe (view không tự động re-render) --}}
@subscribe(false)
@dontsubscribe
```

**Đầu ra JavaScript**:
```javascript
// Trong view configuration
export function ViewName($$$DATA$$$ = {}, systemData = {}) {
    // ...variable declarations...
    
    // Subscribe config được compile thành:
    const __subscribeConfig__ = true; // hoặc false, hoặc ["count", "name"]
    
    // ViewEngine sử dụng config này để quyết định có re-render view không
    // khi state thay đổi
}
```

**Behavior chi tiết**:

| Config | Behavior | Use Case |
|--------|----------|----------|
| `@subscribe(@all)` hoặc `@subscribe(true)` | View re-render khi **BẤT KỲ** state nào thay đổi | View động, cần cập nhật liên tục |
| `@subscribe($count)` | View CHỈ re-render khi `$count` thay đổi | Tối ưu performance, chỉ quan tâm state cụ thể |
| `@subscribe($a, $b)` | View re-render khi `$a` HOẶC `$b` thay đổi | Theo dõi nhiều states |
| `@subscribe(false)` hoặc `@dontsubscribe` | View KHÔNG BAO GIỜ tự động re-render | Static view, render một lần |
| Không khai báo | Mặc định: `true` nếu có `@vars/@let/@useState`, `false` nếu không | Auto-detect |

**Ví dụ chi tiết**:

**Ví dụ 1: Subscribe tất cả states**
```blade
@vars($user, $count = 0, $status = 'active')
@subscribe(@all)
{{-- View này re-render khi user, count, hoặc status thay đổi --}}

<div>
    <h1>{{ $user->name }}</h1>
    <p>Count: {{ $count }}</p>
    <p>Status: {{ $status }}</p>
</div>
```

**Ví dụ 2: Subscribe state cụ thể để tối ưu**
```blade
@vars($user, $count = 0)
@subscribe($count)
{{-- View CHỈ re-render khi count thay đổi --}}
{{-- user thay đổi sẽ KHÔNG trigger re-render -> tối ưu performance --}}

<div>
    <h1>{{ $user->name }}</h1> {{-- Static, không update --}}
    <p>Count: {{ $count }}</p> {{-- Dynamic, auto-update --}}
</div>
```

**Ví dụ 3: View tĩnh, không subscribe**
```blade
@vars($config = [])
@dontsubscribe
{{-- View này chỉ render một lần, không bao giờ tự động re-render --}}

<div>
    <h1>Static Configuration</h1>
    <pre>{{ json_encode($config) }}</pre>
</div>
```

**Ví dụ 4: Subscribe nhiều states**
```blade
@vars($user, $posts = [], $likes = 0, $config = [])
@subscribe($posts, $likes)
{{-- View re-render khi posts HOẶC likes thay đổi --}}
{{-- user và config thay đổi sẽ KHÔNG trigger re-render --}}

<div>
    <h1>{{ $user->name }}</h1>
    <div>Posts: {{ count($posts) }}</div>
    <div>Likes: {{ $likes }}</div>
</div>
```

**Lưu ý quan trọng**:
- Chỉ khai báo **MỘT LẦN** ở đầu file blade, KHÔNG phải ở từng element
- `@dontsubscribe` có độ ưu tiên cao nhất, nếu xuất hiện sẽ override mọi config khác
- Nếu không khai báo:
  - Có `@vars`/`@let`/`@useState`: mặc định `@subscribe(true)`
  - Không có variables: mặc định `@subscribe(false)`
- Config này ảnh hưởng đến performance: chỉ subscribe states thực sự cần thiết

**Flow hoạt động**:
```
1. View được compile với subscribe config
2. Khi state thay đổi, ViewEngine check config:
   - Nếu @dontsubscribe hoặc false: SKIP re-render
   - Nếu @subscribe(@all) hoặc true: RE-RENDER
   - Nếu @subscribe($key): check xem $key có thay đổi không, nếu có thì RE-RENDER
3. View được re-render với data mới
```

**Ví dụ kết hợp với useState**:
```blade
@vars($user)
@let([$count, $setCount] = useState(0))
@subscribe($count)
{{-- View chỉ re-render khi $count thay đổi --}}

<div>
    <h1>{{ $user->name }}</h1>
    <p>Count: {{ $count }}</p>
    <button @click($setCount($count + 1))>Increment</button>
</div>
```

---

### 4.2. `@follow` / `@watch` - Reactive Blocks

**Mục đích**: Tạo reactive block tự động re-render khi state thay đổi. `@watch` là alias của `@follow`.

**Cú pháp Blade**:
```blade
@follow($count)
    <p>Count: {{ $count }}</p>
@endfollow

@watch($count, $name)
    <p>Count: {{ $count }}, Name: {{ $name }}</p>
@endwatch

@follow([$count, $name])
    <p>Multiple states</p>
@endfollow
```

**Đầu ra PHP**:
```php
<?php $__FOLLOW_TASK_ID__ = uniqid(); $__CURRENT_FOLLOW_INDEX__ = $__helper->addFollowingBlock($__VIEW_PATH__, $__VIEW_ID__, $__FOLLOW_TASK_ID__, "count"); ?>
<!-- [one:follow type="state" following="count" id="<?php echo $__FOLLOW_TASK_ID__; ?>"] -->
    <p>Count: <?php echo $count; ?></p>
<!-- [/one:follow] -->
<?php $__env->stopSection(); ?>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function, follow blocks được wrap trong HTML comments
render: function() {
    return `
        <!-- [one:follow type="state" following="count" id="..."] -->
            <p>Count: ${count}</p>
        <!-- [/one:follow] -->
    `;
}

// Hệ thống tự động subscribe và re-render khi state thay đổi
// Comments được scan và xử lý bởi App.View.Engine khi hydrate
```

**Ví dụ sử dụng**:
```blade
@let([$count, $setCount] = useState(0))
@let([$name, $setName] = useState('John'))

<div>
    <button @click($setCount($count + 1))>Increment</button>
    
    @follow($count)
        <p>Count is now: {{ $count }}</p>
    @endfollow
    
    @watch($name)
        <p>Hello, {{ $name }}!</p>
    @endwatch
</div>
```

**Lưu ý**: 
- `@follow` và `@watch` hoàn toàn giống nhau
- Chỉ re-render phần content bên trong block khi state thay đổi
- Hiệu quả hơn `@subscribe` cho các block lớn

---

## 5. Template Directives

### 5.1. `@wrapper` / `@wrap` - Wrap Content

**Mục đích**: Wrap content với một element hoặc template. Hỗ trợ nhiều syntax khác nhau.

**Cú pháp Blade**:

**Case 1: Không có tham số** - Tạo HTML comment:
```blade
@wrap
    <p>Content</p>
@endwrap
```

**Case 2: Chỉ có tag**:
```blade
@wrap('div')
    <p>Content</p>
@endwrap
```

**Case 3: Tag và attributes**:
```blade
@wrap('div', ['class' => 'container', 'id' => 'main'])
    <p>Content</p>
@endwrap
```

**Case 4: Chỉ có attributes array** (sẽ dùng div mặc định hoặc tag trong attributes):
```blade
@wrap(['class' => 'container', 'id' => 'main', 'tag' => 'section'])
    <p>Content</p>
@endwrap
```

**Case 5: Với subscribe parameter**:
```blade
@wrap(['tag' => 'div', 'class' => 'container', 'subscribe' => [$count]])
    <p>Count: {{ $count }}</p>
@endwrap
```

**Đầu ra PHP**:

Case 1 (không tham số):
```php
<?php echo "<!-- [one:view name=\"$__VIEW_PATH__\" id=\"$__VIEW_ID__\"] -->"; ?>
    <p>Content</p>
<?php if (isset($__wrapper_tag__) && $__wrapper_tag__) { echo "</{$__wrapper_tag__}>"; unset($__wrapper_tag__); } else { echo "<!-- [/one:view] -->"; } ?>
```

Case 2-3 (có tag):
```php
<?php $__wrapper_tag__ = "div"; echo "<div data-wrap data-wrap-view=\"$__VIEW_PATH__\" data-wrap-id=\"$__VIEW_ID__\" class=\"container\" id=\"main\">"; ?>
    <p>Content</p>
<?php if (isset($__wrapper_tag__) && $__wrapper_tag__) { echo "</{$__wrapper_tag__}>"; unset($__wrapper_tag__); } else { echo "<!-- [/one:view] -->"; } ?>
```

Case 4-5 (attributes array):
```php
<?php $__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, ["count"]); echo "<section data-wrap-view=\"$__VIEW_PATH__\" data-wrap-id=\"$__VIEW_ID__\" class=\"container\" id=\"main\">"; ?>
    <p>Count: <?php echo $count; ?></p>
<?php if (isset($__wrapper_tag__) && $__wrapper_tag__) { echo "</{$__wrapper_tag__}>"; unset($__wrapper_tag__); } else { echo "<!-- [/one:view] -->"; } ?>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
render: function() {
    return `
        <div class="container" id="main">
            <p>Content</p>
        </div>
    `;
}
```

**Lưu ý**:
- `@wrap` và `@wrapper` hoàn toàn giống nhau
- Nếu không có tag, sẽ tạo HTML comment thay vì element
- Hỗ trợ `subscribe` parameter để tự động subscribe state
- Hỗ trợ `follow` parameter (tương tự subscribe)

**Ví dụ sử dụng**:
```blade
@let([$count, $setCount] = useState(0))

@wrap(['tag' => 'div', 'class' => 'card', 'subscribe' => [$count]])
    <h2>Card Title</h2>
    <p>Count: {{ $count }}</p>
    <button @click($setCount($count + 1))>Increment</button>
@endwrap
```

---

### 5.2. `@template` - Template Directive

**Mục đích**: Tương tự `@wrap` nhưng hỗ trợ nhiều format parameters hơn (positional, named, array).

**Cú pháp Blade**:

**Format 1: Array syntax** (giống @wrap):
```blade
@template(['tag' => 'div', 'class' => 'container'])
    <p>Content</p>
@endtemplate
```

**Format 2: Named parameters** (key: value):
```blade
@template(tag: 'section', class: 'container', subscribe: [$count])
    <p>Count: {{ $count }}</p>
@endtemplate
```

**Format 3: Positional parameters** ($var = value):
```blade
@template($tag = 'div', $class = 'container', $subscribe = [$count])
    <p>Content</p>
@endtemplate
```

**Format 4: Không có tham số** (giống @wrap):
```blade
@template
    <p>Content</p>
@endtemplate
```

**Đầu ra**: Tương tự `@wrap`, được xử lý bởi `WrapperDirectiveService`.

**Lưu ý**:
- `@template` là alias của `@wrap` với syntax parameters linh hoạt hơn
- Hỗ trợ cả 3 format: array, named, và positional parameters
- Tất cả đều được convert về array format và xử lý bởi `WrapperDirectiveService`

**Ví dụ sử dụng**:
```blade
@let([$count, $setCount] = useState(0))

@template(tag: 'div', class: 'card', subscribe: [$count])
    <h2>Card</h2>
    <p>Count: {{ $count }}</p>
@endtemplate
```

---

### 5.3. `@yieldAttr` - Yield Attributes

**Mục đích**: Yield attributes từ parent view.

**Cú pháp Blade**:
```blade
<div @yieldAttr('class', 'default-class')>
    Content
</div>
```

**Đầu ra PHP**:
```php
<div <?php echo $__helper->registerOnYield($__env, 'class', 'default-class'); ?>>
    Content
</div>
```

**Đầu ra JavaScript**:
```javascript
// Attributes được inject từ parent view
<div class="...">
    Content
</div>
```

---

### 5.4. `@onyield` - On Yield Attributes

**Mục đích**: Tạo attributes để theo dõi yield changes.

**Cú pháp Blade**:
```blade
<div @onyield('class', 'section', 'default-class')>
    Content
</div>
```

**Đầu ra**: Tương tự `@yieldAttr`.

---

## 6. Block Directives

### 6.1. `@block` / `@endblock` - Define Block

**Mục đích**: Định nghĩa một block có thể được sử dụng lại.

**Cú pháp Blade**:
```blade
@block('header')
    <header>
        <h1>Title</h1>
    </header>
@endblock

@block('footer', ['class' => 'footer'])
    <footer class="footer">
        <p>Footer content</p>
    </footer>
@endblock
```

**Đầu ra PHP**:
```php
<?php $__env->startSection('block.header'); ?>
<!-- [one:block name="header" view="..." ref="..."] -->
    <header>
        <h1>Title</h1>
    </header>
<!-- [/one:block] -->
<?php $__env->stopSection(); ?>
```

**Đầu ra JavaScript**:
```javascript
// Blocks được lưu trong sections
// Có thể được sử dụng với @useblock
```

---

### 6.2. `@useblock` / `@mount` - Use Block

**Mục đích**: Sử dụng một block đã được định nghĩa.

**Cú pháp Blade**:
```blade
@useblock('header')

@useblock('footer', '<p>Default footer</p>')

@mount('sidebar')
```

**Đầu ra PHP**:
```php
<!-- [one:subscribe type="block" key="header"] -->
<?php echo $__env->yieldContent('block.header'); ?>
<!-- [/one:subscribe] -->
```

**Đầu ra JavaScript**:
```javascript
// Blocks được render từ sections
```

**Ví dụ sử dụng**:
```blade
{{-- layout.blade.php --}}
@block('header')
    <header>Header Content</header>
@endblock

<div class="content">
    @yield('content')
</div>

@useblock('header')

{{-- page.blade.php --}}
@extends('layout')

@section('content')
    <h1>Page Content</h1>
@endsection
```

---

### 6.3. `@onBlock` - On Block Attributes

**Mục đích**: Tạo attributes để theo dõi block changes.

**Cú pháp Blade**:
```blade
<div @onBlock('class', 'header', 'default-class')>
    Content
</div>
```

**Đầu ra**: Tương tự `@onyield` nhưng với prefix `block:`.

---

## 7. Server/Client Side Directives

### 7.1. `@serverside` / `@ssr` - Server-Side Only

**Mục đích**: Chỉ render trên server, không render trên client.

**Cú pháp Blade**:
```blade
@serverside
    <p>This only appears on server</p>
    <meta name="description" content="SEO meta">
@endserverside

@ssr
    <noscript>JavaScript required</noscript>
@endssr
```

**Đầu ra PHP**:
```php
<?php if (true): // @serverside ?>
    <p>This only appears on server</p>
    <meta name="description" content="SEO meta">
<?php endif; // @endserverside ?>
```

**Đầu ra JavaScript**:
```javascript
// Không có output trong JavaScript render function
// Chỉ xuất hiện trong HTML từ server
```

**Ví dụ sử dụng**:
```blade
@serverside
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Default Title' }}</title>
@endserverside

<div>
    <h1>Client-side content</h1>
</div>
```

---

### 7.2. `@clientside` / `@csr` - Client-Side Only

**Mục đích**: Chỉ render trên client, không render trên server.

**Cú pháp Blade**:
```blade
@clientside
    <div id="client-only">
        <p>This only appears on client</p>
    </div>
@endclientside

@csr
    <script>
        console.log('Client-side script');
    </script>
@endcsr
```

**Đầu ra PHP**:
```php
<?php if(isset($_______show_client_side______) && $_______show_client_side______): ?>
    <div id="client-only">
        <p>This only appears on client</p>
    </div>
<?php endif; ?>
```

**Đầu ra JavaScript**:
```javascript
// Trong render function
<div id="client-only">
    <p>This only appears on client</p>
</div>
```

**Ví dụ sử dụng**:
```blade
@serverside
    <h1>Server-rendered title</h1>
@endserverside

@clientside
    <div id="interactive-content">
        <button @click(handleClick())>Interactive Button</button>
    </div>
@endclientside
```

---

## 8. Lifecycle Directives

### 8.1. `@onInit` - Initialization Code

**Mục đích**: Thêm code chạy khi view được khởi tạo.

**Cú pháp Blade**:
```blade
@onInit
    console.log('View initialized');
    setupView();
@endonInit
```

**Đầu ra PHP**:
```php
<?php $__env->startSection("{$__VIEW_ID__}_oninit"); ?>
    console.log('View initialized');
    setupView();
<?php $__env->stopSection(); $__helper->addOnInitCode($__env->yieldContent($__VIEW_ID__.'_oninit'), $__VIEW_PATH__, $__VIEW_ID__); ?>
```

**Đầu ra JavaScript**:
```javascript
// Trong init function
init: function() {
    console.log('View initialized');
    setupView();
}
```

**Ví dụ sử dụng**:
```blade
@onInit
    // Initialize third-party library
    initChart();
    
    // Setup event listeners
    window.addEventListener('resize', handleResize);
@endonInit

<div id="chart-container"></div>
```

---

### 8.2. `@register` / `@setup` - Register Resources

**Mục đích**: Đăng ký resources (scripts, styles) cho view.

**Cú pháp Blade**:
```blade
@register
    <script src="/js/custom.js"></script>
    <link rel="stylesheet" href="/css/custom.css">
@endregister

@setup
    <script>
        window.customConfig = { api: '/api' };
    </script>
@endsetup
```

**Đầu ra PHP**:
```php
<?php $__env->startSection($__VIEW_ID__.'_register'); ?>
    <script src="/js/custom.js"></script>
    <link rel="stylesheet" href="/css/custom.css">
<?php $__env->stopSection(); $__helper->registerResources($__VIEW_ID__, $__env->yieldContent($__VIEW_ID__.'_register')); ?>
```

**Đầu ra JavaScript**:
```javascript
// Resources được đăng ký và load khi view được render
```

**Ví dụ sử dụng**:
```blade
@register
    <script src="https://cdn.example.com/library.js"></script>
    <link rel="stylesheet" href="/css/view-specific.css">
@endregister

<div>
    <!-- View content -->
</div>
```

---

### 8.3. `@viewType` - Set View Type

**Mục đích**: Đặt loại view (view, component, layout).

**Cú pháp Blade**:
```blade
@viewType('component')
@viewType('layout')
@viewType('view')
```

**Đầu ra PHP**:
```php
<?php $__VIEW_TYPE__ = $__helper->registerViewType('component') ?? ($__VIEW_TYPE__ ?? 'view'); ?>
```

**Đầu ra JavaScript**:
```javascript
const __VIEW_TYPE__ = 'component';
```

**Ví dụ sử dụng**:
```blade
@viewType('component')

<div class="component">
    <!-- Component content -->
</div>
```

---

## 9. Resource Directives

### 9.1. `@scripts` / `@endscripts` - Register Scripts

**Mục đích**: Đăng ký scripts cho view.

**Cú pháp Blade**:
```blade
@scripts
    <script>
        console.log('Custom script');
    </script>
@endscripts
```

**Đầu ra PHP**:
```php
<?php $__env->startSection($__VIEW_ID__ . '_script'); ?>
    <script>
        console.log('Custom script');
    </script>
<?php $__env->stopSection(); $__helper->addScript($__VIEW_ID__,$__env->yieldContent($__VIEW_ID__.'_script')); ?>
```

---

### 9.2. `@styles` / `@endstyles` - Register Styles

**Mục đích**: Đăng ký styles cho view.

**Cú pháp Blade**:
```blade
@styles
    <style>
        .custom { color: red; }
    </style>
@endstyles
```

**Đầu ra PHP**:
```php
<?php $__env->startSection($__VIEW_ID__ . '_styles'); ?>
    <style>
        .custom { color: red; }
    </style>
<?php $__env->stopSection(); $__helper->addStyles($__VIEW_ID__,$__env->yieldContent($__VIEW_ID__.'_styles')); ?>
```

---

### 9.3. `@resources` / `@endresources` - Register Resources

**Mục đích**: Đăng ký resources tổng quát.

**Cú pháp Blade**:
```blade
@resources
    <link rel="preload" href="/font.woff2" as="font">
    <link rel="stylesheet" href="/css/critical.css">
@endresources
```

**Đầu ra PHP**:
```php
<?php $__env->startSection($__VIEW_ID__ . '_resources'); ?>
    <link rel="preload" href="/font.woff2" as="font">
    <link rel="stylesheet" href="/css/critical.css">
<?php $__env->stopSection(); $__helper->addResources($__VIEW_ID__,$__env->yieldContent($__VIEW_ID__.'_resources')); ?>
```

---

## 📝 Lưu Ý Quan Trọng

### 0. View Data và Function Parameters

**View Function Structure**:
```javascript
export function ViewName($$$DATA$$$ = {}, systemData = {}) {
    const {App, View} = systemData;
    const __VIEW_PATH__ = 'view.name';
    const __VIEW_ID__ = $$$DATA$$$.__SSR_VIEW_ID__ || App.View.generateViewId();
    const self = new View.Engine();
    const __STATE__ = new View.State(self);
    
    // Variables được khai báo ở đây (view scope)
    const [count, setCount] = useState(0);
    let user = null;
    
    // Render/prerender/init functions KHÔNG có parameters
    render: function() {
        // Variables có sẵn trong scope
        // Sử dụng App.View.escString() cho output
        return `<div>Count: ${App.View.escString(count)}</div>`;
    },
    
    prerender: function() {
        // Không có parameter
        return null;
    },
    
    init: function() {
        // Không có parameter
        console.log('Initialized');
    }
}
```

**Lưu ý**:
- View function nhận `$$$DATA$$$` parameter (không phải `__$spaViewData__` hoặc các biến cũ)
- Variables từ `@vars` được update thông qua `updateVariableData()` function
- Variables từ `@let`, `@const`, `@useState` được khai báo trực tiếp trong view scope
- Render/prerender/init functions không có parameters - variables có sẵn trong scope

### 1. Directive Aliases

Nhiều directives có nhiều biến thể (case-insensitive):
- `@val` = `@bind`
- `@follow` = `@watch`
- `@serverside` = `@ssr`
- `@clientside` = `@csr`
- `@register` = `@setup` = `@script`
- `@useblock` = `@mount` = `@mountBlock`

### 2. Directive Order

Thứ tự directives quan trọng:
1. `@vars`, `@let`, `@const`, `@useState` - Khai báo biến
2. `@viewType` - Đặt view type
3. `@register` / `@setup` - Đăng ký resources
4. `@onInit` - Initialization code
5. Template content với các directives khác

### 3. Nested Directives

Một số directives có thể lồng nhau:
- `@serverside` / `@clientside` có thể lồng trong `@follow`
- `@block` có thể chứa `@useblock`
- Event directives có thể chứa nested function calls

### 4. Performance Tips

- Sử dụng `@follow` thay vì `@subscribe` cho các block lớn
- Tránh quá nhiều `@follow` blocks trong một view
- Sử dụng `@dontsubscribe` cho các elements không cần reactive

---

## 🔗 Tài Liệu Liên Quan

- [DIRECTIVES_STATUS.md](./DIRECTIVES_STATUS.md) - Trạng thái implementation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Cấu trúc dự án
- [SYSTEM_OVERVIEW_UPDATE.md](./SYSTEM_OVERVIEW_UPDATE.md) - Tổng quan hệ thống

---

**Tài liệu này được cập nhật thường xuyên. Nếu có thắc mắc hoặc đề xuất, vui lòng tạo issue hoặc pull request.**

