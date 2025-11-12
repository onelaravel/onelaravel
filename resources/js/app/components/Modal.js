/**
 * Modal Component Module
 * ES6 Module for Blade Compiler
 */

export class Modal {
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
export default Modal;
