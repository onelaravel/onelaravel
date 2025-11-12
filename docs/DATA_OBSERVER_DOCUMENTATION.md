# Data Observer System Documentation

Hệ thống Data Observer cho phép theo dõi và quan sát các thay đổi dữ liệu trong View Engine một cách tự động và hiệu quả.

## Tổng quan

Data Observer System bao gồm hai thành phần chính:
- **DataObserver**: Class chính quản lý toàn bộ hệ thống observe
- **ObserverInstance**: Instance riêng cho từng view để theo dõi dữ liệu

## Tính năng chính

### 1. Theo dõi State Changes
Tự động theo dõi mọi thay đổi trong ViewState của view:
```javascript
// Tự động được khởi tạo khi tạo ViewEngine
const view = new ViewEngine('my.view', { viewId: 'unique-id' });

// Subscribe để nhận thông báo khi state thay đổi
const unsubscribe = view.onStateChange((changeData) => {
    console.log('State changed:', {
        viewId: changeData.viewId,
        key: changeData.key,
        oldValue: changeData.oldValue,
        newValue: changeData.newValue,
        timestamp: changeData.timestamp
    });
});

// Tạo state - sẽ được observer theo dõi
const [count, setCount] = view.states.__useState(0, 'count');
setCount(1); // Trigger observer callback
```

### 2. Theo dõi Props Changes
Quan sát thay đổi trong props của view:
```javascript
const unsubscribe = view.onPropsChange((changeData) => {
    console.log('Props changed:', changeData);
});
```

### 3. Global Observation
Theo dõi tất cả thay đổi dữ liệu từ mọi view:
```javascript
import { dataObserver } from './core/DataObserver.js';

// Subscribe to tất cả thay đổi
const unsubscribe = dataObserver.subscribeToAll((eventData) => {
    console.log('Global change:', {
        eventType: eventData.eventType, // 'state:change', 'props:change'
        viewId: eventData.viewId,
        key: eventData.key,
        // ... other data
    });
});

// Subscribe to specific event types
const unsubscribeState = dataObserver.subscribe('state:change', (data) => {
    console.log('Any view state changed:', data);
});
```

### 4. Data Summary và History
Lấy thông tin tổng quan và lịch sử thay đổi:
```javascript
// Lấy summary của view
const summary = view.getDataSummary();
console.log(summary);
// Output:
// {
//   viewId: 'unique-id',
//   changeCount: 5,
//   lastSnapshot: { timestamp: ..., state: {...}, props: {...} },
//   options: { trackState: true, trackProps: true, ... },
//   listeners: ['state:change', 'props:change']
// }

// Lấy lịch sử thay đổi
const allHistory = view.getChangeHistory();
const recentHistory = view.getChangeHistory(10); // 10 thay đổi gần nhất

// Chụp snapshot hiện tại
const snapshot = view.takeDataSnapshot();
```

### 5. Performance Monitoring
Theo dõi performance của data changes:
```javascript
// Enable debug mode để xem chi tiết
dataObserver.enableDebugMode();

// Đo performance
const startTime = performance.now();
let changeCount = 0;

const unsubscribe = view.onStateChange(() => {
    changeCount++;
});

// Make changes và measure time...

// Disable debug mode
dataObserver.disableDebugMode();
```

## API Reference

### DataObserver Class

#### Methods:
- `createObserver(viewId, viewInstance, options)`: Tạo observer cho view
- `removeObserver(viewId)`: Xóa observer 
- `getObserver(viewId)`: Lấy observer theo viewId
- `subscribe(eventType, callback)`: Subscribe to global events
- `subscribeToAll(callback)`: Subscribe to tất cả events
- `getAllObservers()`: Lấy tất cả observers
- `getDataSummary()`: Lấy tổng quan toàn bộ system
- `enableDebugMode()` / `disableDebugMode()`: Bật/tắt debug mode
- `enable()` / `disable()`: Bật/tắt toàn bộ observation
- `destroy()`: Dọn dẹp toàn bộ observers

### ViewEngine Integration

