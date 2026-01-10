/**
 * Gerenciador de Atalhos de Teclado
 * Desabilita atalhos quando modais estão abertos
 */

class KeyboardShortcutsManager {
    constructor() {
        this.isEnabled = true;
        this.modalSelectors = [
            '.modal-overlay.active',
            '.modal.active',
            '[id*="Modal"].active',
            '[class*="modal"].active'
        ];
    }

    /**
     * Verifica se algum modal está aberto
     * @returns {boolean} True se modal está aberto
     */
    isModalOpen() {
        for (const selector of this.modalSelectors) {
            const element = document.querySelector(selector);
            if (element && element.style.display !== 'none') {
                return true;
            }
        }
        
        // Verificar também por display: flex
        const modals = document.querySelectorAll('.modal-overlay, [id*="Modal"]');
        for (const modal of modals) {
            const style = window.getComputedStyle(modal);
            if (style.display === 'flex' || style.display === 'block') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Verifica se atalhos devem ser habilitados
     * @returns {boolean} True se atalhos podem ser executados
     */
    shouldEnableShortcuts() {
        // Desabilitar se modal está aberto
        if (this.isModalOpen()) {
            return false;
        }
        
        // Desabilitar se estiver em input/textarea/select
        const activeElement = document.activeElement;
        if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
            return false;
        }
        
        return this.isEnabled;
    }

    /**
     * Intercepta eventos de teclado
     * @param {KeyboardEvent} event - Evento de teclado
     */
    interceptKeyboardEvent(event) {
        if (!this.shouldEnableShortcuts()) {
            // Não fazer nada, apenas prevenir propagação de alguns eventos
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'n', 'c', 'i', 't', 'g', 'h', 'r'].includes(event.key.toLowerCase())) {
                // Prevenir apenas se estiver em modal
                if (this.isModalOpen()) {
                    event.stopPropagation();
                }
            }
        }
    }

    /**
     * Habilita gerenciador
     */
    enable() {
        this.isEnabled = true;
    }

    /**
     * Desabilita gerenciador
     */
    disable() {
        this.isEnabled = false;
    }
}

// Criar instância global
const keyboardShortcutsManager = new KeyboardShortcutsManager();

/**
 * Interceptar eventos de teclado globalmente
 */
document.addEventListener('keydown', (event) => {
    keyboardShortcutsManager.interceptKeyboardEvent(event);
}, true); // Use capture phase para interceptar antes

/**
 * Wrapper para funções de atalho existentes
 */
function wrapKeyboardShortcut(originalFunction) {
    return function(...args) {
        if (!keyboardShortcutsManager.shouldEnableShortcuts()) {
            return;
        }
        return originalFunction.apply(this, args);
    };
}

// Exportar
if (typeof window !== 'undefined') {
    window.KeyboardShortcutsManager = KeyboardShortcutsManager;
    window.keyboardShortcutsManager = keyboardShortcutsManager;
    window.wrapKeyboardShortcut = wrapKeyboardShortcut;
}

