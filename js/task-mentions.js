/**
 * Sistema de Menções em Tarefas
 * Permite atribuir tarefas para outros usuários
 */

/**
 * Adiciona menção (atribuição) de usuário em tarefa
 * @param {string} taskId - ID da tarefa
 * @param {string} userId - ID do usuário a ser mencionado
 * @param {string} userName - Nome do usuário a ser mencionado
 */
async function mentionUserInTask(taskId, userId, userName) {
    const task = (window.tasks || []).find(t => t.id === taskId);
    
    if (!task) {
        showToast('Tarefa não encontrada', 'error');
        return;
    }
    
    // Inicializar array de menções se não existir
    if (!task.mentionedUsers) {
        task.mentionedUsers = [];
    }
    
    // Verificar se usuário já está mencionado
    if (task.mentionedUsers.includes(userId)) {
        showToast(`${userName} já está mencionado nesta tarefa`, 'info');
        return;
    }
    
    // Adicionar menção
    task.mentionedUsers.push(userId);
    
    // Adicionar informações de menção
    if (!task.mentions) {
        task.mentions = [];
    }
    
    task.mentions.push({
        userId: userId,
        userName: userName,
        mentionedBy: window.currentUser?.id || 'anonymous',
        mentionedByName: window.currentUser?.name || 'Usuário',
        mentionedAt: new Date().toISOString()
    });
    
    // Atualizar tarefa
    task.updatedAt = new Date().toISOString();
    
    // Salvar no Firebase
    if (window.syncManager) {
        try {
            await window.syncManager.saveTarefa(task);
            showToast(`${userName} foi mencionado na tarefa`, 'success');
            
            // Notificar usuário mencionado (se não for o criador)
            if (userId !== window.currentUser?.id) {
                notifyUserMention(task, userId, userName);
            }
        } catch (error) {
            safeError('Erro ao mencionar usuário:', error);
            showToast('Erro ao mencionar usuário', 'error');
        }
    } else {
        // Fallback para localStorage
        const index = window.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
            window.tasks[index] = task;
            localStorage.setItem('tarefas', JSON.stringify(window.tasks));
            showToast(`${userName} foi mencionado na tarefa`, 'success');
        }
    }
}

/**
 * Remove menção de usuário em tarefa
 * @param {string} taskId - ID da tarefa
 * @param {string} userId - ID do usuário a remover
 */
async function unmentionUserInTask(taskId, userId) {
    const task = (window.tasks || []).find(t => t.id === taskId);
    
    if (!task || !task.mentionedUsers) return;
    
    task.mentionedUsers = task.mentionedUsers.filter(id => id !== userId);
    
    if (task.mentions) {
        task.mentions = task.mentions.filter(m => m.userId !== userId);
    }
    
    task.updatedAt = new Date().toISOString();
    
    // Salvar no Firebase
    if (window.syncManager) {
        try {
            await window.syncManager.saveTarefa(task);
            showToast('Menção removida', 'success');
        } catch (error) {
            safeError('Erro ao remover menção:', error);
        }
    } else {
        const index = window.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
            window.tasks[index] = task;
            localStorage.setItem('tarefas', JSON.stringify(window.tasks));
        }
    }
}

/**
 * Notifica usuário sobre menção
 */
function notifyUserMention(task, userId, userName) {
    // Notificação no sistema
    if (typeof showToast === 'function') {
        // A notificação será mostrada pelo syncManager quando detectar a mudança
    }
    
    // Notificação nativa
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Você foi mencionado em uma tarefa', {
            body: `"${task.title}" - por ${window.currentUser?.name || 'Usuário'}`,
            icon: '/icon-180.png',
            tag: `task_mention_${task.id}_${userId}`,
            badge: '/icon-180.png'
        });
    }
}

/**
 * Obtém lista de usuários para menção
 * @returns {Array} Lista de usuários disponíveis
 */
function getUsersForMention() {
    // Obter usuários do sistema de autenticação
    const authUsers = window.authManager?.users || [];
    
    return authUsers
        .filter(u => u.id !== window.currentUser?.id) // Excluir usuário atual
        .map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role
        }));
}

/**
 * Cria interface para adicionar menção em tarefa
 * @param {string} taskId - ID da tarefa
 */
