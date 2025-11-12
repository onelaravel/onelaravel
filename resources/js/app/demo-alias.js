/**
 * Demo file để test alias @app
 */

// Sử dụng alias @app thay vì đường dẫn tương đối
import TestService from '@app/services/Test.js';
import { View } from '@app/core/view.js';

console.log('Testing @app alias:');
console.log('TestService:', TestService.create().getMessage());
console.log('View:', View);

// Export để có thể import từ nơi khác
export { TestService };
