/**
 * Funções de segurança para prevenir XSS e sanitizar dados
 */

/**
 * Sanitiza strings para prevenir XSS
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
export function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitiza atributos HTML
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
export function escapeHtmlAttribute(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Valida e sanitiza entrada de usuário
 * @param {any} input - Entrada a ser validada
 * @param {string} type - Tipo esperado ('string', 'number', 'email', etc)
 * @returns {any} Entrada validada e sanitizada
 */
export function validateInput(input, type = 'string') {
    if (input == null) return '';
    
    switch (type) {
        case 'string':
            return escapeHtml(String(input));
        case 'number':
            const num = Number(input);
            return isNaN(num) ? 0 : num;
        case 'email':
            const email = String(input).toLowerCase().trim();
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
        case 'url':
            const url = String(input).trim();
            try {
                new URL(url);
                return url;
            } catch {
                return '';
            }
        default:
            return escapeHtml(String(input));
    }
}

