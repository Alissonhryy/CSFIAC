/**
 * Funções Utilitárias
 * Funções de segurança, logging e helpers gerais
 */

// ==================== FUNÇÕES DE SEGURANÇA ====================

/**
 * Sanitiza strings para prevenir XSS
 */
function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitiza atributos HTML
 */
function escapeHtmlAttribute(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// ==================== LOGGING ====================

/**
 * Verifica se está em ambiente de desenvolvimento
 */
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

/**
 * Log seguro (apenas em desenvolvimento)
 */
function safeLog(...args) {
    if (isDevelopment) {
        console.log(...args);
    }
}

/**
 * Warning seguro (apenas em desenvolvimento)
 */
function safeWarn(...args) {
    if (isDevelopment) {
        console.warn(...args);
    }
}

/**
 * Error sempre logado (mas pode ser enviado para serviço de monitoramento)
 */
function safeError(...args) {
    console.error(...args);
    // Aqui você pode adicionar envio para serviço de monitoramento
    // Ex: sendToErrorTracking(...args);
}

// ==================== HELPERS GERAIS ====================

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Formata data
 */
function formatDate(date, format = 'dd/mm/yyyy') {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year);
}

/**
 * Valida email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Valida CPF
 */
function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    
    const cpfDigits = cpf.split('').map(el => +el);
    const rest = (count) => {
        return cpfDigits.slice(0, count - 12)
            .reduce((soma, el, index) => soma + el * (count - index), 0) * 10 % 11 % 10;
    };
    
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
}

/**
 * Copia texto para clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Download de arquivo
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Lê arquivo como texto
 */
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * Gera ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Exportar funções
if (typeof window !== 'undefined') {
    window.utils = {
        escapeHtml,
        escapeHtmlAttribute,
        isDevelopment,
        safeLog,
        safeWarn,
        safeError,
        debounce,
        throttle,
        formatDate,
        isValidEmail,
        isValidCPF,
        copyToClipboard,
        downloadFile,
        readFileAsText,
        generateId
    };
}

