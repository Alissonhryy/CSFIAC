/**
 * Ponto de entrada principal da aplicação
 * Este arquivo é carregado quando a página é aberta
 */

import { initializeApp } from './app.js';
import { initializeLocalStorage, state } from './state/state.js';
import { safeLog, safeError } from './utils/logger.js';

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializar aplicação
        await initializeApp();
        
        // Carregar módulos dinamicamente conforme necessário
        // Exemplo: carregar módulo de cursos apenas quando a página de cursos for acessada
        setupLazyLoading();
        
        // Inicializar outras funcionalidades
        setupEventListeners();
        
        safeLog('Aplicação carregada com sucesso');
    } catch (error) {
        safeError('Erro ao inicializar aplicação:', error);
    }
});

/**
 * Configura lazy loading de módulos
 */
function setupLazyLoading() {
    // Exemplo: carregar módulo de cursos apenas quando necessário
    const coursesPage = document.getElementById('coursesPage');
    if (coursesPage) {
        // Usar Intersection Observer para carregar quando a página estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadModule('courses');
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(coursesPage);
    }
}

/**
 * Carrega um módulo dinamicamente
 */
async function loadModule(moduleName) {
    try {
        const module = await import(`./modules/${moduleName}.js`);
        if (module.init) {
            module.init();
        }
        return module;
    } catch (error) {
        safeError(`Erro ao carregar módulo ${moduleName}:`, error);
        return null;
    }
}

/**
 * Configura event listeners básicos
 */
function setupEventListeners() {
    // Event listeners globais podem ser adicionados aqui
    // Exemplo: atalhos de teclado, navegação, etc.
}

// Exportar para uso global se necessário
window.app = {
    loadModule,
    state
};

