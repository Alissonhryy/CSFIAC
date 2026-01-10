/**
 * Validador de Senhas Fortes
 * Implementa validação robusta de senhas com requisitos de segurança
 */

/**
 * Lista de senhas comuns que devem ser bloqueadas
 */
const COMMON_PASSWORDS = [
    '123456', 'password', '123456789', '12345678', '12345',
    '1234567', '1234567890', 'qwerty', 'abc123', '111111',
    '123123', 'admin', 'letmein', 'welcome', 'monkey',
    '123456789', 'dragon', 'master', 'sunshine', 'password1',
    'princess', 'football', 'welcome', 'admin123', 'root',
    'toor', 'pass', 'test', 'demo', 'guest'
];

/**
 * Valida se a senha atende aos requisitos de segurança
 * @param {string} password - A senha a ser validada
 * @returns {Object} Objeto com {valid: boolean, errors: string[]}
 */
function validatePasswordStrength(password) {
    const errors = [];
    
    if (!password) {
        return { valid: false, errors: ['Senha é obrigatória'] };
    }
    
    // Mínimo de 8 caracteres
    if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
    }
    
    // Máximo de 128 caracteres (prevenir ataques DoS)
    if (password.length > 128) {
        errors.push('A senha deve ter no máximo 128 caracteres');
    }
    
    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    // Pelo menos um número
    if (!/[0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    }
    
    // Pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*...)');
    }
    
    // Verificar senhas comuns
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
        errors.push('Esta senha é muito comum. Por favor, escolha uma senha mais segura');
    }
    
    // Verificar sequências comuns
    const sequences = ['12345', 'abcde', 'qwerty', 'asdfgh', 'zxcvbn'];
    const lowerPassword = password.toLowerCase();
    if (sequences.some(seq => lowerPassword.includes(seq))) {
        errors.push('A senha não deve conter sequências comuns (12345, abcde, etc.)');
    }
    
    // Verificar repetição excessiva (ex: aaaa, 1111)
    if (/(.)\1{3,}/.test(password)) {
        errors.push('A senha não deve conter caracteres repetidos em sequência');
    }
    
    // Verificar padrões do teclado
    const keyboardPatterns = ['qwerty', 'asdf', 'zxcv', '1234'];
    if (keyboardPatterns.some(pattern => lowerPassword.includes(pattern))) {
        errors.push('A senha não deve conter padrões do teclado');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors,
        strength: calculatePasswordStrength(password)
    };
}

/**
 * Calcula a força da senha (0-100)
 * @param {string} password - A senha a ser analisada
 * @returns {number} Score de 0 a 100
 */
function calculatePasswordStrength(password) {
    let score = 0;
    
    // Comprimento
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
    
    // Tipos de caracteres
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    
    // Variedade de caracteres
    const uniqueChars = new Set(password).size;
    score += Math.min(20, uniqueChars * 2);
    
    // Penalidades
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) score = Math.max(0, score - 50);
    if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 10);
    if (/[0-9]{4,}/.test(password)) score = Math.max(0, score - 5);
    
    return Math.min(100, Math.max(0, score));
}

/**
 * Gera mensagem de força da senha
 * @param {number} strength - Score de força (0-100)
 * @returns {string} Mensagem descritiva
 */
function getPasswordStrengthMessage(strength) {
    if (strength < 30) return 'Muito fraca';
    if (strength < 50) return 'Fraca';
    if (strength < 70) return 'Média';
    if (strength < 90) return 'Forte';
    return 'Muito forte';
}

/**
 * Gera sugestões de melhoria para a senha
 * @param {string} password - A senha atual
 * @returns {string[]} Array de sugestões
 */
function getPasswordSuggestions(password) {
    const suggestions = [];
    
    if (password.length < 8) {
        suggestions.push('Use pelo menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        suggestions.push('Adicione letras maiúsculas');
    }
    
    if (!/[0-9]/.test(password)) {
        suggestions.push('Adicione números');
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
        suggestions.push('Adicione caracteres especiais (!@#$%...)');
    }
    
    if (password.length < 12) {
        suggestions.push('Senhas mais longas são mais seguras (12+ caracteres)');
    }
    
    return suggestions;
}

// Exportar funções
if (typeof window !== 'undefined') {
    window.passwordValidator = {
        validatePasswordStrength,
        calculatePasswordStrength,
        getPasswordStrengthMessage,
        getPasswordSuggestions
    };
}

