/**
 * Demo file ở thư mục khác để test alias @app từ xa
 */

// Test import từ thư mục khác sử dụng alias @app
import TestService from '@app/services/Test.js';
import { View } from '@app/core/view.js';

console.log('Testing @app alias from remote directory:');
console.log('TestService:', TestService.create().getMessage());
console.log('View available:', !!View);

export { TestService };
