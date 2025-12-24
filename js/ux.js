// /js/ux.js
import { AppState } from './core/state.js';
import { Logger, handleError } from './core/config.js';

export function showOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
    if (hasSeenOnboarding) return;
    
    if (AppState.courses.length > 0) {
        localStorage.setItem('hasSeenOnboarding', 'true');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'onboarding-title');
    modal.setAttribute('aria-modal', 'true');
    
    modal.innerHTML = `
        <div class="modal" style="max-width: 600px;">
            <div class="modal-header">
                <h3 id="onboarding-title">Bem-vindo ao CSF!</h3>
            </div>
            <div class="modal-body">
                <div class="onboarding-content">
                    <div class="onboarding-step">
                        <span class="material-icons" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">school</span>
                        <h4>Cadastre seus cursos</h4>
                        <p>Comece adicionando seu primeiro curso. Você pode importar uma planilha Excel ou cadastrar manualmente.</p>
                    </div>
                    <div class="onboarding-step">
                        <span class="material-icons" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">people</span>
                        <h4>Gerencie instrutores</h4>
                        <p>Adicione instrutores e associe aos cursos. Mantenha tudo organizado em um só lugar.</p>
                    </div>
                    <div class="onboarding-step">
                        <span class="material-icons" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">dashboard</span>
                        <h4>Acompanhe o progresso</h4>
                        <p>Visualize gráficos e relatórios para entender melhor o desempenho dos seus cursos.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-action="skip-onboarding">Pular</button>
                <button class="btn btn-primary" data-action="start-onboarding">
                    Começar
                    <span class="material-icons">arrow_forward</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('[data-action="skip-onboarding"]')?.addEventListener('click', () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        modal.remove();
    });
    
    modal.querySelector('[data-action="start-onboarding"]')?.addEventListener('click', () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        modal.remove();
        window.openCourseModal?.();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            localStorage.setItem('hasSeenOnboarding', 'true');
            modal.remove();
        }
    });
}

export function confirmAction(message, onConfirm, onCancel = null) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'confirm-title');
        modal.setAttribute('aria-modal', 'true');
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h3 id="confirm-title">Confirmar ação</h3>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-primary);">${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-action="cancel" aria-label="Cancelar">
                        Cancelar
                    </button>
                    <button class="btn btn-danger" data-action="confirm" aria-label="Confirmar">
                        Confirmar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const cancelBtn = modal.querySelector('[data-action="cancel"]');
        if (cancelBtn) cancelBtn.focus();
        
        modal.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
            resolve(false);
        });
        
        modal.querySelector('[data-action="confirm"]')?.addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
            resolve(true);
        });
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
                if (onCancel) onCancel();
                resolve(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
}

export function showProgress(message, progress = 0) {
    let progressBar = document.getElementById('global-progress-bar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'global-progress-bar';
        progressBar.className = 'progress-bar-container';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', '0');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.innerHTML = `
            <div class="progress-bar-content">
                <p class="progress-bar-message">${message}</p>
                <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        document.body.appendChild(progressBar);
    }
    
    const messageEl = progressBar.querySelector('.progress-bar-message');
    const fillEl = progressBar.querySelector('.progress-bar-fill');
    
    if (messageEl) messageEl.textContent = message;
    if (fillEl) fillEl.style.width = `${progress}%`;
    
    progressBar.setAttribute('aria-valuenow', progress);
    
    if (progress >= 100) {
        setTimeout(() => {
            progressBar?.remove();
        }, 1000);
    }
}

export function openGlobalSearch() {
    const searchModal = document.getElementById('globalSearchModal');
    if (!searchModal) {
        const modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'search-title');
        modal.setAttribute('aria-modal', 'true');
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 id="search-title">Buscar</h3>
                    <button class="modal-close" aria-label="Fechar busca">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="search-input-container">
                        <input 
                            type="text" 
                            id="globalSearchInput" 
                            class="search-input"
                            placeholder="Buscar cursos, instrutores, alunos..."
                            aria-label="Campo de busca"
                            autofocus
                        />
                        <span class="material-icons">search</span>
                    </div>
                    <div class="search-shortcuts">
                        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1rem;">
                            <strong>Atalhos:</strong>
                            <kbd>Ctrl+K</kbd> para buscar,
                            <kbd>Esc</kbd> para fechar
                        </p>
                    </div>
                    <div id="searchResults" class="search-results"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const input = modal.querySelector('#globalSearchInput');
        const results = modal.querySelector('#searchResults');
        
        input?.addEventListener('input', (e) => {
            performSearch(e.target.value, results);
        });
        
        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                modal.classList.add('active');
                input?.focus();
            }
        });
    }
    
    const modal = document.getElementById('globalSearchModal');
    modal?.classList.add('active');
    const input = modal?.querySelector('#globalSearchInput');
    input?.focus();
}

function performSearch(query, resultsContainer) {
    if (!query || query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const queryLower = query.toLowerCase();
    const matches = [];
    
    AppState.courses.forEach(course => {
        const match = 
            (course.curso?.toLowerCase().includes(queryLower)) ||
            (course.cidade?.toLowerCase().includes(queryLower)) ||
            (course.instrutor?.toLowerCase().includes(queryLower));
        
        if (match) {
            matches.push({
                type: 'course',
                title: course.curso,
                subtitle: `${course.cidade} • ${course.instrutor}`,
                id: course.id,
                action: () => window.openViewCourseModal?.(course.id)
            });
        }
    });
    
    AppState.instructors.forEach(instructor => {
        if (instructor.nome?.toLowerCase().includes(queryLower)) {
            matches.push({
                type: 'instructor',
                title: instructor.nome,
                subtitle: instructor.email || '',
                id: instructor.id,
                action: () => window.openInstructorModal?.(instructor.id)
            });
        }
    });
    
    if (matches.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <span class="material-icons">search_off</span>
                <p>Nenhum resultado encontrado</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    matches.slice(0, 10).forEach(match => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <span class="material-icons">${match.type === 'course' ? 'school' : 'person'}</span>
            <div>
                <h4>${match.title}</h4>
                <p>${match.subtitle}</p>
            </div>
        `;
        
        item.addEventListener('click', () => {
            match.action();
            document.getElementById('globalSearchModal')?.classList.remove('active');
        });
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                match.action();
                document.getElementById('globalSearchModal')?.classList.remove('active');
            }
        });
        
        fragment.appendChild(item);
    });
    
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(fragment);
}

// Exportar para uso global
window.showOnboarding = showOnboarding;
window.confirmAction = confirmAction;
window.showProgress = showProgress;
window.openGlobalSearch = openGlobalSearch;

