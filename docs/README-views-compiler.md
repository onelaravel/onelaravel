# Laravel Blade Views Compiler

## Mô tả

Đây là một Artisan command để biên dịch các file Blade view của Laravel thành JavaScript templates, phù hợp cho việc sử dụng trong Single Page Application (SPA).

## Tính năng

- **Scan và biên dịch tự động**: Tự động tìm và biên dịch tất cả file `.blade.php` trong thư mục được chỉ định
- **Hỗ trợ @vars directive**: Parse `@vars($name, $name2 = 'default')` để tạo function parameters với destructuring
- **Chuyển đổi Blade syntax**: Chuyển đổi các directive Blade thành JavaScript tương đương:
  - `{{ $variable }}` → `${variable}`
  - `@if(...)` → `${SPA.execute(() => { ... })}`
  - `@foreach($items as $item)` → `${SPA.foreach(items, (item) => `...`)}`
  - `@for(...)` → `${SPA.execute(() => { for(...) { ... } })}`
  - `@while(...)` → `${SPA.execute(() => { while(...) { ... } })}`
  - `@switch(...)` → `${SPA.execute(() => { switch(...) { ... } })}`
- **Helper functions**: Tự động tạo các helper function `SPA.*` để thay thế PHP functions
- **Output JavaScript**: Tạo file JavaScript với cấu trúc `SPA.views[scope] = { templateName: function(__data = {}) { ... } }`

## Cách sử dụng

### 1. Chạy command

```bash
php artisan views:compile {scope} {path}
```

**Tham số:**
- `scope`: Tên scope cho templates (ví dụ: 'web', 'admin', 'api')
- `path`: Đường dẫn đến thư mục chứa file Blade (ví dụ: 'resources/views')

**Ví dụ:**
```bash
php artisan views:compile web resources/views
```

### 2. Output

Command sẽ tạo file `public/build/views.js` chứa:
- Global `SPA` object
- Helper functions (`SPA.foreach`, `SPA.execute`, `SPA.count`, etc.)
- Compiled templates trong `SPA.views[scope]`

### 3. Sử dụng trong HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>My SPA</title>
</head>
<body>
    <div id="app"></div>
    
    <script src="build/views.js"></script>
    <script>
        // Sử dụng template
        const template = SPA.views.web.template_name({
            title: 'Hello World',
            items: ['item1', 'item2']
        });
        
        document.getElementById('app').innerHTML = template;
    </script>
</body>
</html>
```

## Cú pháp @vars

### Khai báo biến

```blade
@vars($title, $count = 0, $items = [])
```

### Kết quả JavaScript

```javascript
function(__data = {}) {
    let {title, count = 0, items = []} = __data;
    // ... template code
}
```

## Các directive được hỗ trợ

### 1. Echo và Variables
- `{{ $variable }}` → `${variable}`
- `{{ $user->name }}` → `${user.name}`
- `{{ $item['key'] }}` → `${item['key']}`
- `{{ $var ?? 'default' }}` → `${var || 'default'}`

### 2. Control Structures
- `@if(...)` → `${SPA.execute(() => { if(...) { ... } })}`
- `@foreach($items as $item)` → `${SPA.foreach(items, (item) => `...`)}`
- `@for($i = 0; $i < 10; $i++)` → `${SPA.execute(() => { for(let i = 0; i < 10; i++) { ... } })}`
- `@while($condition)` → `${SPA.execute(() => { while(condition) { ... } })}`
- `@switch($value)` → `${SPA.execute(() => { switch(value) { ... } })}`

### 3. Function Calls
- `count($items)` → `SPA.count(items)`
- `isset($user)` → `SPA.isset(user)`
- `route('home')` → `SPA.route('home')`

## Helper Functions

### SPA.foreach
```javascript
SPA.foreach(array, callback) // callback: (item, index) => string
```

### SPA.execute
```javascript
SPA.execute(() => {
    let __outputString = ``;
    // JavaScript code here
    return __outputString;
})
```

### SPA.count, SPA.isset, SPA.empty
```javascript
SPA.count(array)     // Returns array.length
SPA.isset(variable)  // Returns variable !== undefined && variable !== null
SPA.empty(variable)  // Returns true if variable is empty
```

## Ví dụ Template

### Input (Blade)
```blade
@vars($title, $items = [])
<h1>{{ $title }}</h1>

@if(count($items) > 0)
    <ul>
        @foreach($items as $item)
            <li>{{ $item['name'] ?? 'Unnamed' }}</li>
        @endforeach
    </ul>
@else
    <p>No items found.</p>
@endif
```

### Output (JavaScript)
```javascript
function(__data = {}) {
    let {title, items = []} = __data;
    return `
        <h1>${title}</h1>
        
        ${SPA.execute(() => {
            let __outputString = ``;
            if(SPA.count(items) > 0){
                __outputString += `
                    <ul>
                        ${SPA.foreach(items, (item) => `
                            <li>${item['name'] || 'Unnamed'}</li>
                        `)}
                    </ul>
                `;
            }
            else{
                __outputString += `
                    <p>No items found.</p>
                `;
            }
            return __outputString;
        })}
    `;
}
```

## Lưu ý

- Command sẽ scan tất cả file `.blade.php` trong thư mục và subdirectories
- Các template được compile sẽ có tên dựa trên đường dẫn file (ví dụ: `partials_footer` cho `partials/footer.blade.php`)
- File output sẽ được tạo tại `public/build/views.js`
- Đảm bảo thư mục `public/build/` tồn tại trước khi chạy command

## Troubleshooting

### Lỗi syntax JavaScript
Nếu file output có lỗi syntax, hãy kiểm tra:
1. Các comment HTML trong template
2. Các directive Blade phức tạp
3. Các biến PHP không được escape đúng cách

### Template không render
Kiểm tra:
1. File `views.js` đã được load đúng cách
2. Scope và tên template đúng
3. Data được truyền vào function có đúng format

## Tác giả

Blade Views Compiler - Tự động biên dịch Laravel Blade thành JavaScript templates cho SPA.


