"use strict";
(Object(typeof self !== 'undefined' ? self : this)["webpackChunkApp"] = Object(typeof self !== 'undefined' ? self : this)["webpackChunkApp"] || []).push([[263],{

/***/ 263:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validation: () => (/* binding */ Validation),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Validation Utility Module
 * ES6 Module for Blade Compiler
 */

class Validation {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isPhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    }

    static isRequired(value) {
        return value !== null && value !== undefined && value !== '';
    }

    static minLength(value, min) {
        return value && value.length >= min;
    }

    static maxLength(value, max) {
        return value && value.length <= max;
    }
}


// Export for ES6 modules
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Validation);


/***/ })

}]);