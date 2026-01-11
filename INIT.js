/**
 * Arquivo de Inicialização
 * 
 * Este arquivo deve ser incluído no HTML após todos os outros scripts
 * para garantir que tudo seja inicializado corretamente
 */

(function() {
    'use strict';
    
    /**
     * Inicializa o sistema quando o DOM estiver pronto
     */
    async function initializeSystem() {
        try {
            // 1. Inicializar AuthManager
            if (typeof window.authManager !== 'undefined' && window.authManager.init) {
                try {
                    await window.authManager.init();
                    console.log('✅ AuthManager inicializado com sucesso');
                } catch (error) {
                    console.error('❌ Erro ao inicializar AuthManager:', error);
                    if (typeof safeError === 'function') {
                        safeError('Erro ao inicializar AuthManager:', error);
                    }
                }
            } else {
                console.warn('⚠️ AuthManager não encontrado. Verifique se auth.js foi carregado.');
            }
            
            // 2. Verificar autenticação salva
            if (typeof window.checkAuth === 'function') {
                window.checkAuth();
            }
            
            // 3. Inicializar componentes de login
            if (typeof window.updateLoginGreeting === 'function') {
                window.updateLoginGreeting();
            }
            
            if (typeof window.initializePasswordToggle === 'function') {
                window.initializePasswordToggle();
            }
            
            if (typeof window.initializeLoginValidation === 'function') {
                window.initializeLoginValidation();
            }
            
            if (typeof window.initializeForgotPassword === 'function') {
                window.initializeForgotPassword();
            }
            
            if (typeof window.checkRememberedUser === 'function') {
                window.checkRememberedUser();
            }
            
            // 4. Verificar Firebase
            if (typeof window.initializeFirebase === 'function') {
                // Firebase já deve ter inicializado, mas podemos verificar
                setTimeout(() => {
                    if (window.firebaseAvailable) {
                        console.log('✅ Firebase inicializado');
                    } else {
                        console.warn('⚠️ Firebase não disponível');
                    }
                }, 1000);
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema:', error);
            if (typeof safeError === 'function') {
                safeError('Erro ao inicializar sistema:', error);
            }
        }
    }
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        // DOM já está pronto
        initializeSystem();
    }
})();

