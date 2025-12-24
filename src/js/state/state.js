/**
 * Gerenciamento de estado global da aplicação
 */

import { appConfig } from '../../config/app.config.js';

// Estado global
export const state = {
    cursos: [],
    instrutores: [],
    usuarios: [],
    activityLogs: [],
    currentUser: null,
    editingCourseId: null,
    editingInstructorId: null,
    editingUserId: null,
    currentMonth: new Date(),
    currentCalendarView: 'month',
    undoStack: [],
    redoStack: [],
    hasSeenOnboarding: localStorage.getItem(appConfig.storageKeys.hasSeenOnboarding) === 'true',
    auditLogs: JSON.parse(localStorage.getItem(appConfig.storageKeys.auditLogs) || '[]'),
    viewingCourseId: null,
    loteNames: {},
    isLoading: false,
    debounceTimer: null,
    calendarEvents: [],
    tasks: []
};

/**
 * Inicializa estado do localStorage
 */
export function initializeLocalStorage() {
    const keys = appConfig.storageKeys;
    
    if (!localStorage.getItem(keys.usuarios)) {
        localStorage.setItem(keys.usuarios, JSON.stringify(appConfig.defaultUsers));
    }
    if (!localStorage.getItem(keys.cursos)) {
        localStorage.setItem(keys.cursos, JSON.stringify([]));
    }
    if (!localStorage.getItem(keys.instrutores)) {
        localStorage.setItem(keys.instrutores, JSON.stringify([]));
    }
    if (!localStorage.getItem(keys.activityLogs)) {
        localStorage.setItem(keys.activityLogs, JSON.stringify([]));
    }
    
    // Carregar loteNames
    state.loteNames = JSON.parse(localStorage.getItem('loteNames') || '{}');
}

/**
 * Carrega estado do localStorage
 */
export function loadStateFromLocalStorage() {
    const keys = appConfig.storageKeys;
    
    state.cursos = JSON.parse(localStorage.getItem(keys.cursos) || '[]');
    state.instrutores = JSON.parse(localStorage.getItem(keys.instrutores) || '[]');
    state.usuarios = JSON.parse(localStorage.getItem(keys.usuarios) || '[]');
    state.activityLogs = JSON.parse(localStorage.getItem(keys.activityLogs) || '[]');
    state.loteNames = JSON.parse(localStorage.getItem('loteNames') || '{}');
    state.calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    if (state.currentUser?.id) {
        state.tasks = JSON.parse(localStorage.getItem(`tasks_${state.currentUser.id}`) || '[]');
    }
}

/**
 * Salva estado no localStorage
 */
export function saveStateToLocalStorage() {
    const keys = appConfig.storageKeys;
    
    localStorage.setItem(keys.cursos, JSON.stringify(state.cursos));
    localStorage.setItem(keys.instrutores, JSON.stringify(state.instrutores));
    localStorage.setItem(keys.usuarios, JSON.stringify(state.usuarios));
    localStorage.setItem(keys.activityLogs, JSON.stringify(state.activityLogs));
    localStorage.setItem('loteNames', JSON.stringify(state.loteNames));
    localStorage.setItem('calendarEvents', JSON.stringify(state.calendarEvents));
    
    if (state.currentUser?.id) {
        localStorage.setItem(`tasks_${state.currentUser.id}`, JSON.stringify(state.tasks));
    }
}

