/**
 * Button Component Module
 * ES6 Module for Blade Compiler
 */

// Initialize global App object
if (typeof window !== 'undefined') {
    if (!window.App) {
        window.App = {};
    }
}

export class Button {
    constructor(text, onClick) {
        this.text = text;
        this.onClick = onClick;
    }

    render() {
        return `<button onclick="${this.onClick}">${this.text}</button>`;
    }
}

// Register with global App object
if (typeof window !== 'undefined') {
    window.App.Button = Button;
}

// Export for ES6 modules
export default Button;
