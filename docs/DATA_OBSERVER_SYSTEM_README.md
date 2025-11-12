# Data Observer System for View Engine

🔍 **Hệ thống quan sát dữ liệu tự động cho View Engine**

## Tổng quan

Hệ thống Data Observer đã được tích hợp vào View Engine để tự động theo dõi và quan sát mọi thay đổi dữ liệu trong các view. Hệ thống này cung cấp:

- ✅ **Automatic State Tracking**: Tự động theo dõi state changes
- ✅ **Props Monitoring**: Quan sát props changes
- ✅ **Global Observation**: Theo dõi toàn bộ system
- ✅ **Performance Monitoring**: Đo lường hiệu suất
- ✅ **History Tracking**: Lưu lịch sử thay đổi
- ✅ **Debug Support**: Hỗ trợ debug mode
- ✅ **Memory Management**: Quản lý memory tự động

## Files đã tạo

### Core Files
- `resources/js/app/core/DataObserver.js` - Main observer classes
- `resources/js/app/core/DataObserverGlobal.js` - Global utilities và exports
- `resources/js/app/examples/DataObserverExamples.js` - Examples và demo code

### Documentation
- `docs/DATA_OBSERVER_DOCUMENTATION.md` - Chi tiết documentation
- `docs/DATA_OBSERVER_SYSTEM_README.md` - File này

### Demo
- `resources/views/web/test.blade.php` - Live demo với UI

### Integration
- `resources/js/app/core/ViewEngine.js` - Đã tích hợp DataObserver
- `resources/js/app/app.js` - Added global import

## Quick Start

### 1. Automatic Usage
DataObserver được tự động khởi tạo khi tạo ViewEngine:

```javascript
const view = new ViewEngine('my.view', { viewId: 'unique-id' });
// DataObserver tự động được tạo và theo dõi view này
```

### 2. Subscribe to Changes
```javascript
// Subscribe to state changes của view này
const unsubscribe = view.onStateChange((changeData) => {
    console.log('State changed:', {
        key: changeData.key,
        oldValue: changeData.oldValue,
        newValue: changeData.newValue
    });
});

// Tạo state - sẽ được observer theo dõi
const [count, setCount] = view.states.__useState(0, 'count');
setCount(1); // Trigger observer callback
```

### 3. Global Observation
```javascript
// Subscribe to tất cả changes từ mọi view
const unsubscribe = dataObserver.subscribeToAll((eventData) => {
    console.log('Global change:', eventData.eventType, 'in view', eventData.viewId);
});
```

### 4. Browser Console Usage
```javascript
// Enable debug mode
observerUtils.enableDebug();

// Show global summary
observerUtils.summary();

// List all active observers
observerUtils.listObservers();

// Monitor specific view
observerUtils.monitor('view-id', 5000); // Monitor for 5 seconds

// Run performance test
observerUtils.perfTest(1000); // 1000 iterations

// Help
observerUtils.help();
```

## Live Demo

Truy cập `/web/test` để xem live demo với:
- Real-time state change tracking
- Visual log của mọi thay đổi
- Performance testing
- Data summary display
- Interactive controls

## Key Features

### Automatic Integration
- Tự động khởi tạo khi tạo ViewEngine
- Tự động cleanup khi view destroyed
- Zero configuration required

### Real-time Monitoring
- Track state changes instant
- Monitor props modifications
- Global view changes tracking

### Performance Optimized
- Debounced events (configurable)
- Memory-efficient history storage
- Automatic cleanup

### Developer Friendly
- Debug mode với detailed logs
- Browser console utilities
- Rich examples và documentation
- Performance testing tools

## Examples trong Browser Console

```javascript
// Run all examples
DataObserverExamples.runAllExamples();

// Individual examples
DataObserverExamples.exampleBasicStateObservation();
DataObserverExamples.exampleGlobalDataObservation();
DataObserverExamples.exampleDataSummaryAndHistory();
DataObserverExamples.exampleCustomEventFiltering();
DataObserverExamples.exampleDebugMode();
```

## API Quick Reference

### ViewEngine Methods (New)
- `view.onStateChange(callback)` - Subscribe to state changes
- `view.onPropsChange(callback)` - Subscribe to props changes  
- `view.getDataSummary()` - Get data summary
- `view.getChangeHistory(limit)` - Get change history
- `view.takeDataSnapshot()` - Take current snapshot
- `view.clearDataHistory()` - Clear history

### Global Observer
- `dataObserver.enableDebugMode()` - Enable debug
- `dataObserver.subscribeToAll(callback)` - Subscribe to all changes
- `dataObserver.getDataSummary()` - Global summary
- `dataObserver.getAllObservers()` - List observers

### Browser Utilities
- `observerUtils.*` - Convenience methods
- `window.dataObserver` - Global instance
- `window.DataObserver` - Main class
- `window.DataObserverExamples` - Examples

## Configuration

Observer được tạo với default options:
```javascript
{
    trackState: true,        // Track state changes
    trackProps: true,        // Track props changes
    trackMethods: false,     // Track method calls (future)
    debounceMs: 10,         // Debounce time
    maxHistorySize: 100     // Max history entries
}
```

## Memory Management

- Observers tự động được cleanup khi view destroyed
- History có giới hạn size để tránh memory leak
- Unsubscribe functions được return để manual cleanup

## Debug Mode

```javascript
// Enable debug cho detailed logs
dataObserver.enableDebugMode();

// Disable khi không cần
dataObserver.disableDebugMode();
```

## Next Steps

1. **Test Demo**: Truy cập `/web/test` để test
2. **Read Docs**: Xem `DATA_OBSERVER_DOCUMENTATION.md` 
3. **Run Examples**: Chạy examples trong console
4. **Integrate**: Sử dụng trong views của bạn

---

**Hệ thống DataObserver giờ đã sẵn sàng để sử dụng! 🚀**