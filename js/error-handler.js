/**
 * Gerenciador de Erros Centralizado
 * Fornece tratamento consistente de erros em toda a aplicação
 */

/**
 * Níveis de severidade de erro
 */
const ErrorLevel = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical'
};

/**
 * Classe para gerenciar erros
 */
class ErrorHandler {
    constructor() {
        this.errorHistory = [];
        this.maxHistorySize = 100;
        this.isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname === '';
    }

    /**
     * Registra um erro
     * @param {Error|string} error - Objeto de erro ou mensagem
     * @param {string} level - Nível de severidade
     * @param {Object} context - Contexto adicional do erro
     */
    logError(error, level = ErrorLevel.ERROR, context = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            level: level,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            context: context,
            url: window.location.href,
            userAgent: navigator.userAgent,
            userId: window.currentUser?.id || 'anonymous'
        };

        // Adicionar ao histórico
        this.errorHistory.push(errorInfo);
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory.shift();
        }

        // Salvar no localStorage (apenas erros críticos)
        if (level === ErrorLevel.CRITICAL || level === ErrorLevel.ERROR) {
            this.saveErrorToStorage(errorInfo);
        }

        // Log no console baseado no ambiente
        this.logToConsole(errorInfo);

        // Exibir notificação ao usuário se necessário
        if (level === ErrorLevel.CRITICAL || level === ErrorLevel.ERROR) {
            this.notifyUser(errorInfo);
        }

        // Enviar para serviço de monitoramento em produção
        if (!this.isDevelopment && (level === ErrorLevel.CRITICAL || level === ErrorLevel.ERROR)) {
            this.sendToMonitoring(errorInfo);
        }

        return errorInfo;
    }

    /**
     * Salva erro no localStorage
     * @param {Object} errorInfo - Informações do erro
     */
    saveErrorToStorage(errorInfo) {
        try {
            const storedErrors = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
            storedErrors.push(errorInfo);
            
            // Manter apenas últimos 50 erros
            if (storedErrors.length > 50) {
                storedErrors.shift();
            }
            
            localStorage.setItem('app_error_logs', JSON.stringify(storedErrors));
        } catch (e) {
            console.error('Erro ao salvar erro no storage:', e);
        }
    }

    /**
     * Log no console baseado no nível
     * @param {Object} errorInfo - Informações do erro
     */
    logToConsole(errorInfo) {
        if (this.isDevelopment) {
            // Em desenvolvimento, sempre logar
            const consoleMethod = {
                [ErrorLevel.INFO]: console.info,
                [ErrorLevel.WARNING]: console.warn,
                [ErrorLevel.ERROR]: console.error,
                [ErrorLevel.CRITICAL]: console.error
            }[errorInfo.level] || console.log;

            consoleMethod('[ErrorHandler]', errorInfo.message, errorInfo);
        } else {
            // Em produção, apenas erros críticos
            if (errorInfo.level === ErrorLevel.CRITICAL) {
                console.error('[ErrorHandler]', errorInfo.message);
            }
        }
    }

    /**
     * Notifica o usuário sobre o erro
     * @param {Object} errorInfo - Informações do erro
     */
    notifyUser(errorInfo) {
        if (typeof showToast === 'function') {
            let message = errorInfo.message;
            
            // Mensagens mais amigáveis para o usuário
            if (errorInfo.context.userMessage) {
                message = errorInfo.context.userMessage;
            } else if (message.length > 100) {
                message = 'Ocorreu um erro inesperado. Tente novamente.';
            }

            const type = errorInfo.level === ErrorLevel.CRITICAL ? 'error' : 'warning';
            showToast(message, type);
        }
    }

    /**
     * Envia erro para serviço de monitoramento (Sentry, LogRocket, etc.)
     * @param {Object} errorInfo - Informações do erro
     */
    sendToMonitoring(errorInfo) {
        // TODO: Integrar com serviço de monitoramento
        // Exemplo com Sentry:
        // if (typeof Sentry !== 'undefined') {
        //     Sentry.captureException(new Error(errorInfo.message), {
        //         contexts: { app: errorInfo.context },
        //         level: errorInfo.level,
        //         tags: { userId: errorInfo.userId }
        //     });
        // }
    }

    /**
     * Obtém histórico de erros
     * @param {number} limit - Número máximo de erros a retornar
     * @returns {Array} Array de erros
     */
    getErrorHistory(limit = 10) {
        return this.errorHistory.slice(-limit);
    }

    /**
     * Limpa histórico de erros
     */
    clearErrorHistory() {
        this.errorHistory = [];
        localStorage.removeItem('app_error_logs');
    }

    /**
     * Exporta erros para download
     * @returns {string} JSON dos erros
     */
    exportErrors() {
        const errors = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
        return JSON.stringify(errors, null, 2);
    }

    /**
     * Wrapper para Promise.catch
     * @param {Promise} promise - Promise a ser tratada
     * @param {Object} context - Contexto do erro
     * @returns {Promise} Promise tratada
     */
    async handlePromise(promise, context = {}) {
        try {
            return await promise;
        } catch (error) {
            this.logError(error, ErrorLevel.ERROR, context);
            throw error;
        }
    }
}

// Criar instância global
const errorHandler = new ErrorHandler();

/**
 * Função helper para capturar erros globalmente
 */
window.addEventListener('error', (event) => {
    errorHandler.logError(event.error || event.message, ErrorLevel.ERROR, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

/**
 * Capturar rejeições de promises não tratadas
 */
window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(event.reason, ErrorLevel.ERROR, {
        type: 'unhandledrejection',
        promise: event.promise
    });
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
    window.errorHandler = errorHandler;
    window.ErrorLevel = ErrorLevel;
}

