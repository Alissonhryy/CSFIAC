/**
 * Sistema de logging condicional
 * Logs apenas em desenvolvimento para melhor performance em produção
 */

import { isDevelopment } from '../../config/firebase.config.js';

/**
 * Log apenas em desenvolvimento
 */
export function safeLog(...args) {
    if (isDevelopment) {
        console.log(...args);
    }
}

/**
 * Warning apenas em desenvolvimento
 */
export function safeWarn(...args) {
    if (isDevelopment) {
        console.warn(...args);
    }
}

/**
 * Erro sempre logado (mas pode ser enviado para serviço de monitoramento)
 */
export function safeError(...args) {
    console.error(...args);
    // TODO: Enviar para serviço de monitoramento (Sentry, LogRocket, etc)
}

