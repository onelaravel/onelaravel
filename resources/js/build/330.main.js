"use strict";
(this["webpackChunkApp"] = this["webpackChunkApp"] || []).push([[330],{

/***/ 330:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventManager: () => (/* binding */ EventManager)
/* harmony export */ });
/**
 * event-manager Module
 * ES6 Module for Blade Compiler
 */
/**
 * Event Manager - Handle DOM events với multiple handlers
 * Tích hợp với Blade Event Directives
 */

class EventManager {
    constructor() {
        this.eventRegistry = {};
        this.setupGlobalEventListeners();
        this.loadEventRegistry();
    }
    
    /**
     * Setup global event listeners cho tất cả events
     */
    setupGlobalEventListeners() {
        const events = [
            'click', 'dblclick', 'contextmenu',
            'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove',
            'mousedown', 'mouseup',
            'keydown', 'keyup', 'keypress',
            'focus', 'blur', 'focusin', 'focusout',
            'input', 'change', 'submit', 'reset',
            'touchstart', 'touchmove', 'touchend', 'touchcancel',
            'load', 'unload', 'resize', 'scroll',
            'play', 'pause', 'ended',
            'dragstart', 'drag', 'dragend', 'dragover', 'drop',
            'select', 'selectstart', 'selectionchange'
        ];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                this.handleEvent(eventType, event);
            }, true);
        });
    }
    
    /**
     * Handle event với multiple handlers
     */
    handleEvent(eventType, event) {
        const element = event.target.closest(`[data-event-type="${eventType}"]`);
        if (!element) return;
        
        const elementId = element.dataset.elementId;
        const eventData = this.eventRegistry[elementId];
        
        if (eventData && eventData.event_type === eventType) {
            // Execute all handlers
            eventData.handlers.forEach(handler => {
                this.executeHandler(handler, event);
            });
        }
    }
    
    /**
     * Execute individual handler
     */
    executeHandler(handler, event) {
        try {
            const handlerName = handler.handler;
            const params = handler.params.map(param => {
                // Replace special parameters
                if (param === '@EVENT' || param === 'Event') {
                    return event;
                }
                return param;
            });
            
            // Call handler function
            if (typeof window[handlerName] === 'function') {
                window[handlerName](...params);
            } else if (typeof View?.[handlerName] === 'function') {
                View[handlerName](...params);
            } else {
                console.warn(`Handler function '${handlerName}' not found`);
            }
        } catch (error) {
            console.error('Error executing event handler:', error);
        }
    }
    
    /**
     * Load event registry từ server
     */
    loadEventRegistry() {
        // Load từ script tag
        const eventScript = document.querySelector('script[data-type="event-registry"]');
        if (eventScript) {
            try {
                const eventData = JSON.parse(eventScript.textContent);
                this.eventRegistry = { ...this.eventRegistry, ...eventData };
            } catch (error) {
                console.error('Error parsing event registry:', error);
            }
        }
        
        // Load từ global variable nếu có
        if (window.__SERVER_EVENT_DATA) {
            this.eventRegistry = { ...this.eventRegistry, ...window.__SERVER_EVENT_DATA };
        }
    }
    
    /**
     * Register event data manually
     */
    registerEventData(elementId, eventData) {
        this.eventRegistry[elementId] = eventData;
    }
    
    /**
     * Get event registry
     */
    getEventRegistry() {
        return this.eventRegistry;
    }
}


// Export for ES6 modules



/***/ })

}]);