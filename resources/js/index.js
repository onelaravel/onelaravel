/**
 * Auto-generated index.js for Blade Compiler
 * Generated: 2025-09-23T18:48:33.512Z
 * Runtime modules: 13
 * Build-time modules: 1
 */

// Runtime modules (auto-discovered)
import './app/HttpService.js';
import './app/api.js';
import './app/app.js';
import './app/components/Button.js';
import './app/components/Modal.js';
import './app/event-manager.js';
import './app/init.js';
import './app/module-standard.js';
import './app/router.js';
import './app/seo-config.js';
import './app/utils/helpers.js';
import './app/utils/validation.js';
import './app/view.js';
import './view.templates.js';

// Export main App object
export default window.App;

// Export individual modules for development
export const modules = {
    'HttpService': () => import('./app/HttpService.js'),
    'api': () => import('./app/api.js'),
    'app': () => import('./app/app.js'),
    'Button': () => import('./app/components/Button.js'),
    'Modal': () => import('./app/components/Modal.js'),
    'event-manager': () => import('./app/event-manager.js'),
    'init': () => import('./app/init.js'),
    'module-standard': () => import('./app/module-standard.js'),
    'router': () => import('./app/router.js'),
    'seo-config': () => import('./app/seo-config.js'),
    'helpers': () => import('./app/utils/helpers.js'),
    'validation': () => import('./app/utils/validation.js'),
    'view': () => import('./app/view.js'),
};

// Build-time modules (not imported, used during build process)
export const buildTimeModules = [
    'view.templates.js',
];
