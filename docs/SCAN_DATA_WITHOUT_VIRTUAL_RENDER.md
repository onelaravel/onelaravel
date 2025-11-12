# 🔍 Phương Án Scan Dữ Liệu Khi Loại Bỏ virtualRender/virtualPrerender

**Ngày**: 2025-01-27  
**Vấn đề**: Khi đã loại bỏ `virtualRender` và `virtualPrerender` từ view template, cần phương án scan dữ liệu để nạp vào JS

---

## 🎯 Vấn Đề

### Hiện Trạng:
- `virtualRender()` và `virtualPrerender()` được dùng để scan/setup relationships khi SSR
- Chúng gọi `this.config.render()` và `this.config.prerender()` từ compiled template
- Khi `isScanning = true`, các method `*Scan` được gọi thay vì method thường
- Nếu loại bỏ `virtualRender/virtualPrerender` từ template → không có cách scan

### Mục Tiêu:
- Scan dữ liệu từ server (SSR data)
- Setup view hierarchy, sections, state subscriptions
- Hydrate DOM với events và reactive blocks
- **KHÔNG cần** generate HTML (đã có từ server)

---

## ✅ Phương Án 1: Scan Trực Tiếp Từ Server Data (RECOMMENDED)

### Ý Tưởng:
Sử dụng `__scan()` method hiện có kết hợp với server data từ `ssrViewManager`, **KHÔNG cần** gọi `virtualRender()`.

### Implementation:

#### 1. Cập nhật `View.scanView()`:

```javascript
scanView(name, route = null) {
    // ... existing code ...
    
    try {
        // Get server data
        const viewData = this.ssrViewManager.scan(name);
        if (!viewData) {
            // No SSR data, skip scanning
            return null;
        }
        
        // Create view instance
        const view = this.view(name, viewData.data || {});
        if (!view) {
            return null;
        }
        
        // ✅ NEW: Scan directly from server data (NO virtualRender needed)
        view.__scanFromServerData(viewData);
        
        // Handle super view
        if (view.hasSuperView) {
            // ... existing super view logic ...
        }
        
        return view;
    } catch (error) {
        // ... error handling ...
    }
}
```

#### 2. Thêm method mới `__scanFromServerData()` vào ViewEngine:

```javascript
/**
 * Scan view from server data WITHOUT calling virtualRender
 * This method directly processes server data to setup:
 * - View hierarchy
 * - Sections
 * - State subscriptions
 * - Event handlers
 * - Following blocks
 * 
 * @param {Object} serverData - Server-side view data
 * @param {string} serverData.viewId - View instance ID
 * @param {Object} serverData.data - View data
 * @param {Object} serverData.events - Event handlers
 * @param {Array} serverData.following - Following blocks
 * @param {Array} serverData.children - Child views
 * @param {Object} serverData.sections - Section data
 * @param {Object} serverData.states - State data
 */
__scanFromServerData(serverData) {
    const { viewId, data, events, following, children, sections, states } = serverData;
    
    // Set scanning flags
    this.isScanning = true;
    this.isScanned = false;
    
    // ========================================================================
    // STEP 1: Update view data
    // ========================================================================
    if (data && typeof data === 'object') {
        this.updateVariableData(data);
    }
    
    // ========================================================================
    // STEP 2: Setup states from server data
    // ========================================================================
    if (states && typeof states === 'object') {
        Object.entries(states).forEach(([key, value]) => {
            if (this.states && typeof this.states.set === 'function') {
                this.states.set(key, value);
            }
        });
    }
    
    // ========================================================================
    // STEP 3: Register sections from server data
    // ========================================================================
    if (sections && typeof sections === 'object') {
        Object.entries(sections).forEach(([name, content]) => {
            this.cachedSections[name] = content;
            // Register with View system
            if (this.App && this.App.View) {
                this.App.View.section(name, content, 'html');
            }
        });
    }
    
    // ========================================================================
    // STEP 4: Scan DOM and attach handlers (existing __scan logic)
    // ========================================================================
    this.__scan({
        viewId: viewId || this.id,
        data,
        events,
        following,
        children,
        parent: null
    });
    
    // ========================================================================
    // STEP 5: Recursively scan children
    // ========================================================================
    if (children && Array.isArray(children) && children.length > 0) {
        children.forEach(childConfig => {
            const { name, id } = childConfig;
            const childView = this.App.View.view(name, childConfig.data || {});
            if (childView) {
                childView.setParent(this);
                this.addChild(childView, childConfig.data || {});
                
                // Recursively scan child
                const childServerData = this.App.View.ssrViewManager.getInstance(name, id);
                if (childServerData) {
                    childView.__scanFromServerData(childServerData);
                }
            }
        });
    }
    
    // ========================================================================
    // STEP 6: Handle super view (if exists)
    // ========================================================================
    if (this.hasSuperView && this.superViewPath) {
        const superViewData = this.App.View.ssrViewManager.scan(this.superViewPath);
        if (superViewData) {
            const superView = this.__extends(this.superViewPath, superViewData.data || {});
            if (superView) {
                superView.__scanFromServerData(superViewData);
            }
        }
    }
    
    // Mark as scanned
    this.isScanned = true;
    this.isScanning = false;
    
    logger.log(`✅ ViewEngine.__scanFromServerData: Scan complete for ${this.path}`);
}
```

