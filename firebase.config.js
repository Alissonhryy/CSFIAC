/**
 * Configuração do Firebase
 * 
 * ATENÇÃO: Em produção, estas credenciais devem ser protegidas.
 * Considere usar variáveis de ambiente ou um backend para gerenciar isso.
 * 
 * Para melhor segurança:
 * 1. Configure regras restritivas no Firestore
 * 2. Use Firebase App Check para proteger contra abuso
 * 3. Considere mover a lógica sensível para Cloud Functions
 */

// Verificar se já foi declarado para evitar redeclaração
if (typeof window === 'undefined' || !window.firebaseConfig) {
    // Configuração do Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBq5qmLy6HAzZAeC4KCVjLfdCM77ttOU3A",
        authDomain: "csf-iac.firebaseapp.com",
        projectId: "csf-iac",
        storageBucket: "csf-iac.firebasestorage.app",
        messagingSenderId: "484645494526",
        appId: "1:484645494526:web:f5ecc23c7c0edbca320faf",
        measurementId: "G-XL3WY01E73"
    };

    // Exportar configuração para uso global (browser)
    if (typeof window !== 'undefined') {
        window.firebaseConfig = firebaseConfig;
    }
    
    // Exportar para módulos (Node.js)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { firebaseConfig: firebaseConfig };
    }
}
