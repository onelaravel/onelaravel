# 🔧 @verbatim Directive Fix

**Ngày**: 2025-01-27  
**Vấn đề**: `@verbatim` blocks không được bỏ qua khi parse declarations, dẫn đến `useState` và các directives khác bên trong `@verbatim` vẫn bị parse.

---

## ❌ Vấn Đề

### Mô tả:
Dù đã bao bởi `@verbatim` và `@endverbatim`, các khai báo `@useState`, `@let`, `@const` bên trong vẫn bị parse và xuất hiện trong output JavaScript.

### Nguyên nhân:
1. `DeclarationTracker.parse_all_declarations()` được gọi TRƯỚC khi `@verbatim` blocks được xử lý
2. `DeclarationTracker` không có logic để bỏ qua nội dung trong `@verbatim` blocks
3. Các parsers khác (`parse_let_directives`, `parse_const_directives`, `parse_usestate_directives`) cũng không bỏ qua `@verbatim` blocks

---

## ✅ Giải Pháp

### 1. Cập nhật `DeclarationTracker`

**File**: `scripts/compiler/declaration_tracker.py`

Thêm method `_remove_verbatim_blocks()` và gọi nó trong `parse_all_declarations()`:

```python
def parse_all_declarations(self, blade_code):
    """Parse all declarations and track their order"""
    # Reset to avoid contamination from previous parses
    self.reset()
    
    # Remove script tags to avoid parsing JS code
    blade_code_filtered = self._remove_script_tags(blade_code)
    
    # Remove @verbatim blocks to avoid parsing declarations inside them
    blade_code_filtered = self._remove_verbatim_blocks(blade_code_filtered)
    
    # ... rest of the code
```

**Method mới**:
```python
def _remove_verbatim_blocks(self, blade_code):
    """Remove @verbatim...@endverbatim blocks to avoid parsing declarations inside them"""
    return re.sub(r'@verbatim\s*.*?\s*@endverbatim', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
```

### 2. Cập nhật `DirectiveParsers`

**File**: `scripts/compiler/parsers.py`

Thêm method `_remove_verbatim_blocks()` và cập nhật các parsers:

#### Method mới:
```python
def _remove_verbatim_blocks(self, blade_code):
    """Loại bỏ @verbatim...@endverbatim blocks để tránh xử lý directives bên trong"""
    filtered_code = re.sub(r'@verbatim\s*.*?\s*@endverbatim', '', blade_code, flags=re.DOTALL | re.IGNORECASE)
    return filtered_code
```

#### Cập nhật các parsers:

**`parse_vars()`**:
```python
def parse_vars(self, blade_code):
    # Loại bỏ @verbatim blocks để tránh parse directives bên trong
    blade_code = self._remove_verbatim_blocks(blade_code)
    # ... rest of the code
```

**`parse_let_directives()`**:
```python
def parse_let_directives(self, blade_code):
    blade_code_filtered = self._remove_script_tags(blade_code)
    # Loại bỏ @verbatim blocks để tránh parse directives bên trong
    blade_code_filtered = self._remove_verbatim_blocks(blade_code_filtered)
    # ... rest of the code
```

**`parse_const_directives()`**:
```python
def parse_const_directives(self, blade_code):
    blade_code_filtered = self._remove_script_tags(blade_code)
    # Loại bỏ @verbatim blocks để tránh parse directives bên trong
    blade_code_filtered = self._remove_verbatim_blocks(blade_code_filtered)
    # ... rest of the code
```

**`parse_usestate_directives()`**:
```python
def parse_usestate_directives(self, blade_code):
    blade_code_filtered = self._remove_script_tags(blade_code)
    # Loại bỏ @verbatim blocks để tránh parse directives bên trong
    blade_code_filtered = self._remove_verbatim_blocks(blade_code_filtered)
    # ... rest of the code
```

---

## 🎯 Kết Quả

### Trước khi fix:
```blade
@verbatim
@const([$message, $setMessage] = useState('Hello World'))
@useState(['message' => 'Hello World'])
@endverbatim
```

**Output**: Các declarations vẫn bị parse và xuất hiện trong JavaScript output ❌

### Sau khi fix:
```blade
@verbatim
@const([$message, $setMessage] = useState('Hello World'))
@useState(['message' => 'Hello World'])
@endverbatim
```

**Output**: Nội dung trong `@verbatim` blocks được giữ nguyên, không bị parse ✅

---

## 📝 Thứ Tự Xử Lý

### Trước khi fix:
1. `DeclarationTracker.parse_all_declarations()` - Parse tất cả declarations (bao gồm trong `@verbatim`) ❌
2. `parse_let_directives()` - Parse `@let` (bao gồm trong `@verbatim`) ❌
3. `parse_const_directives()` - Parse `@const` (bao gồm trong `@verbatim`) ❌
4. `parse_usestate_directives()` - Parse `@useState` (bao gồm trong `@verbatim`) ❌
5. `TemplateProcessor._process_verbatim_blocks()` - Xử lý `@verbatim` (quá muộn) ❌

### Sau khi fix:
1. `DeclarationTracker.parse_all_declarations()` - Bỏ qua `@verbatim` blocks ✅
2. `parse_let_directives()` - Bỏ qua `@verbatim` blocks ✅
3. `parse_const_directives()` - Bỏ qua `@verbatim` blocks ✅
4. `parse_usestate_directives()` - Bỏ qua `@verbatim` blocks ✅
5. `TemplateProcessor._process_verbatim_blocks()` - Xử lý `@verbatim` để restore content ✅

---

## 🧪 Test Cases

### Test Case 1: @useState trong @verbatim
```blade
@verbatim
@const([$message, $setMessage] = useState('Hello World'))
@endverbatim
```

**Expected**: Không có declaration trong output JavaScript ✅

### Test Case 2: @let trong @verbatim
```blade
@verbatim
@let($count = 0)
@endverbatim
```

**Expected**: Không có declaration trong output JavaScript ✅

### Test Case 3: @const trong @verbatim
```blade
@verbatim
@const($API_URL = 'https://api.example.com')
@endverbatim
```

**Expected**: Không có declaration trong output JavaScript ✅

### Test Case 4: Mixed content
```blade
@let($realCount = 0)  <!-- Should be parsed -->

@verbatim
@const([$example, $setExample] = useState('test'))  <!-- Should NOT be parsed -->
@endverbatim

@const($realConst = 'value')  <!-- Should be parsed -->
```

**Expected**: 
- `$realCount` được parse ✅
- `$example` KHÔNG được parse ✅
- `$realConst` được parse ✅

---

## 📊 Files Changed

| File | Changes | Status |
|------|---------|--------|
| `declaration_tracker.py` | Added `_remove_verbatim_blocks()` method | ✅ |
| `parsers.py` | Added `_remove_verbatim_blocks()` method | ✅ |
| `parsers.py` | Updated `parse_vars()` | ✅ |
| `parsers.py` | Updated `parse_let_directives()` | ✅ |
| `parsers.py` | Updated `parse_const_directives()` | ✅ |
| `parsers.py` | Updated `parse_usestate_directives()` | ✅ |

---

## ✅ Status

**Status**: ✅ **FIXED**  
**Breaking Changes**: ❌ **NONE**  
**Backward Compatible**: ✅ **YES**

---

**Fix completed**: 2025-01-27


