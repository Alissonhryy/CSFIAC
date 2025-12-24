// /js/core/config.js
export const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';

export const Logger = {
    log(...args) {
        if (isDevelopment) {
            console.log('[DEV]', ...args);
        }
    },
    
    warn(...args) {
        if (isDevelopment) {
            console.warn('[DEV]', ...args);
        }
    },
    
    error(...args) {
        console.error('[ERROR]', ...args);
    }
};

export async function handleError(error, context, userMessage = null) {
    const errorInfo = {
        message: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    Logger.error(`[${context}]`, error);
    
    if (userMessage) {
        window.showToast?.(userMessage, 'error');
    } else {
        window.showToast?.('Ocorreu um erro. Tente novamente.', 'error');
    }
    
    try {
        const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errorLogs.push(errorInfo);
        if (errorLogs.length > 50) errorLogs.shift();
        localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
    } catch (storageError) {
        Logger.error('Erro ao salvar erro no localStorage:', storageError);
    }
}

// Exportar para uso global
window.Logger = Logger;
window.handleError = handleError;

