/**
 * Inicialização do Firebase (Versão Modular)
 * 
 * Este módulo inicializa o Firebase usando a versão modular do SDK
 * e expõe as instâncias do Firestore e Storage
 */

// Verificar se configuração está disponível
if (!window.firebaseConfig) {
    if (typeof safeError === 'function') {
        safeError('firebaseConfig não foi carregado. Verifique se firebase.config.js está sendo carregado antes deste script.');
    } else {
        console.error('firebaseConfig não foi carregado. Verifique se firebase.config.js está sendo carregado antes deste script.');
    }
}

// Variáveis globais
let firebaseApp = null;
let db = null;
let storage = null;
let firebaseAvailable = false;
let storageAvailable = false;

/**
 * Função helper para log seguro
 */
function logError(...args) {
    if (typeof safeError === 'function') {
        safeError(...args);
    } else {
        console.error(...args);
    }
}

function logWarn(...args) {
    if (typeof safeWarn === 'function') {
        safeWarn(...args);
    } else {
        console.warn(...args);
    }
}

/**
 * Inicializa Firebase usando a versão modular
 */
async function initializeFirebase() {
    try {
        // Verificar se Firebase está disponível (deve ser carregado via script tag)
        if (typeof firebase === 'undefined') {
            logError('Firebase SDK não foi carregado. Verifique se os scripts do Firebase estão incluídos no HTML.');
            return false;
        }

        if (!window.firebaseConfig) {
            logError('firebaseConfig não está disponível');
            return false;
        }

        // Usar a API compatível se disponível (para compatibilidade com código existente)
        // Ou usar a API modular se disponível
        if (firebase.initializeApp && typeof firebase.initializeApp === 'function') {
            // API compatível (v8 style)
            firebaseApp = firebase.initializeApp(window.firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
            firebaseAvailable = true;
        } else if (firebase.apps && firebase.apps.length === 0) {
            // Tentar API modular (v9+)
            // Nota: Se estiver usando script tags, precisamos da versão compat
            logError('Versão modular do Firebase requer módulos ES6. Use a versão compatível.');
            return false;
        } else {
            // Firebase já inicializado
            firebaseApp = firebase.app();
            db = firebase.firestore();
            storage = firebase.storage();
            firebaseAvailable = true;
        }

        // Habilitar persistência offline (se disponível)
        if (db && db.enablePersistence && typeof db.enablePersistence === 'function') {
            try {
                await db.enablePersistence({ 
                    synchronizeTabs: true 
                }).catch(err => {
                    // Ignorar erros esperados silenciosamente
                    if (err.code === 'failed-precondition') {
                        // Múltiplas abas abertas - comportamento esperado
                        logWarn('Múltiplas abas abertas, persistência apenas na primeira.');
                    } else if (err.code === 'unimplemented') {
                        // Navegador não suporta - comportamento esperado
                        logWarn('Navegador não suporta persistência.');
                    } else {
                        // Outros erros devem ser logados
                        logError('Erro ao habilitar persistência do Firestore:', err);
                    }
                });
            } catch (err) {
                // Erro ao tentar habilitar persistência - não crítico
                logWarn('Erro ao habilitar persistência do Firestore:', err);
            }
        }

        return true;
    } catch (error) {
        logError('Erro ao inicializar Firebase:', error);
        firebaseAvailable = false;
        return false;
    }
}

/**
 * Verifica disponibilidade do Storage
 */
async function checkStorageAvailability() {
    if (!firebaseAvailable || !storage) {
        storageAvailable = false;
        return false;
    }
    
    try {
        const testRef = storage.ref('test-availability');
        await testRef.getMetadata();
        storageAvailable = true;
        return true;
    } catch (error) {
        // Se o erro for 404, o storage está disponível mas o arquivo não existe (esperado)
        if (error.code === 'storage/object-not-found') {
            storageAvailable = true;
            return true;
        }
        storageAvailable = false;
        return false;
    }
}

// Inicializar Firebase quando o script carregar
// Nota: Se Firebase SDK ainda não carregou, inicializará quando disponível
if (typeof window !== 'undefined') {
    // Tentar inicializar imediatamente se Firebase já estiver disponível
    if (typeof firebase !== 'undefined') {
        initializeFirebase().then(available => {
            if (available) {
                // Exportar para uso global
                window.firebaseApp = firebaseApp;
                window.db = db;
                window.storage = storage;
                window.firebaseAvailable = firebaseAvailable;
                window.storageAvailable = storageAvailable;
                window.checkStorageAvailability = checkStorageAvailability;
                
                // Tornar disponível globalmente para compatibilidade
                if (typeof globalThis !== 'undefined') {
                    globalThis.db = db;
                    globalThis.storage = storage;
                    globalThis.firebaseApp = firebaseApp;
                }
            }
        });
    } else {
        // Esperar Firebase carregar (via evento ou timeout)
        // Em produção, os scripts devem estar na ordem correta no HTML
        window.addEventListener('load', () => {
            if (typeof firebase !== 'undefined') {
                initializeFirebase().then(available => {
                    if (available) {
                        window.firebaseApp = firebaseApp;
                        window.db = db;
                        window.storage = storage;
                        window.firebaseAvailable = firebaseAvailable;
                        window.storageAvailable = storageAvailable;
                        window.checkStorageAvailability = checkStorageAvailability;
                        
                        if (typeof globalThis !== 'undefined') {
                            globalThis.db = db;
                            globalThis.storage = storage;
                            globalThis.firebaseApp = firebaseApp;
                        }
                    }
                });
            }
        });
    }
    
    // Exportar função de inicialização manual também
    window.initializeFirebase = initializeFirebase;
}

