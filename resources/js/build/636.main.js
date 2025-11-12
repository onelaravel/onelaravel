"use strict";
(Object(typeof self !== 'undefined' ? self : this)["webpackChunkApp"] = Object(typeof self !== 'undefined' ? self : this)["webpackChunkApp"] || []).push([[636],{

/***/ 636:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Modal Component Module
 * ES6 Module for Blade Compiler
 */

class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    render() {
        if (!this.isOpen) return '';
        
        return `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${this.title}</h3>
                        <button onclick="this.close()">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                </div>
            </div>
        `;
    }
}
// Export for ES6 modules
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);


/***/ })

}]);