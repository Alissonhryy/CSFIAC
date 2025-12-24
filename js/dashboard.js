// /js/dashboard.js
import { AppState } from './core/state.js';
import { Logger } from './core/config.js';

let chartsInitialized = false;
let coursesTimelineChart = null;
let coursesStatusChart = null;

export function renderDashboard() {
    const dashboardPage = document.getElementById('dashboardPage');
    if (!dashboardPage?.classList.contains('active')) {
        return;
    }
    
    if (AppState.courses.length === 0) {
        renderEmptyState();
        return;
    }
    
    updateKPIs();
    renderRecentCourses();
    renderDashboardCharts();
    renderDashboardCTAs();
}

export function updateKPIs() {
    const courses = AppState.courses;
    
    const totalEl = document.getElementById('totalCourses');
    const completedEl = document.getElementById('completedCourses');
    const ongoingEl = document.getElementById('ongoingCourses');
    const studentsEl = document.getElementById('totalStudents');
    
    if (totalEl) {
        totalEl.textContent = courses.length;
        const card = totalEl.closest('.kpi-card');
        if (card) {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Total de cursos: ${courses.length}. Clique para ver todos os cursos.`);
            card.addEventListener('click', () => {
                window.navigateTo?.('courses');
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.navigateTo?.('courses');
                }
            });
        }
    }
    
    if (completedEl) {
        const completed = courses.filter(c => normalizeStatus(c.status) === 'Concluído').length;
        completedEl.textContent = completed;
        const card = completedEl.closest('.kpi-card');
        if (card) {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Cursos concluídos: ${completed}. Clique para filtrar.`);
            card.addEventListener('click', () => {
                window.navigateTo?.('courses');
                setTimeout(() => {
                    const filter = document.querySelector('[data-filter="Concluído"]');
                    filter?.click();
                }, 100);
            });
        }
    }
    
    if (ongoingEl) {
        const ongoing = courses.filter(c => normalizeStatus(c.status) === 'Em Andamento').length;
        ongoingEl.textContent = ongoing;
        const card = ongoingEl.closest('.kpi-card');
        if (card) {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Cursos em andamento: ${ongoing}. Clique para filtrar.`);
            card.addEventListener('click', () => {
                window.navigateTo?.('courses');
                setTimeout(() => {
                    const filter = document.querySelector('[data-filter="Em Andamento"]');
                    filter?.click();
                }, 100);
            });
        }
    }
    
    if (studentsEl) {
        const students = courses.reduce((sum, c) => sum + (parseInt(c.alunos) || 0), 0);
        studentsEl.textContent = students;
    }
}

export function renderEmptyState() {
    const dashboardPage = document.getElementById('dashboardPage');
    if (!dashboardPage) return;
    
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="empty-state-icon">
            <span class="material-icons">school</span>
        </div>
        <h2 class="empty-state-title">Bem-vindo ao CSF!</h2>
        <p class="empty-state-description">
            Comece cadastrando seu primeiro curso. Você poderá acompanhar o progresso,
            gerenciar instrutores e muito mais.
        </p>
        <div class="empty-state-cta">
            <button class="btn btn-primary btn-lg" data-action="add-course" aria-label="Cadastrar primeiro curso">
                <span class="material-icons">add</span>
                Cadastrar Primeiro Curso
            </button>
        </div>
    `;
    
    const existingContent = dashboardPage.querySelector('.dashboard-content');
    if (existingContent) {
        existingContent.remove();
    }
    
    dashboardPage.appendChild(emptyState);
    
    const btn = emptyState.querySelector('[data-action="add-course"]');
    if (btn) {
        btn.addEventListener('click', () => {
            window.openCourseModal?.();
        });
    }
}

export function renderRecentCourses() {
    const container = document.getElementById('recentCoursesList');
    if (!container) return;
    
    const recentCourses = [...AppState.courses]
        .sort((a, b) => {
            const dateA = a.updatedAt || a.createdAt || a.inicio || '';
            const dateB = b.updatedAt || b.createdAt || b.inicio || '';
            return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 4);
    
    if (recentCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 2rem;">
                <p style="color: var(--text-muted);">Nenhum curso recente</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    recentCourses.forEach(course => {
        const item = document.createElement('div');
        item.className = 'recent-course-item card card-interactive';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Curso: ${course.curso || 'Sem nome'}. Clique para ver detalhes.`);
        
        item.innerHTML = `
            <div class="recent-course-info" style="flex: 1;">
                <h4>${course.curso || 'Sem nome'}</h4>
                <p>${course.cidade || 'N/A'} • ${normalizeStatus(course.status)}</p>
                ${course.nota ? `
                    <div class="course-note" style="margin-top: 0.5rem;">
                        <span class="material-icons">sticky_note_2</span>
                        <span class="course-note-text">${course.nota}</span>
                    </div>
                ` : ''}
            </div>
            <button class="btn btn-ghost btn-sm" aria-label="Ver detalhes do curso">
                <span class="material-icons">arrow_forward</span>
            </button>
        `;
        
        item.addEventListener('click', () => {
            window.openViewCourseModal?.(course.id);
        });
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.openViewCourseModal?.(course.id);
            }
        });
        
        fragment.appendChild(item);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}

export function renderDashboardCTAs() {
    const dashboardHeader = document.querySelector('#dashboardPage .header');
    if (!dashboardHeader) return;
    
    let ctaContainer = dashboardHeader.querySelector('.dashboard-ctas');
    if (!ctaContainer) {
        ctaContainer = document.createElement('div');
        ctaContainer.className = 'dashboard-ctas';
        ctaContainer.style.cssText = 'display: flex; gap: 0.75rem; margin-left: auto;';
        dashboardHeader.appendChild(ctaContainer);
    }
    
    ctaContainer.innerHTML = `
        <button class="btn btn-primary" data-action="add-course" aria-label="Cadastrar novo curso">
            <span class="material-icons">add</span>
            Cadastrar Curso
        </button>
        <button class="btn btn-secondary" data-action="view-all" aria-label="Ver todos os cursos">
            <span class="material-icons">list</span>
            Ver Todos
        </button>
        <button class="btn btn-ghost" data-action="generate-report" aria-label="Gerar relatório">
            <span class="material-icons">description</span>
            Relatório
        </button>
    `;
    
    ctaContainer.querySelector('[data-action="add-course"]')?.addEventListener('click', () => {
        window.openCourseModal?.();
    });
    
    ctaContainer.querySelector('[data-action="view-all"]')?.addEventListener('click', () => {
        window.navigateTo?.('courses');
    });
    
    ctaContainer.querySelector('[data-action="generate-report"]')?.addEventListener('click', () => {
        window.openReportModal?.();
    });
}

export function renderDashboardCharts() {
    if (chartsInitialized) {
        return;
    }
    
    const dashboardPage = document.getElementById('dashboardPage');
    if (!dashboardPage?.classList.contains('active')) {
        return;
    }
    
    const chartsContainer = document.querySelector('.dashboard-charts');
    if (!chartsContainer) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chartsInitialized) {
                initCharts();
                chartsInitialized = true;
                observer.disconnect();
            }
        });
    }, { rootMargin: '50px' });
    
    observer.observe(chartsContainer);
}

function initCharts() {
    Logger.log('Inicializando gráficos do dashboard...');
    renderCoursesTimelineChart();
    renderCoursesStatusChart();
}

function renderCoursesTimelineChart() {
    const canvas = document.getElementById('coursesTimelineChart');
    if (!canvas) return;
    
    if (coursesTimelineChart) {
        coursesTimelineChart.destroy();
    }
    
    // Implementar gráfico com Chart.js
    // (manter lógica existente do index.html)
}

function renderCoursesStatusChart() {
    const canvas = document.getElementById('dashboardStatusChart');
    if (!canvas) return;
    
    if (coursesStatusChart) {
        coursesStatusChart.destroy();
    }
    
    // Implementar gráfico com Chart.js
    // (manter lógica existente do index.html)
}

// Helper function (deve estar disponível globalmente)
function normalizeStatus(status) {
    if (!status) return 'Pendente';
    const normalized = status.toLowerCase().trim();
    const statusMap = {
        'concluído': 'Concluído',
        'concluido': 'Concluído',
        'em andamento': 'Em Andamento',
        'andamento': 'Em Andamento',
        'pendente': 'Pendente',
        'cancelado': 'Cancelado'
    };
    return statusMap[normalized] || status;
}

// Exportar para uso global
window.renderDashboard = renderDashboard;
window.updateKPIs = updateKPIs;
window.renderRecentCourses = renderRecentCourses;
window.renderDashboardCTAs = renderDashboardCTAs;
window.renderDashboardCharts = renderDashboardCharts;
window.normalizeStatus = normalizeStatus;

