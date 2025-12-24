// /js/accessibility.js
import { Logger } from './core/config.js';

export function initAccessibility() {
    addAriaLabels();
    setupKeyboardNavigation();
    setupFocusManagement();
    setupScreenReaderAnnouncements();
}

function addAriaLabels() {
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
        const icon = btn.querySelector('.material-icons');
        const text = btn.textContent.trim();
        
        if (!text && icon) {
            const iconName = icon.textContent;
            const label = getIconLabel(iconName);
            if (label) {
                btn.setAttribute('aria-label', label);
            }
        }
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.getAttribute('aria-labelledby')) {
            const title = modal.querySelector('h3');
            if (title) {
                const id = `modal-title-${Date.now()}`;
                title.id = id;
                modal.setAttribute('aria-labelledby', id);
            }
        }
    });
}

function getIconLabel(iconName) {
    const labels = {
        'add': 'Adicionar',
        'edit': 'Editar',
        'delete': 'Excluir',
        'close': 'Fechar',
        'search': 'Buscar',
        'menu': 'Menu',
        'settings': 'Configurações',
        'download': 'Baixar',
        'upload': 'Enviar',
        'save': 'Salvar',
        'cancel': 'Cancelar',
        'arrow_forward': 'Avançar',
        'arrow_back': 'Voltar',
        'check': 'Confirmar'
    };
    
    return labels[iconName] || null;
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
            e.preventDefault();
            e.target.click();
        }
        
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        }
    });
}

function setupFocusManagement() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

function setupScreenReaderAnnouncements() {
    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Exportar
window.initAccessibility = initAccessibility;