#### New Methods:
- `onDataChange(eventType, callback)`: Subscribe to data changes
- `onStateChange(callback)`: Subscribe to state changes  
- `onPropsChange(callback)`: Subscribe to props changes
- `getDataSummary()`: Lấy data summary của view
- `getChangeHistory(limit)`: Lấy change history
- `takeDataSnapshot()`: Chụp snapshot data hiện tại
- `clearDataHistory()`: Xóa history

#### New Properties:
- `dataObserver`: Instance của ObserverInstance cho view này

### ObserverInstance Class

#### Options:
```javascript
{
    trackState: true,        // Theo dõi state changes
    trackProps: true,        // Theo dõi props changes  
    trackMethods: false,     // Theo dõi method calls (chưa implement)
    debounceMs: 10,         // Debounce time cho events
    maxHistorySize: 100     // Số lượng history tối đa
}
```

## Event Types

### state:change
Được trigger khi state của view thay đổi:
```javascript
{
    viewId: 'view-id',
    type: 'state',
    key: 'state-key',
    newValue: 'new-value',
    oldValue: 'old-value', 
    timestamp: 1234567890
}
```

### props:change
Được trigger khi props của view thay đổi:
```javascript
{
    viewId: 'view-id',
    type: 'props',
    key: 'prop-key',
    newValue: 'new-value',
    oldValue: 'old-value',
    timestamp: 1234567890
}
```

### view:change
Được trigger khi view được thêm/thay đổi trong global views:
```javascript
{
    viewId: 'view-id',
    oldValue: oldViewInstance,
    newValue: newViewInstance,
    timestamp: 1234567890
}
```

### view:remove
Được trigger khi view được xóa:
```javascript
{
    viewId: 'view-id', 
    removedValue: removedViewInstance,
    timestamp: 1234567890
}
```

## Best Practices

### 1. Memory Management
```javascript
// Luôn unsubscribe khi không cần nữa
const unsubscribe = view.onStateChange(callback);

// Cleanup khi component unmount
// unsubscribe() được gọi tự động trong destroyed()
```

### 2. Performance
```javascript
// Use debouncing cho rapid changes
const observer = dataObserver.createObserver(viewId, view, {
    debounceMs: 50 // Debounce 50ms
});

// Limit history size
const observer = dataObserver.createObserver(viewId, view, {
    maxHistorySize: 50 // Chỉ giữ 50 changes gần nhất
});
```

### 3. Debugging
```javascript
// Enable debug mode khi development
if (process.env.NODE_ENV === 'development') {
    dataObserver.enableDebugMode();
}

// Monitor global changes
dataObserver.subscribeToAll((data) => {
    if (data.eventType === 'state:change') {
        console.log(`State ${data.key} changed in ${data.viewId}`);
    }
});
```

### 4. Filtering Events
```javascript
// Filter events by specific criteria
view.onStateChange((changeData) => {
    // Chỉ xử lý changes cho important keys
    if (changeData.key.startsWith('important_')) {
        handleImportantChange(changeData);
    }
});
```

## Examples

Xem file `DataObserverExamples.js` để có các ví dụ chi tiết về cách sử dụng hệ thống.

## Browser Console Usage

Trong browser console, bạn có thể:
```javascript
// Access global observer
window.dataObserver.enableDebugMode();

// Run examples
window.DataObserverExamples.runAllExamples();

// Check current observers
console.log(window.dataObserver.getDataSummary());
```

## Troubleshooting

### Observer không được tạo
- Kiểm tra ViewEngine có được khởi tạo đúng cách
- Đảm bảo viewId là unique
- Check console để xem error messages

### Events không được trigger
- Kiểm tra observer có được enable: `dataObserver.isEnabled`
- Verify subscribe callbacks được đăng ký đúng cách
- Check debug mode để xem detailed logs

### Memory leaks
- Đảm bảo unsubscribe callbacks khi không cần
- View cleanup được gọi trong destroyed() lifecycle
- Monitor số lượng observers: `dataObserver.getAllObservers().length`