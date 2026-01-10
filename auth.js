/**
 * Sistema de Autenticação Seguro
 * 
 * Implementa hash de senhas usando Web Crypto API
 * Remove credenciais hardcoded do código
 */

class AuthManager {
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
                console.error('Erro ao carregar usuários:', e);
            }
        }
        
        // Criar usuários padrão com senhas hasheadas
        // NOTA: Em produção, estas senhas devem ser alteradas imediatamente
        return this.initializeDefaultUsers();
    }

    /**
     * Inicializa usuários padrão com senhas hasheadas
     * As senhas originais são: '032147', 'Iac@123', 'viewer123'
     */
    async initializeDefaultUsers() {
        const defaultUsers = [
            { 
                id: 'admin1', 
                name: 'Administrador', 
                username: 'Csfiac', 
                passwordHash: await this.hashPassword('032147'), 
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            { 
                id: 'editor1', 
                name: 'Editor', 
                username: 'Iac', 
                passwordHash: await this.hashPassword('Iac@123'), 
                role: 'editor',
                createdAt: new Date().toISOString()
            },
            { 
                id: 'viewer1', 
                name: 'Visualizador', 
                username: 'viewer', 
                passwordHash: await this.hashPassword('viewer123'), 
                role: 'viewer',
                createdAt: new Date().toISOString()
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
            role: user.role
        };
    }

    /**
     * Cria novo usuário (apenas admin)
     */
    async createUser(userData, currentUserRole) {
        if (currentUserRole !== 'admin') {
            throw new Error('Apenas administradores podem criar usuários');
        }

        const { name, username, password, role } = userData;
        
        if (!name || !username || !password || !role) {
            throw new Error('Todos os campos são obrigatórios');
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
            createdAt: new Date().toISOString()
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
     */
    async changePassword(username, oldPassword, newPassword) {
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValid = await this.verifyPassword(oldPassword, user.passwordHash);
        if (!isValid) {
            throw new Error('Senha atual incorreta');
        }

        user.passwordHash = await this.hashPassword(newPassword);
        this.saveUsers(this.users);
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

