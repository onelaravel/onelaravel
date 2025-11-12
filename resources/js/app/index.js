// Export App for external use
import { App } from './app.js';

// Manual assignment to window for UMD compatibility
if (typeof window !== 'undefined') {
    window.App = App;
    console.log('🔍 App assigned to window');
    
    // Initialize app when APP_CONFIGS is available
    if (window.APP_CONFIGS) {
        console.log('🔍 APP_CONFIGS available, calling App.init()');
        App.init();
    } else {
        console.log('🔍 APP_CONFIGS not available, waiting...');
        // Wait for APP_CONFIGS to be available
        const checkConfig = () => {
            if (window.APP_CONFIGS) {
                console.log('🔍 APP_CONFIGS found, calling App.init()');
                App.init();
            } else {
                setTimeout(checkConfig, 100);
            }
        };
        checkConfig();
    }
}

export { App };
export default App;
