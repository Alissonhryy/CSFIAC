/**
 * Gerenciador de Sincronização Firebase
 * Sincroniza todas as entidades em tempo real entre dispositivos
 */

class SyncManager {
    constructor() {
        this.listeners = new Map();
        this.isInitialized = false;
    }

    /**
     * Inicializa sincronização para todas as entidades
     */
    initialize() {
        if (this.isInitialized) return;
        
        if (!window.firebaseAvailable || !window.db) {
            safeWarn('Firebase não disponível. Sincronização desabilitada.');
            return;
        }

        this.syncCursos();
        this.syncInstrutores();
        this.syncDemandantes();
        this.syncTarefas();
        this.syncCalendarEvents();
        
        this.isInitialized = true;
        safeLog('✅ Sincronização Firebase inicializada');
    }

    /**
     * Sincroniza Cursos em tempo real
     */
    syncCursos() {
        if (!window.cursos) window.cursos = [];
        
        const listener = window.db.collection('cursos')
            .onSnapshot((snapshot) => {
                const updated = [];
                snapshot.forEach((doc) => {
                    updated.push({ id: doc.id, ...doc.data() });
                });
                
                window.cursos = updated;
                safeLog('📚 Cursos sincronizados:', updated.length);
                
                // Atualizar UI
                if (typeof renderCourses === 'function') {
                    renderCourses();
                }
                if (typeof renderCalendar === 'function') {
                    renderCalendar();
                }
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
            }, (error) => {
                safeError('Erro ao sincronizar cursos:', error);
            });
        
        this.listeners.set('cursos', listener);
    }

    /**
     * Sincroniza Instrutores em tempo real
     */
    syncInstrutores() {
        if (!window.instrutores) window.instrutores = [];
        
        const listener = window.db.collection('instrutores')
            .onSnapshot((snapshot) => {
                const updated = [];
                snapshot.forEach((doc) => {
                    updated.push({ id: doc.id, ...doc.data() });
                });
                
                window.instrutores = updated;
                safeLog('👥 Instrutores sincronizados:', updated.length);
                
                // Atualizar UI
                if (typeof renderInstructors === 'function') {
                    renderInstructors();
                }
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
            }, (error) => {
                safeError('Erro ao sincronizar instrutores:', error);
            });
        
        this.listeners.set('instrutores', listener);
    }

    /**
     * Sincroniza Demandantes em tempo real
     */
    syncDemandantes() {
        if (!window.demandantes) window.demandantes = [];
        
        const listener = window.db.collection('demandantes')
            .onSnapshot((snapshot) => {
                const updated = [];
                snapshot.forEach((doc) => {
                    updated.push({ id: doc.id, ...doc.data() });
                });
                
                window.demandantes = updated;
                safeLog('🏢 Demandantes sincronizados:', updated.length);
                
                // Atualizar UI
                if (typeof renderDemandantes === 'function') {
                    renderDemandantes();
                }
            }, (error) => {
                safeError('Erro ao sincronizar demandantes:', error);
            });
        
        this.listeners.set('demandantes', listener);
    }

    /**
     * Sincroniza Tarefas em tempo real (incluindo menções)
     */
    syncTarefas() {
        if (!window.tasks) window.tasks = [];
        
        const listener = window.db.collection('tarefas')
            .onSnapshot((snapshot) => {
                const updated = [];
                snapshot.forEach((doc) => {
                    updated.push({ id: doc.id, ...doc.data() });
                });
                
                window.tasks = updated;
                safeLog('✅ Tarefas sincronizadas:', updated.length);
                
                // Verificar novas menções para o usuário atual
                this.checkNewMentions(updated);
                
                // Atualizar UI
                if (typeof renderTasks === 'function') {
                    renderTasks();
                }
                if (typeof renderCalendar === 'function') {
                    renderCalendar();
                }
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
            }, (error) => {
                safeError('Erro ao sincronizar tarefas:', error);
            });
        
        this.listeners.set('tarefas', listener);
    }

    /**
     * Sincroniza Eventos do Calendário em tempo real
     */
    syncCalendarEvents() {
        if (!window.calendarEvents) window.calendarEvents = [];
        
        const listener = window.db.collection('calendarEvents')
            .onSnapshot((snapshot) => {
                const updated = [];
                snapshot.forEach((doc) => {
                    updated.push({ id: doc.id, ...doc.data() });
                });
                
                window.calendarEvents = updated;
                safeLog('📅 Eventos do calendário sincronizados:', updated.length);
                
                // Atualizar UI
                if (typeof renderCalendar === 'function') {
                    renderCalendar();
                }
            }, (error) => {
                safeError('Erro ao sincronizar eventos:', error);
            });
        
        this.listeners.set('calendarEvents', listener);
    }

