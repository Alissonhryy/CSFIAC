// /js/core/state.js
export const AppState = {
    user: null,
    tasks: [],
    courses: [],
    instructors: [],
    users: [],
    activityLogs: [],
    calendarEvents: [],
    loteNames: {},
    isLoading: false,
    
    setTasks(newTasks) {
        this.tasks = newTasks;
        if (typeof window.renderTasks === 'function') {
            window.renderTasks();
            window.updateTaskBadge?.();
            window.updateTaskStats?.();
        }
    },
    
    setCourses(newCourses) {
        this.courses = newCourses;
        window.updateKPIs?.();
        window.renderCalendar?.();
        window.renderDashboardReport?.();
        window.updateLoteFilter?.();
        window.updateCursoFilter?.();
        if (document.getElementById('coursesPage')?.classList.contains('active')) {
            window.renderCoursesByLote?.();
        }
    },
    
    setInstructors(newInstructors) {
        this.instructors = newInstructors;
        window.renderInstructors?.();
        window.updateInstructorSelect?.();
    },
    
    setUsers(newUsers) {
        this.users = newUsers;
        window.renderUsers?.();
    },
    
    saveToLocalStorage() {
        try {
            StorageRepository.setItem('cursos', this.courses);
            StorageRepository.setItem('instrutores', this.instructors);
            StorageRepository.setItem('usuarios', this.users);
            StorageRepository.setItem('activityLogs', this.activityLogs);
            StorageRepository.setItem('calendarEvents', this.calendarEvents);
            StorageRepository.setItem('loteNames', this.loteNames);
            if (this.user?.id) {
                StorageRepository.setItem(`tasks_${this.user.id}`, this.tasks);
            }
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            window.showToast?.('Erro ao salvar dados localmente', 'error');
        }
    },
    
    loadFromLocalStorage() {
        try {
            this.courses = StorageRepository.getItem('cursos', []);
            this.instructors = StorageRepository.getItem('instrutores', []);
            this.users = StorageRepository.getItem('usuarios', []);
            this.activityLogs = StorageRepository.getItem('activityLogs', []);
            this.calendarEvents = StorageRepository.getItem('calendarEvents', []);
            this.loteNames = StorageRepository.getItem('loteNames', {});
            if (this.user?.id) {
                this.tasks = StorageRepository.getItem(`tasks_${this.user.id}`, []);
            }
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            window.showToast?.('Erro ao carregar dados salvos', 'error');
        }
    }
};

export const StorageRepository = {
    memoryStore: {},
    
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    getItem(key, defaultValue = null) {
        try {
            if (this.isLocalStorageAvailable()) {
                const item = localStorage.getItem(key);
                return item !== null ? JSON.parse(item) : defaultValue;
            } else {
                return this.memoryStore[key] !== undefined ? this.memoryStore[key] : defaultValue;
            }
        } catch (error) {
            console.error(`Erro ao ler ${key}:`, error);
            return this.memoryStore[key] !== undefined ? this.memoryStore[key] : defaultValue;
        }
    },
    
    setItem(key, value) {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(key, JSON.stringify(value));
                this.memoryStore[key] = value;
                return true;
            } else {
                this.memoryStore[key] = value;
                console.warn(`LocalStorage indisponível, usando memória para ${key}`);
                return true;
            }
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                this.memoryStore[key] = value;
                window.showToast?.('Armazenamento cheio. Dados salvos temporariamente na memória.', 'warning');
                return true;
            }
            console.error(`Erro ao salvar ${key}:`, error);
            this.memoryStore[key] = value;
            return false;
        }
    },
    
    removeItem(key) {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(key);
            }
            delete this.memoryStore[key];
        } catch (error) {
            console.error(`Erro ao remover ${key}:`, error);
        }
    },
    
    clear() {
        try {
            if (this.isLocalStorageAvailable()) {
                localStorage.clear();
            }
            this.memoryStore = {};
        } catch (error) {
            console.error('Erro ao limpar storage:', error);
        }
    }
};

// Exportar para uso global
window.AppState = AppState;
window.StorageRepository = StorageRepository;

