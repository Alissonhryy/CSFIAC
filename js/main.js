// /js/main.js
import { AppState, StorageRepository } from './core/state.js';
import { initAccessibility } from './accessibility.js';
import { renderDashboard } from './dashboard.js';
import { showOnboarding } from './ux.js';
import { loadCardFields } from './courses.js';

export function initApp() {
    // Carregar dados
    AppState.loadFromLocalStorage();
    
    // Carregar campos do card
    loadCardFields();
    
    // Inicializar sistemas
    initAccessibility();
    
    // Mostrar onboarding se necessário
    showOnboarding();
    
    // Renderizar dashboard inicial
    renderDashboard();
    
    // Configurar event listeners
    initEventListeners();
    
    console.log('App inicializado');
}

function initEventListeners() {
    // Navegação
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.navigate;
            window.navigateTo?.(page);
        });
    });
    
    // Modais
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.currentTarget.dataset.modal;
            const action = e.currentTarget.dataset.modalAction || 'open';
            
            if (action === 'open') {
                window.openModal?.(modalId, e.currentTarget);
            } else {
                window.closeModal?.(modalId);
            }
        });
    });
    
    // PWA Install
    document.getElementById('pwaInstallBtn')?.addEventListener('click', () => {
        window.installPWA?.();
    });
    
    // Tema
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        window.toggleTheme?.();
    });
    
    // Font size
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size;
            window.setFontSize?.(size);
        });
    });
    
    // Export
    document.querySelectorAll('[data-export]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.export;
            if (type === 'excel') {
                window.exportCoursesToExcel?.();
            } else if (type === 'csv') {
                window.exportCoursesToCsv?.();
            }
        });
    });
    
    // Global search
    document.querySelector('.header-search-hint')?.addEventListener('click', () => {
        window.openGlobalSearch?.();
    });
    
    document.querySelector('.mobile-search-btn')?.addEventListener('click', () => {
        window.openGlobalSearch?.();
    });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

