/**
 * Inicialização do Firebase
 * 
 * Este módulo inicializa o Firebase e expõe as instâncias do Firestore e Storage
 */

// Importar configuração do firebase.config.js
// A configuração será definida globalmente pelo script config/firebase.config.js
// Aguardar até que a configuração esteja disponível
if (!window.firebaseConfig) {
    console.error('firebaseConfig não foi carregado. Verifique se config/firebase.config.js está sendo carregado antes deste script.');
}

// Inicializar Firebase
let firebaseApp;
let db;
let storage;
let firebaseAvailable = false;
let storageAvailable = false;

try {
    if (typeof firebase !== 'undefined' && window.firebaseConfig) {
        firebaseApp = firebase.initializeApp(window.firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        firebaseAvailable = true;
        
        // Configurar Firestore com cache persistente
        // Nota: enablePersistence está depreciado, mas ainda funciona na versão 9.x
        // Para versões futuras, usar FirestoreSettings.cache
        try {
            // Verificar se já não foi inicializado
            if (db && typeof db.enablePersistence === 'function') {
                db.enablePersistence({ 
                    synchronizeTabs: true 
                }).catch(err => {
                    // Erros esperados que podem ser ignorados
                    if (err.code === 'failed-precondition') {
                        // Múltiplas abas abertas - apenas primeira tem persistência
                        if (typeof safeWarn === 'function') {
                            safeWarn('Múltiplas abas abertas, persistência apenas na primeira.');
                        }
                    } else if (err.code === 'unimplemented') {
                        // Navegador não suporta
                        if (typeof safeWarn === 'function') {
                            safeWarn('Navegador não suporta persistência offline.');
                        }
                    } else {
                        // Outros erros - logar mas não bloquear
                        if (typeof safeError === 'function') {
                            safeError('Erro ao habilitar persistência do Firestore:', err);
                        }
                    }
                });
            }
        } catch (err) {
            // Erro ao tentar habilitar persistência - não crítico
            if (typeof safeWarn === 'function') {
                safeWarn('Persistência offline não disponível:', err.message);
            }
        }
    }
} catch (error) {
    safeError('Erro ao inicializar Firebase:', error);
    firebaseAvailable = false;
}

/**
 * Verifica disponibilidade do Storage
 */
async function checkStorageAvailability() {
    if (!firebaseAvailable) {
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

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.firebaseApp = firebaseApp;
    window.db = db;
    window.storage = storage;
    window.firebaseAvailable = firebaseAvailable;
    window.storageAvailable = storageAvailable;
    window.checkStorageAvailability = checkStorageAvailability;
}

