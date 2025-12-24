/**
 * Arquivo principal da aplicação
 * Inicializa todos os módulos e configura a aplicação
 */

import { initFirebase, checkFirebaseAvailability, checkStorageAvailability } from './firebase/firebase.js';
import { initializeLocalStorage, loadStateFromLocalStorage } from './state/state.js';
import { safeLog, safeError } from './utils/logger.js';
import { appConfig } from '../config/app.config.js';

/**
 * Inicializa a aplicação
 */
export async function initializeApp() {
    try {
        // Inicializar Firebase
        const firebaseInitialized = initFirebase();
        
        if (firebaseInitialized) {
            await checkFirebaseAvailability();
            await checkStorageAvailability();
        } else {
            safeLog('Firebase não disponível, usando localStorage');
            initializeLocalStorage();
        }
        
        // Carregar estado inicial
        loadStateFromLocalStorage();
        
        safeLog('Aplicação inicializada com sucesso');
    } catch (error) {
        safeError('Erro ao inicializar aplicação:', error);
        // Fallback para localStorage
        initializeLocalStorage();
    }
}

/**
 * Carrega módulos dinamicamente (lazy loading)
 */
export async function loadModule(moduleName) {
    try {
        const module = await import(`./modules/${moduleName}.js`);
        return module;
    } catch (error) {
        safeError(`Erro ao carregar módulo ${moduleName}:`, error);
        return null;
    }
}

