# 🔄 @val và @bind Directive Refactor

**Ngày**: 2025-01-27  
**Mục đích**: Refactor để `@val` và `@bind` là alias của nhau

---

## ✅ Vấn Đề Đã Sửa

### Trước đây:
- `@val` và `@bind` được implement như 2 directive riêng biệt
- Code duplicate không cần thiết
- Cả 2 đều làm cùng một việc nhưng có logic riêng

### Sau khi refactor:
- `@val` và `@bind` là **alias của nhau**
- Chỉ có 1 method chính xử lý cả 2 directive
- Code gọn gàng, dễ maintain hơn

---

## 📝 Thay Đổi

### PHP Side (`BindingDirectiveService.php`)

#### 1. Method mới: `processBindingDirective()`
```php
/**
 * Process binding directives (@val and @bind are aliases)
 * @val($userState->name) -> data-binding="userState.name"
 * @bind($username) -> data-binding="username"
 * Both directives produce the same output
 * Supports nested parentheses
 */
public function processBindingDirective($content, $directiveName = 'val|bind')
```

**Features:**
- ✅ Hỗ trợ nested parentheses
- ✅ Xử lý cả `@val` và `@bind` trong một pass
- ✅ Pattern: `val|bind` để match cả 2 directive

#### 2. Methods cũ giờ là alias:
```php
public function processValDirective($content)
{
    return $this->processBindingDirective($content, 'val');
}

public function processBindDirective($content)
{
    return $this->processBindingDirective($content, 'bind');
}
```

#### 3. `processAllBindingDirectives()` được tối ưu:
```php
public function processAllBindingDirectives($content)
{
    // Process both @val and @bind directives together (they are aliases)
    return $this->processBindingDirective($content, 'val|bind');
}
```

**Trước đây**: Gọi 2 lần (một cho `@val`, một cho `@bind`)  
**Bây giờ**: Chỉ gọi 1 lần với pattern `val|bind`

---

### Python Side (`binding_directive_service.py`)

#### 1. Method mới: `process_binding_directive()`
```python
def process_binding_directive(self, content, directive_pattern='val|bind'):
    """
    Process binding directives (@val and @bind are aliases)
    @val($userState->name) -> data-binding="userState.name"
    @bind($username) -> data-binding="username"
    Both directives produce the same output
    """
```

**Features:**
- ✅ Hỗ trợ nested parentheses
- ✅ Xử lý cả `@val` và `@bind` trong một pass
- ✅ Pattern: `val|bind` để match cả 2 directive

#### 2. Methods cũ giờ là alias:
```python
def process_val_directive(self, content):
    """Process @val directive (alias of process_binding_directive)"""
    return self.process_binding_directive(content, 'val')

def process_bind_directive(self, content):
    """Process @bind directive (alias of process_binding_directive)"""
    return self.process_binding_directive(content, 'bind')
```

#### 3. `process_all_binding_directives()` được tối ưu:
```python
def process_all_binding_directives(self, content):
    """
    Process both @val and @bind directives in content (they are aliases)
    This method processes both directives in a single pass
    """
    return self.process_binding_directive(content, 'val|bind')
```

---

## 🎯 Cách Sử Dụng

### Cả 2 directive đều hoạt động giống nhau:

```blade
<!-- @val directive -->
<div @val($userState->name)>
    User name here
</div>

<!-- @bind directive (alias của @val) -->
<input @bind($userState->email) type="text" />

<!-- Cả 2 đều tạo ra cùng output -->
<!-- data-binding="userState.name" -->
<!-- data-binding="userState.email" -->
```

### Hỗ trợ nested parentheses:

```blade
<!-- Complex expressions -->
<div @val(User::find($id)->profile->displayName)>
    Display name
</div>

<!-- Array access -->
<div @bind($user['profile']['name'])>
    Profile name
</div>
```

---

## ✅ Kết Quả

### Output giống hệt nhau:

| Input | Output |
|-------|--------|
| `@val($username)` | `data-binding="username"` |
| `@bind($username)` | `data-binding="username"` |
| `@val($user->name)` | `data-binding="user.name"` |
| `@bind($user->name)` | `data-binding="user.name"` |
| `@val($user['name'])` | `data-binding="user.name"` |
| `@bind($user['name'])` | `data-binding="user.name"` |

---

## 🔍 Code Quality Improvements

### Before:
- ❌ 2 methods riêng biệt với logic duplicate
- ❌ `processAllBindingDirectives()` gọi 2 lần
- ❌ Khó maintain khi cần thay đổi logic

### After:
- ✅ 1 method chính xử lý cả 2 directive
- ✅ `processAllBindingDirectives()` chỉ gọi 1 lần
- ✅ Dễ maintain, chỉ cần sửa 1 chỗ
- ✅ Rõ ràng rằng chúng là alias

---

## 📊 Performance

### Before:
```php
// Gọi 2 lần
$content = $this->processValDirective($content);  // Pass 1
$content = $this->processBindDirective($content); // Pass 2
```

### After:
```php
// Chỉ gọi 1 lần
$content = $this->processBindingDirective($content, 'val|bind'); // Single pass
```

**Improvement**: Giảm 50% số lần scan content

---

## 🧪 Testing

### Test Cases:

1. ✅ `@val($username)` → `data-binding="username"`
2. ✅ `@bind($username)` → `data-binding="username"`
3. ✅ `@val($user->name)` → `data-binding="user.name"`
4. ✅ `@bind($user->name)` → `data-binding="user.name"`
5. ✅ `@val($user['name'])` → `data-binding="user.name"`
6. ✅ `@bind($user['name'])` → `data-binding="user.name"`
7. ✅ Nested parentheses: `@val(User::find($id)->name)`
8. ✅ Mixed: `@val($user->name) @bind($user->email)`

---

## 📝 Notes

- ✅ `@val` và `@bind` là **alias hoàn toàn** của nhau
- ✅ Có thể sử dụng bất kỳ directive nào, kết quả giống hệt
- ✅ Hỗ trợ nested parentheses
- ✅ Performance tốt hơn (single pass)
- ✅ Code dễ maintain hơn

---

**Status**: ✅ **COMPLETED**  
**Breaking Changes**: ❌ **NONE** (backward compatible)