---

## ✅ Phương Án 2: Scan Từ DOM + Server Data (Hybrid)

### Ý Tưởng:
Kết hợp scan từ DOM (đã có HTML) và server data để setup đầy đủ.

### Implementation:

```javascript
/**
 * Scan view from DOM and server data
 * Combines DOM scanning with server data for complete setup
 */
__scanFromDOMAndServerData(serverData) {
    const { viewId, data, events, following, children } = serverData;
    
    // Step 1: Scan DOM (existing __scan logic)
    this.__scan({
        viewId: viewId || this.id,
        data,
        events,
        following,
        children
    });
    
    // Step 2: Setup sections from DOM
    this.__scanSectionsFromDOM();
    
    // Step 3: Setup state from server data
    if (serverData.states) {
        this.__setupStatesFromServerData(serverData.states);
    }
    
    // Step 4: Recursively scan children
    this.__scanChildrenFromServerData(children);
}
```

---

## ✅ Phương Án 3: Lazy Scan (On-Demand)

### Ý Tưởng:
Chỉ scan khi cần, không scan toàn bộ ngay từ đầu.

### Implementation:

```javascript
/**
 * Lazy scan - only scan when needed
 */
__lazyScan(serverData) {
    // Store server data for later
    this._pendingServerData = serverData;
    this._isLazyScanned = false;
}

/**
 * Trigger lazy scan when needed
 */
__triggerLazyScan() {
    if (this._isLazyScanned || !this._pendingServerData) {
        return;
    }
    
    this.__scanFromServerData(this._pendingServerData);
    this._isLazyScanned = true;
    this._pendingServerData = null;
}
```

---

## 📊 So Sánh Các Phương Án

| Phương Án | Ưu Điểm | Nhược Điểm | Phù Hợp |
|-----------|---------|------------|---------|
| **1. Scan từ Server Data** | ✅ Đơn giản<br>✅ Không cần DOM<br>✅ Nhanh | ❌ Cần server data đầy đủ | ✅ **RECOMMENDED** |
| **2. Hybrid (DOM + Server)** | ✅ Chính xác<br>✅ Validate với DOM | ❌ Phức tạp hơn<br>❌ Cần DOM sẵn có | ⚠️ Khi cần validate |
| **3. Lazy Scan** | ✅ Performance tốt<br>✅ Chỉ scan khi cần | ❌ Logic phức tạp<br>❌ Timing issues | ⚠️ Khi có nhiều views |

---

## 🎯 Implementation Chi Tiết - Phương Án 1 (RECOMMENDED)

### 1. Cập nhật ViewEngine.js:

```javascript
// Add new method after __scan()
__scanFromServerData(serverData) {
    // Implementation như trên
}

// Update existing __scan() to work standalone
__scan(config) {
    // Keep existing implementation
    // This is still used for DOM-based scanning
}
```