    /**
     * Verifica novas menções em tarefas
     */
    checkNewMentions(tasks) {
        if (!window.currentUser) return;
        
        const userId = window.currentUser.id;
        const lastChecked = localStorage.getItem(`lastMentionCheck_${userId}`) || '0';
        const now = Date.now();
        
        // Verificar tarefas novas ou atualizadas que mencionam o usuário
        tasks.forEach(task => {
            if (task.mentionedUsers && task.mentionedUsers.includes(userId)) {
                // Verificar se é uma menção nova
                const taskUpdated = new Date(task.updatedAt || task.createdAt).getTime();
                const lastCheckTime = parseInt(lastChecked);
                
                if (taskUpdated > lastCheckTime && task.createdBy !== userId) {
                    // Notificar usuário
                    this.notifyMention(task);
                }
            }
        });
        
        // Atualizar último check
        localStorage.setItem(`lastMentionCheck_${userId}`, now.toString());
    }

    /**
     * Notifica usuário sobre menção em tarefa
     */
    notifyMention(task) {
        if (typeof showToast === 'function') {
            showToast(
                `📌 Você foi mencionado na tarefa: "${task.title}"`,
                'info'
            );
        }
        
        // Notificação nativa se disponível
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nova Menção em Tarefa', {
                body: `"${task.title}" - ${task.createdByName || 'Usuário'}`,
                icon: '/icon-180.png',
                tag: `mention_${task.id}`
            });
        }
    }

    /**
     * Salva curso no Firebase
     */
    async saveCurso(curso) {
        if (!window.firebaseAvailable || !window.db) {
            // Fallback para localStorage
            if (!window.cursos) window.cursos = [];
            const index = window.cursos.findIndex(c => c.id === curso.id);
            if (index >= 0) {
                window.cursos[index] = curso;
            } else {
                window.cursos.push(curso);
            }
            localStorage.setItem('cursos', JSON.stringify(window.cursos));
            return;
        }

        try {
            const cursoRef = window.db.collection('cursos').doc(curso.id);
            await cursoRef.set({
                ...curso,
                updatedAt: new Date().toISOString(),
                updatedBy: window.currentUser?.id || 'anonymous'
            });
        } catch (error) {
            safeError('Erro ao salvar curso:', error);
            throw error;
        }
    }

    /**
     * Salva tarefa no Firebase
     */
    async saveTarefa(tarefa) {
        if (!window.firebaseAvailable || !window.db) {
            // Fallback para localStorage
            if (!window.tasks) window.tasks = [];
            const index = window.tasks.findIndex(t => t.id === tarefa.id);
            if (index >= 0) {
                window.tasks[index] = tarefa;
            } else {
                window.tasks.push(tarefa);
            }
            localStorage.setItem('tarefas', JSON.stringify(window.tasks));
            return;
        }

        try {
            const tarefaRef = window.db.collection('tarefas').doc(tarefa.id);
            await tarefaRef.set({
                ...tarefa,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            safeError('Erro ao salvar tarefa:', error);
            throw error;
        }
    }

    /**
     * Salva instrutor no Firebase
     */
    async saveInstrutor(instrutor) {
        if (!window.firebaseAvailable || !window.db) {
            // Fallback para localStorage
            if (!window.instrutores) window.instrutores = [];
            const index = window.instrutores.findIndex(i => i.id === instrutor.id);
            if (index >= 0) {
                window.instrutores[index] = instrutor;
            } else {
                window.instrutores.push(instrutor);
            }
            localStorage.setItem('instrutores', JSON.stringify(window.instrutores));
            return;
        }

        try {
            const instrutorRef = window.db.collection('instrutores').doc(instrutor.id);
            await instrutorRef.set({
                ...instrutor,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            safeError('Erro ao salvar instrutor:', error);
            throw error;
        }
    }

    /**
     * Salva demandante no Firebase
     */
    async saveDemandante(demandante) {
        if (!window.firebaseAvailable || !window.db) {
            // Fallback para localStorage
            if (!window.demandantes) window.demandantes = [];
            const index = window.demandantes.findIndex(d => d.id === demandante.id);
            if (index >= 0) {
                window.demandantes[index] = demandante;
            } else {
                window.demandantes.push(demandante);
            }
            localStorage.setItem('demandantes', JSON.stringify(window.demandantes));
            return;
        }

        try {
            const demandanteRef = window.db.collection('demandantes').doc(demandante.id);
            await demandanteRef.set({
                ...demandante,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            safeError('Erro ao salvar demandante:', error);
            throw error;
        }
    }

    /**
     * Remove listener de sincronização
     */
    unsubscribe(entity) {
        const listener = this.listeners.get(entity);
        if (listener) {
            listener();
            this.listeners.delete(entity);
        }
    }

    /**
     * Remove todos os listeners
     */
    destroy() {
        this.listeners.forEach((listener) => listener());
        this.listeners.clear();
        this.isInitialized = false;
    }
}

// Criar instância global
const syncManager = new SyncManager();

// Exportar
if (typeof window !== 'undefined') {
    window.SyncManager = SyncManager;
    window.syncManager = syncManager;
}

