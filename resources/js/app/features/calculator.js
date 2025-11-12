/**
 * Calculator Feature Module
 * ES6 Module for testing auto-discovery in subdirectories
 */

export class Calculator {
    constructor() {
        this.history = [];
    }

    add(a, b) {
        const result = a + b;
        this.history.push(`${a} + ${b} = ${result}`);
        return result;
    }

    subtract(a, b) {
        const result = a - b;
        this.history.push(`${a} - ${b} = ${result}`);
        return result;
    }

    multiply(a, b) {
        const result = a * b;
        this.history.push(`${a} * ${b} = ${result}`);
        return result;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        const result = a / b;
        this.history.push(`${a} / ${b} = ${result}`);
        return result;
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
    }
}

// Register with global App object
if (typeof window !== 'undefined' && window.App) {
    window.App.Calculator = Calculator;
}

// Export for ES6 modules
export default Calculator;