### 2. Cập nhật View.js:

```javascript
scanView(name, route = null) {
    // ... existing code ...
    
    try {
        const viewData = this.ssrViewManager.scan(name);
        if (!viewData) {
            logger.warn(`⚠️ View.scanView: No SSR data for ${name}`);
            return null;
        }
        
        const view = this.view(name, viewData.data || {});
        if (!view) {
            return null;
        }
        
        // ✅ Use new method instead of virtualRender
        view.__scanFromServerData(viewData);
        
        // Handle super view
        if (view.hasSuperView && view.superViewPath) {
            const superViewData = this.ssrViewManager.scan(view.superViewPath);
            if (superViewData) {
                const superView = view.__extends(view.superViewPath, superViewData.data || {});
                if (superView) {
                    superView.__scanFromServerData(superViewData);
                }
            }
        }
        
        // Mount views
        this.mountAllViewsFromStack(this.renderTimes).then(() => {
            logger.log('✅ View.scanView: All views mounted');
        });
        
        return view;
    } catch (error) {
        // ... error handling ...
    }
}
```

### 3. Server Data Structure:

```javascript
// Expected server data structure
{
    viewId: 'home-123',
    data: {
        user: { name: 'John' },
        count: 0
    },
    events: {
        click: {
            'btn-1': [{ handler: 'handleClick', params: [] }]
        }
    },
    following: [
        { id: 'follow-1', stateKeys: ['count'] }
    ],
    children: [
        { name: 'partials.header', id: 'header-456' }
    ],
    sections: {
        'content': '<div>Content</div>',
        'title': 'Home Page'
    },
    states: {
        count: 0,
        userState: { name: 'John' }
    }
}
```

---

## 🔄 Migration Path

### Step 1: Add new method
- ✅ Add `__scanFromServerData()` to ViewEngine
- ✅ Keep existing `__scan()` for backward compatibility

### Step 2: Update scanView()
- ✅ Update `View.scanView()` to use `__scanFromServerData()`
- ✅ Remove dependency on `virtualRender()`

### Step 3: Remove virtualRender from templates
- ✅ Compiler không generate `virtualRender()` nữa
- ✅ Chỉ giữ `render()` và `prerender()`

### Step 4: Test & Validate
- ✅ Test với SSR views
- ✅ Test với nested views
- ✅ Test với super views
- ✅ Test với following blocks

---

## ✅ Benefits

### 1. **Simpler Templates**
- Không cần `virtualRender/virtualPrerender` trong template
- Giảm code duplication
- Dễ maintain hơn

### 2. **Better Performance**
- Không cần execute render function để scan
- Chỉ process server data
- Nhanh hơn

### 3. **Clearer Separation**
- Scan logic tách biệt khỏi render logic
- Dễ debug
- Dễ test

### 4. **More Flexible**
- Có thể scan từ nhiều nguồn (server data, DOM, API)
- Dễ extend
- Dễ customize

---

## 📝 Notes

### Important Considerations:

1. **Server Data Completeness**: 
   - Server phải cung cấp đầy đủ data (events, following, children, sections, states)
   - Cần validate server data structure

2. **Backward Compatibility**:
   - Giữ `__scan()` method cho DOM-based scanning
   - Có thể dùng cả 2 methods tùy trường hợp

3. **Error Handling**:
   - Validate server data trước khi scan
   - Handle missing data gracefully
   - Log warnings cho missing data

4. **Performance**:
   - Cache server data nếu có thể
   - Lazy load children nếu cần
   - Batch operations khi có thể

---

## 🎯 Conclusion

**Phương án 1 (Scan từ Server Data)** là **RECOMMENDED** vì:
- ✅ Đơn giản nhất
- ✅ Không cần DOM
- ✅ Performance tốt
- ✅ Dễ implement
- ✅ Dễ maintain

**Next Steps**:
1. Implement `__scanFromServerData()` method
2. Update `View.scanView()` to use new method
3. Test với real views
4. Remove `virtualRender/virtualPrerender` từ compiler

---

**Status**: ✅ **READY FOR IMPLEMENTATION**


