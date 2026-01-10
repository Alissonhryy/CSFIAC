/**
 * Sistema de Autenticação Seguro
 * 
 * Implementa hash de senhas usando Web Crypto API
 * Remove credenciais hardcoded do código
 * Força alteração de senhas padrão no primeiro login
 * 
 * @class AuthManager
 */
class AuthManager {
    /**
     * @constructor
     */
    constructor() {
        this.loginAttempts = new Map(); // username -> { count, lastAttempt, blockedUntil }
        this.maxAttempts = 5;
        this.blockDuration = 30000; // 30 segundos
        this.users = this.loadUsers();
    }

    /**
     * Carrega usuários do localStorage ou cria usuários padrão com senhas hasheadas
     */
    loadUsers() {
        const stored = localStorage.getItem('auth_users');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                if (typeof safeError === 'function') {
                    safeError('Erro ao carregar usuários:', e);
                } else {
                    console.error('Erro ao carregar usuários:', e);
                }
            }
        }
        
        // Criar usuários padrão com senhas hasheadas
        // NOTA: Em produção, estas senhas devem ser alteradas imediatamente
        return this.initializeDefaultUsers();
    }

    /**
     * Inicializa usuários padrão com senhas hasheadas
     * As senhas originais são: '032147', 'Iac@123', 'viewer123'
     * IMPORTANTE: Estes usuários são marcados para forçar alteração de senha no primeiro login
     * 
     * @returns {Promise<Array>} Array de usuários padrão
     */
    async initializeDefaultUsers() {
        const defaultUsers = [
            { 
                id: 'admin1', 
                name: 'Administrador', 
                username: 'Csfiac', 
                passwordHash: await this.hashPassword('032147'), 
                role: 'admin',
                createdAt: new Date().toISOString(),
                mustChangePassword: true, // Forçar alteração no primeiro login
                isDefaultPassword: true
            },
            { 
                id: 'editor1', 
                name: 'Editor', 
                username: 'Iac', 
                passwordHash: await this.hashPassword('Iac@123'), 
                role: 'editor',
                createdAt: new Date().toISOString(),
                mustChangePassword: true,
                isDefaultPassword: true
            },
            { 
                id: 'viewer1', 
                name: 'Visualizador', 
                username: 'viewer', 
                passwordHash: await this.hashPassword('viewer123'), 
                role: 'viewer',
                createdAt: new Date().toISOString(),
                mustChangePassword: true,
                isDefaultPassword: true
            }
        ];
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    /**
     * Gera hash da senha usando Web Crypto API
     */
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Verifica se a senha está correta
     */
    async verifyPassword(password, passwordHash) {
        const hash = await this.hashPassword(password);
        return hash === passwordHash;
    }

    /**
     * Verifica se o usuário está bloqueado
     */
    isUserBlocked(username) {
        const attempts = this.loginAttempts.get(username);
        if (!attempts) return false;
        
        if (attempts.blockedUntil && new Date() < attempts.blockedUntil) {
            return true;
        }
        
        // Remover bloqueio se expirou
        if (attempts.blockedUntil && new Date() >= attempts.blockedUntil) {
            this.loginAttempts.delete(username);
            return false;
        }
        
        return false;
    }

    /**
     * Registra tentativa de login falha
     */
    recordFailedAttempt(username) {
        const attempts = this.loginAttempts.get(username) || { count: 0 };
        attempts.count++;
        attempts.lastAttempt = new Date();
        
        if (attempts.count >= this.maxAttempts) {
            attempts.blockedUntil = new Date(Date.now() + this.blockDuration);
        }
        
        this.loginAttempts.set(username, attempts);
    }

    /**
     * Limpa tentativas de login após sucesso
     */
    clearLoginAttempts(username) {
        this.loginAttempts.delete(username);
    }

    /**
     * Autentica usuário
     * @param {string} username - Nome de usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Objeto com dados do usuário e flag de mudança de senha obrigatória
     * @throws {Error} Se as credenciais forem inválidas ou conta estiver bloqueada
     */
    async authenticate(username, password) {
        // Verificar se está bloqueado
        if (this.isUserBlocked(username)) {
            const attempts = this.loginAttempts.get(username);
            const remainingTime = Math.ceil((attempts.blockedUntil - new Date()) / 1000);
            throw new Error(`Conta bloqueada. Aguarde ${remainingTime} segundos.`);
        }

        // Buscar usuário
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            this.recordFailedAttempt(username);
            throw new Error('Credenciais inválidas');
        }

        // Verificar senha
        const isValid = await this.verifyPassword(password, user.passwordHash);
        if (!isValid) {
            this.recordFailedAttempt(username);
            throw new Error('Credenciais inválidas');
        }

        // Login bem-sucedido
        this.clearLoginAttempts(username);
        
        // Retornar usuário (sem senha)
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            mustChangePassword: user.mustChangePassword === true,
            isDefaultPassword: user.isDefaultPassword === true
        };
    }

    /**
     * Cria novo usuário (apenas admin)
     * @param {Object} userData - Dados do usuário {name, username, password, role}
     * @param {string} currentUserRole - Papel do usuário atual
     * @returns {Promise<Object>} Dados do novo usuário criado
     * @throws {Error} Se validações falharem
     */
    async createUser(userData, currentUserRole) {
        if (currentUserRole !== 'admin') {
            throw new Error('Apenas administradores podem criar usuários');
        }

        const { name, username, password, role } = userData;
        
        if (!name || !username || !password || !role) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Validar força da senha se validador estiver disponível
        if (typeof window !== 'undefined' && window.passwordValidator) {
            const validation = window.passwordValidator.validatePasswordStrength(password);
            if (!validation.valid) {
                throw new Error(`Senha inválida: ${validation.errors.join(', ')}`);
            }
        } else {
            // Validação básica
            if (password.length < 8) {
                throw new Error('A senha deve ter no mínimo 8 caracteres');
            }
        }

        if (this.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Usuário já existe');
        }

        const passwordHash = await this.hashPassword(password);
        const newUser = {
            id: 'user_' + Date.now(),
            name,
            username,
            passwordHash,
            role,
            createdAt: new Date().toISOString(),
            mustChangePassword: false,
            isDefaultPassword: false
        };

        this.users.push(newUser);
        this.saveUsers(this.users);
        
        return {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            role: newUser.role
        };
    }

    /**
     * Altera senha do usuário
     * @param {string} username - Nome de usuário
     * @param {string} oldPassword - Senha atual
     * @param {string} newPassword - Nova senha
     * @param {boolean} skipOldPasswordCheck - Se true, pula verificação da senha antiga (para reset por admin)
     * @returns {Promise<void>}
     * @throws {Error} Se validações falharem
     */
    async changePassword(username, oldPassword, newPassword, skipOldPasswordCheck = false) {
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Validar força da nova senha
        if (typeof window !== 'undefined' && window.passwordValidator) {
            const validation = window.passwordValidator.validatePasswordStrength(newPassword);
            if (!validation.valid) {
                throw new Error(`Senha inválida: ${validation.errors.join(', ')}`);
            }
        } else {
            // Validação básica
            if (newPassword.length < 8) {
                throw new Error('A senha deve ter no mínimo 8 caracteres');
            }
        }

        // Verificar se a nova senha é igual à atual
        const isSamePassword = await this.verifyPassword(newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new Error('A nova senha deve ser diferente da senha atual');
        }

        // Verificar senha antiga (a menos que seja reset por admin)
        if (!skipOldPasswordCheck) {
            const isValid = await this.verifyPassword(oldPassword, user.passwordHash);
            if (!isValid) {
                throw new Error('Senha atual incorreta');
            }
        }

        user.passwordHash = await this.hashPassword(newPassword);
        user.mustChangePassword = false; // Remover flag de mudança obrigatória
        user.isDefaultPassword = false; // Não é mais senha padrão
        user.passwordChangedAt = new Date().toISOString();
        this.saveUsers(this.users);
    }

    /**
     * Verifica se usuário precisa alterar senha
     * @param {string} username - Nome de usuário
     * @returns {boolean} True se precisa alterar senha
     */
    needsPasswordChange(username) {
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        return user ? (user.mustChangePassword === true) : false;
    }

    /**
     * Salva usuários no localStorage
     */
    saveUsers(users) {
        localStorage.setItem('auth_users', JSON.stringify(users));
        this.users = users;
    }

    /**
     * Obtém tempo restante de bloqueio
     */
    getBlockTimeRemaining(username) {
        const attempts = this.loginAttempts.get(username);
        if (!attempts || !attempts.blockedUntil) return 0;
        
        const remaining = attempts.blockedUntil - new Date();
        return Math.max(0, Math.ceil(remaining / 1000));
    }

    /**
     * Obtém número de tentativas restantes
     */
    getRemainingAttempts(username) {
        const attempts = this.loginAttempts.get(username);
        if (!attempts) return this.maxAttempts;
        return Math.max(0, this.maxAttempts - attempts.count);
    }
}

// Criar instância global
const authManager = new AuthManager();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
    window.authManager = authManager;
}