function showMentionUserModal(taskId) {
    const task = (window.tasks || []).find(t => t.id === taskId);
    if (!task) return;
    
    const users = getUsersForMention();
    
    let html = `
        <div class="modal-overlay" id="mentionUserModal" onclick="if(event.target.id === 'mentionUserModal') closeModal('mentionUserModal')">
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Mencionar Usuário na Tarefa</h3>
                    <button class="modal-close" onclick="closeModal('mentionUserModal')">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="task-info" style="margin-bottom: 1.5rem; padding: 1rem; background: var(--surface-hover); border-radius: 8px;">
                        <strong>Tarefa:</strong> ${escapeHtml(task.title)}
                    </div>
                    
                    <div class="form-group">
                        <label>Usuários Mencionados</label>
                        <div id="mentionedUsersList" class="mentioned-users-list">
    `;
    
    // Mostrar usuários já mencionados
    if (task.mentionedUsers && task.mentionedUsers.length > 0) {
        const authUsers = window.authManager?.users || [];
        task.mentionedUsers.forEach(userId => {
            const user = authUsers.find(u => u.id === userId);
            if (user) {
                html += `
                    <div class="mentioned-user-item">
                        <span>${user.name} (${user.username})</span>
                        <button class="btn-icon" onclick="unmentionUserInTask('${taskId}', '${user.id}'); closeModal('mentionUserModal');">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                `;
            }
        });
    } else {
        html += `<p style="color: var(--text-muted);">Nenhum usuário mencionado</p>`;
    }
    
    html += `
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Adicionar Menção</label>
                        <select id="mentionUserSelect" class="form-input">
                            <option value="">Selecione um usuário...</option>
    `;
    
    users.forEach(user => {
        const isMentioned = task.mentionedUsers && task.mentionedUsers.includes(user.id);
        if (!isMentioned) {
            html += `<option value="${user.id}" data-name="${user.name}">${user.name} (${user.username}) - ${user.role}</option>`;
        }
    });
    
    html += `
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="closeModal('mentionUserModal')">Cancelar</button>
                        <button class="btn btn-primary" onclick="handleAddMention('${taskId}')">
                            <span class="material-icons">add</span>
                            Mencionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente
    const existingModal = document.getElementById('mentionUserModal');
    if (existingModal) existingModal.remove();
    
    // Adicionar ao DOM
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Adicionar estilos
    addMentionModalStyles();
    
    // Mostrar modal
    const modal = document.getElementById('mentionUserModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

/**
 * Handler para adicionar menção
 */
async function handleAddMention(taskId) {
    const select = document.getElementById('mentionUserSelect');
    if (!select || !select.value) {
        showToast('Selecione um usuário', 'warning');
        return;
    }
    
    const userId = select.value;
    const userName = select.options[select.selectedIndex].dataset.name;
    
    await mentionUserInTask(taskId, userId, userName);
    
    // Fechar modal e reabrir para atualizar lista
    closeModal('mentionUserModal');
    setTimeout(() => {
        showMentionUserModal(taskId);
    }, 300);
}

/**
 * Adiciona estilos para modal de menções
 */
function addMentionModalStyles() {
    if (document.getElementById('mentionModalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'mentionModalStyles';
    style.textContent = `
        .mentioned-users-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .mentioned-user-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background: var(--surface);
            border-radius: 6px;
            border: 1px solid var(--border);
        }
        
        .mentioned-user-item span {
            color: var(--text-primary);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Verifica se tarefa menciona usuário atual
 * @param {Object} task - Tarefa
 * @returns {boolean} True se menciona usuário atual
 */
function isTaskMentioned(task) {
    if (!task || !task.mentionedUsers || !window.currentUser) return false;
    return task.mentionedUsers.includes(window.currentUser.id);
}

/**
 * Filtra tarefas mencionadas para o usuário atual
 * @returns {Array} Tarefas mencionadas
 */
function getMentionedTasks() {
    if (!window.tasks || !window.currentUser) return [];
    return window.tasks.filter(task => isTaskMentioned(task));
}

// Exportar funções
if (typeof window !== 'undefined') {
    window.mentionUserInTask = mentionUserInTask;
    window.unmentionUserInTask = unmentionUserInTask;
    window.showMentionUserModal = showMentionUserModal;
    window.handleAddMention = handleAddMention;
    window.isTaskMentioned = isTaskMentioned;
    window.getMentionedTasks = getMentionedTasks;
}

