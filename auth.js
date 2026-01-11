/**
 * Sistema de Autenticação Seguro
 * 
 * Implementa hash de senhas usando PBKDF2 com salt
 * Sistema de inicialização assíncrona adequado
 */

class AuthManager {
    constructor() {
        this.loginAttempts = new Map(); // username -> { count, lastAttempt, blockedUntil }
        this.maxAttempts = 5;
        this.blockDuration = 30000; // 30 segundos
        this.users = [];
        this.initialized = false;
        this._initializing = false;
        this._initPromise = null;
    }

    /**
     * Inicializa o AuthManager (deve ser chamado após instanciar)
     */
    async init() {
        if (this.initialized) {
            return this.users;
        }
        
        if (this._initializing) {
            await this._initPromise;
            return this.users;
        }
        
        this._initializing = true;
        this._initPromise = this.loadUsers();
        
        try {
            this.users = await this._initPromise;
            this.initialized = true;
        } finally {
            this._initializing = false;
            this._initPromise = null;
        }
        
        return this.users;
    }

    /**
     * Carrega usuários do localStorage ou cria usuários padrão com senhas hasheadas
     */
    async loadUsers() {
        const stored = localStorage.getItem('auth_users');
        if (stored) {
            try {
                const users = JSON.parse(stored);
                // Migrar senhas antigas (sem salt) para novo formato
                const migratedUsers = await Promise.all(users.map(async (user) => {
                    if (typeof user.passwordHash === 'string' && !user.passwordSalt) {
                        // Senha antiga (SHA-256 sem salt) - rehashar com PBKDF2
                        // Nota: Como não temos a senha original, vamos manter o hash antigo
                        // Na próxima mudança de senha, será atualizado
                        return user;
                    }
                    return user;
                }));
                return migratedUsers;
            } catch (e) {
                console.error('Erro ao carregar usuários:', e);
            }
        }
        
        // Criar usuários padrão com senhas hasheadas
        // NOTA: Em produção, estas senhas devem ser alteradas imediatamente
        return await this.initializeDefaultUsers();
    }

    /**
     * Inicializa usuários padrão com senhas hasheadas
     * NOTA: Senhas padrão devem ser alteradas na primeira entrada em produção
     */
    async initializeDefaultUsers() {
        const defaultPasswords = ['032147', 'Iac@123', 'viewer123'];
        
        const defaultUsers = [
            { 
                id: 'admin1', 
                name: 'Administrador', 
                username: 'Csfiac', 
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            { 
                id: 'editor1', 
                name: 'Editor', 
                username: 'Iac', 
                role: 'editor',
                createdAt: new Date().toISOString()
            },
            { 
                id: 'viewer1', 
                name: 'Visualizador', 
                username: 'viewer', 
                role: 'viewer',
                createdAt: new Date().toISOString()
            }
        ];
        
        // Hashar senhas com PBKDF2
        for (let i = 0; i < defaultUsers.length; i++) {
            const hashData = await this.hashPassword(defaultPasswords[i]);
            defaultUsers[i].passwordHash = hashData.hash;
            defaultUsers[i].passwordSalt = hashData.salt;
        }
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    /**
     * Gera hash da senha usando PBKDF2 com salt
     */
    async hashPassword(password, salt = null) {
        // Gerar salt se não fornecido
        if (!salt) {
            salt = crypto.getRandomValues(new Uint8Array(16));
        } else if (typeof salt === 'string') {
            // Se salt é string (hex), converter para Uint8Array
            salt = new Uint8Array(salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        }
        
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        
        // Importar chave
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordData,
            'PBKDF2',
            false,
            ['deriveBits']
        );
        
        // Derivar bits com PBKDF2
        const hashBuffer = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000, // 100.000 iterações
                hash: 'SHA-256'
            },
            keyMaterial,
            256 // 256 bits = 32 bytes
        );
        
        // Converter para hex
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const saltArray = Array.from(salt);
        const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return {
            hash: hashHex,
            salt: saltHex
        };
    }

    /**
     * Verifica se a senha está correta
     */
    async verifyPassword(password, passwordHash, passwordSalt) {
        // Se passwordHash é string antiga (sem salt), tentar migrar
        if (passwordSalt === undefined) {
            // Senha antiga - usar SHA-256 para compatibilidade
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex === passwordHash;
        }
        
        // Senha nova - usar PBKDF2
        const hashData = await this.hashPassword(password, passwordSalt);
        return hashData.hash === passwordHash;
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
        if (!this.initialized) {
            await this.init();
        }
        
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
        const isValid = await this.verifyPassword(password, user.passwordHash, user.passwordSalt);
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

        if (!this.initialized) {
            await this.init();
        }

        const { name, username, password, role } = userData;
        
        if (!name || !username || !password || !role) {
            throw new Error('Todos os campos são obrigatórios');
        }

        if (this.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Usuário já existe');
        }

        const hashData = await this.hashPassword(password);
        const newUser = {
            id: 'user_' + Date.now(),
            name,
            username,
            passwordHash: hashData.hash,
            passwordSalt: hashData.salt,
            role,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers(this.users);
        
        // Sincronizar com Firebase se disponível
        if (typeof window !== 'undefined' && window.firebaseAvailable && window.db) {
            try {
                const userDataForFirebase = {
                    id: newUser.id,
                    name: newUser.name,
                    username: newUser.username,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                    updatedAt: new Date().toISOString()
                    // Não salvar passwordHash no Firebase por segurança
                };
                
                await window.db.collection('users').doc(newUser.id).set(userDataForFirebase);
                console.log('✅ Usuário sincronizado com Firebase');
            } catch (error) {
                console.error('Erro ao sincronizar usuário com Firebase:', error);
                // Não falhar a criação se o Firebase falhar
            }
        }
        
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
        if (!this.initialized) {
            await this.init();
        }
        
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValid = await this.verifyPassword(oldPassword, user.passwordHash, user.passwordSalt);
        if (!isValid) {
            throw new Error('Senha atual incorreta');
        }

        const hashData = await this.hashPassword(newPassword);
        user.passwordHash = hashData.hash;
        user.passwordSalt = hashData.salt;
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

