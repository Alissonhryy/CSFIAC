/**
 * Configuração e inicialização do Firebase
 * Usa a API compat para manter compatibilidade com o código existente
 */

import { firebaseConfig, validateFirebaseConfig } from '../config/firebase.config.js';
import { safeLog, safeWarn, safeError } from '../utils/logger.js';

let firebaseApp = null;
let db = null;
let storage = null;
let firebaseAvailable = false;
let storageAvailable = false;

/**
 * Inicializa o Firebase (compat mode)
 * Nota: Requer que os scripts do Firebase compat sejam carregados no HTML
 */
export function initFirebase() {
    try {
        if (!validateFirebaseConfig()) {
            safeWarn('Configurações do Firebase incompletas. Usando localStorage.');
            return false;
        }
        
        // Verificar se firebase está disponível (compat mode)
        if (typeof firebase === 'undefined') {
            safeWarn('Firebase SDK não carregado. Usando localStorage.');
            return false;
        }
        
        firebaseApp = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        
        firebaseAvailable = true;
        safeLog('Firebase inicializado com sucesso!');
        
        return true;
    } catch (error) {
        safeError('Erro ao inicializar Firebase:', error);
        firebaseAvailable = false;
        return false;
    }
}

/**
 * Verifica disponibilidade do Firebase
 */
export async function checkFirebaseAvailability() {
    if (!db) {
        firebaseAvailable = false;
        return false;
    }
    
    try {
        // Teste simples de conexão
        await db.collection('_test_connection').doc('test').get();
        firebaseAvailable = true;
        return true;
    } catch (error) {
        safeWarn('Firebase não disponível:', error.message);
        firebaseAvailable = false;
        return false;
    }
}

/**
 * Verifica disponibilidade do Storage
 */
export async function checkStorageAvailability() {
    if (!storage) {
        storageAvailable = false;
        return false;
    }
    
    try {
        // Teste simples
        const testRef = storage.ref('_test');
        storageAvailable = true;
        return true;
    } catch (error) {
        safeWarn('Firebase Storage não disponível:', error.message);
        storageAvailable = false;
        return false;
    }
}

/**
 * Getters
 */
export function getDb() {
    return db;
}

export function getStorage() {
    return storage;
}

export function isFirebaseAvailable() {
    return firebaseAvailable;
}

export function isStorageAvailable() {
    return storageAvailable;
}

