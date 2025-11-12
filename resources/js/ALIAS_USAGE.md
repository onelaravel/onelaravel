# Sử dụng Alias @app trong JavaScript

## 🎯 Mục đích
Alias `@app` giúp import các module từ `resources/js/app` một cách ngắn gọn và không phụ thuộc vào vị trí file hiện tại.

## 📁 Cấu hình
Alias đã được cấu hình trong:
- `webpack.config.js` - cho build production
- `vite.config.js` - cho development

## 💡 Cách sử dụng

### ✅ Thay vì:
```javascript
// Đường dẫn tương đối phức tạp
import View from '../../../core/view.js';
import TestService from '../../services/Test.js';
import { useState } from '../../../core/ViewState.js';
```

### ✅ Sử dụng:
```javascript
// Đường dẫn ngắn gọn với alias
import View from '@app/core/view.js';
import TestService from '@app/services/Test.js';
import { useState } from '@app/core/ViewState.js';
```

## 🔧 Ví dụ thực tế

### Trong view files:
```javascript
// CustomTestSetup.js
import { View } from '@app/core/view.js';
import TestService from '@app/services/Test.js';

export function CustomTestSetup(data = {}) {
    const {App, View} = data;
    // ... rest of code
}
```

### Trong core modules:
```javascript
// ViewEngine.js
import { ViewState } from '@app/core/ViewState.js';
import { SectionEngine } from '@app/core/SectionEngine.js';
```

### Trong services:
```javascript
// services/Test.js
import { View } from '@app/core/view.js';
import { HttpService } from '@app/core/HttpService.js';
```

## ⚠️ Lưu ý
- Alias chỉ hoạt động trong **webpack build** và **vite dev server**
- Không hoạt động với **Node.js trực tiếp** (require/import)
- Luôn sử dụng extension `.js` khi import
- Alias `@app` tương đương với `@` (cả hai đều trỏ đến `resources/js/app`)

## 🚀 Lợi ích
1. **Code ngắn gọn**: Không cần `../../../` phức tạp
2. **Dễ refactor**: Di chuyển file không ảnh hưởng import
3. **Nhất quán**: Tất cả import đều có format giống nhau
4. **Dễ đọc**: Rõ ràng file đang import từ đâu
