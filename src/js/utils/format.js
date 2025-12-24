/**
 * Funções de formatação de dados
 */

/**
 * Formata data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formata data e hora
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export function formatDateTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Normaliza status do curso
 * @param {string} status - Status a ser normalizado
 * @returns {string} Status normalizado
 */
export function normalizeStatus(status) {
    if (!status) return 'Pendente';
    
    const statusMap = {
        'pendente': 'Pendente',
        'em andamento': 'Em Andamento',
        'em_andamento': 'Em Andamento',
        'concluído': 'Concluído',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado',
        'pausado': 'Pausado'
    };
    
    const normalized = status.toLowerCase().trim();
    return statusMap[normalized] || status;
}

/**
 * Formata número de telefone
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

