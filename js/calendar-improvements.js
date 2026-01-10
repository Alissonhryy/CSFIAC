/**
 * Melhorias no Calendário
 * - Controle de permissões para exclusão de eventos
 * - Modal para mostrar todos os eventos do dia
 * - Melhorias na exibição de eventos
 */

/**
 * Verifica se usuário pode excluir evento
 * @param {Object} event - Evento do calendário
 * @returns {boolean} True se pode excluir
 */
function canDeleteEvent(event) {
    if (!event || !window.currentUser) return false;
    
    // Admin pode excluir qualquer evento
    if (window.currentUser.role === 'admin') return true;
    
    // Criador pode excluir seu próprio evento
    if (event.createdBy === window.currentUser.id) return true;
    
    return false;
}

/**
 * Mostra modal com todos os eventos do dia
 * @param {string} dateStr - Data no formato YYYY-MM-DD
 */
function showDayEvents(dateStr) {
    if (!dateStr) return;
    
    const date = new Date(dateStr + 'T00:00:00');
    const dateFormatted = date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Buscar todos os eventos do dia
    const cursos = window.cursos || [];
    const eventos = window.calendarEvents || [];
    const tarefas = window.tasks || [];
    
    // Filtrar eventos do dia
    const dayCursos = cursos.filter(c => {
        return c.inicio === dateStr || c.fim === dateStr;
    });
    
    const dayEventos = eventos.filter(e => e.date === dateStr);
    
    const dayTarefas = tarefas.filter(t => {
        if (t.dueDate === dateStr) return true;
        // Verificar se tarefa menciona usuário atual
        if (t.mentionedUsers && Array.isArray(t.mentionedUsers)) {
            return t.mentionedUsers.includes(window.currentUser?.id);
        }
        return false;
    });
    
    // Criar HTML do modal
    let html = `
        <div class="modal-overlay" id="dayEventsModal" onclick="if(event.target.id === 'dayEventsModal') closeModal('dayEventsModal')">
            <div class="modal" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>Eventos do Dia - ${dateFormatted}</h3>
                    <button class="modal-close" onclick="closeModal('dayEventsModal')">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="day-events-container">
    `;
    
    // Cursos
    if (dayCursos.length > 0) {
        html += `
            <div class="day-events-section">
                <h4 class="section-title">
                    <span class="material-icons">school</span>
                    Cursos (${dayCursos.length})
                </h4>
                <div class="events-list">
        `;
        
        dayCursos.forEach(curso => {
            const isStart = curso.inicio === dateStr;
            const isEnd = curso.fim === dateStr;
            const label = isStart ? '▶ Início' : '■ Fim';
            const color = isStart ? 'var(--primary)' : 'var(--success)';
            
            html += `
                <div class="day-event-item" style="border-left: 4px solid ${color};">
                    <div class="event-header">
                        <span class="event-type">${label}</span>
                        <span class="event-title">${curso.curso || curso.lote}</span>
                    </div>
                    <div class="event-details">
                        <div><strong>Instrutor:</strong> ${curso.instrutor || 'Não definido'}</div>
                        <div><strong>Local:</strong> ${curso.local || curso.cidade || 'Não definido'}</div>
                        <div><strong>Alunos:</strong> ${curso.alunos || 0}</div>
                        <div><strong>Status:</strong> <span class="status-badge status-${getStatusClass(curso.status)}">${curso.status}</span></div>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="openCourseModal('${curso.id}'); closeModal('dayEventsModal');">
                        Ver Detalhes
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Eventos Personalizados
    if (dayEventos.length > 0) {
        html += `
            <div class="day-events-section">
                <h4 class="section-title">
                    <span class="material-icons">event</span>
                    Eventos Personalizados (${dayEventos.length})
                </h4>
                <div class="events-list">
        `;
        
        // Ordenar por horário
        const sortedEventos = [...dayEventos].sort((a, b) => {
            return (a.time || '').localeCompare(b.time || '');
        });
        
        sortedEventos.forEach(evento => {
            const canDelete = canDeleteEvent(evento);
            const createdByLabel = evento.createdByName ? `por ${evento.createdByName}` : '';
            
            html += `
                <div class="day-event-item" style="border-left: 4px solid ${evento.color || '#6366f1'};">
                    <div class="event-header">
                        <span class="event-time">${evento.time || 'Dia todo'}</span>
                        <span class="event-title">${evento.title}</span>
                        ${canDelete ? `
                            <button class="btn-icon" onclick="deleteCalendarEvent('${evento.id}'); closeModal('dayEventsModal');" title="Excluir evento">
                                <span class="material-icons">delete</span>
                            </button>
                        ` : ''}
                    </div>
                    ${evento.description ? `
                        <div class="event-description">${escapeHtml(evento.description)}</div>
                    ` : ''}
                    <div class="event-meta">
                        <span class="event-creator">Adicionado ${createdByLabel}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Tarefas
    if (dayTarefas.length > 0) {
        html += `
            <div class="day-events-section">
                <h4 class="section-title">
                    <span class="material-icons">task_alt</span>
                    Tarefas (${dayTarefas.length})
                </h4>
                <div class="events-list">
        `;
        
        dayTarefas.forEach(tarefa => {
            const isMentioned = tarefa.mentionedUsers && tarefa.mentionedUsers.includes(window.currentUser?.id);
            const mentionedLabel = isMentioned ? ' (Mencionado)' : '';
            const isOverdue = !tarefa.completed && new Date(tarefa.dueDate) < new Date();
            
            html += `
                <div class="day-event-item ${tarefa.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
                     style="border-left: 4px solid ${tarefa.completed ? 'var(--success)' : isOverdue ? 'var(--danger)' : 'var(--warning)'};">
                    <div class="event-header">
                        <span class="event-time">${tarefa.dueTime || 'Sem horário'}</span>
                        <span class="event-title">${tarefa.title}${mentionedLabel}</span>
                        ${tarefa.completed ? '<span class="material-icons" style="color: var(--success);">check_circle</span>' : ''}
                    </div>
                    ${tarefa.description ? `
                        <div class="event-description">${escapeHtml(tarefa.description)}</div>
                    ` : ''}
                    <div class="event-meta">
                        <span>Por: ${tarefa.createdByName || 'Usuário'}</span>
                        ${isMentioned ? '<span class="mention-badge">Você foi mencionado</span>' : ''}
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="openTaskModal('${tarefa.id}'); closeModal('dayEventsModal');">
                        Ver Tarefa
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Sem eventos
    if (dayCursos.length === 0 && dayEventos.length === 0 && dayTarefas.length === 0) {
        html += `
            <div class="empty-state">
                <span class="material-icons" style="font-size: 64px; color: var(--text-muted);">event_busy</span>
                <p>Nenhum evento neste dia</p>
                <button class="btn btn-primary" onclick="openAddEventModal('${dateStr}'); closeModal('dayEventsModal');">
                    Adicionar Evento
                </button>
            </div>
        `;
    }
    
    html += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('dayEventsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar ao DOM
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Adicionar estilos se não existirem
    addDayEventsModalStyles();
    
    // Mostrar modal
    const modal = document.getElementById('dayEventsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

/**
 * Adiciona estilos CSS para o modal de eventos do dia
 */
function addDayEventsModalStyles() {
    if (document.getElementById('dayEventsModalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'dayEventsModalStyles';
    style.textContent = `
        .day-events-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .day-events-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .section-title .material-icons {
            font-size: 1.5rem;
            color: var(--primary);
        }
        
        .events-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .day-event-item {
            background: var(--surface);
            border-radius: 8px;
            padding: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .day-event-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .day-event-item.completed {
            opacity: 0.7;
        }
        
        .day-event-item.overdue {
            border-left-width: 6px !important;
        }
        
        .event-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }
        
        .event-type {
            font-weight: 600;
            color: var(--primary);
            font-size: 0.875rem;
        }
        
        .event-time {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: 500;
            min-width: 80px;
        }
        
        .event-title {
            flex: 1;
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .event-description {
            color: var(--text-secondary);
            margin: 0.5rem 0;
            line-height: 1.5;
        }
        
        .event-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .event-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }
        
        .event-creator {
            font-style: italic;
        }
        
        .mention-badge {
            background: var(--primary-light);
            color: var(--primary);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-muted);
        }
        
        .empty-state p {
            margin: 1rem 0 2rem;
            font-size: 1.125rem;
        }
        
        .btn-icon {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .btn-icon:hover {
            background: var(--surface-hover);
            color: var(--danger);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Melhora a função deleteCalendarEvent para verificar permissões
 */
function deleteCalendarEventWithPermission(eventId) {
    const event = (window.calendarEvents || []).find(e => e.id === eventId);
    
    if (!event) {
        showToast('Evento não encontrado', 'error');
        return;
    }
    
    if (!canDeleteEvent(event)) {
        showToast('Você não tem permissão para excluir este evento', 'error');
        return;
    }
    
    // Confirmar exclusão
    if (!confirm(`Deseja realmente excluir o evento "${event.title}"?`)) {
        return;
    }
    
    // Chamar função original de exclusão
    if (typeof deleteCalendarEvent === 'function') {
        deleteCalendarEvent(eventId);
    }
}

// Exportar funções
if (typeof window !== 'undefined') {
    window.canDeleteEvent = canDeleteEvent;
    window.showDayEvents = showDayEvents;
    window.deleteCalendarEventWithPermission = deleteCalendarEventWithPermission;
}

