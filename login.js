/**
 * Módulo de Login
 * Gerencia autenticação de usuários usando o AuthManager
 */

// Variáveis de estado
// Usar window para evitar conflitos com outras declarações
if (typeof window.isLoginBlocked === 'undefined') {
    window.isLoginBlocked = false;
}
if (typeof window.blockTimer === 'undefined') {
    window.blockTimer = null;
}
if (typeof window.blockIntervalRef === 'undefined') {
    window.blockIntervalRef = null;
}

/**
 * Verifica autenticação salva
 */
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            window.currentUser = JSON.parse(savedUser);
            if (typeof showApp === 'function') {
                showApp();
            }
        } catch (e) {
            if (typeof safeError === 'function') {
                safeError('Erro ao carregar usuário salvo:', e);
            } else {
                console.error('Erro ao carregar usuário salvo:', e);
            }
            localStorage.removeItem('currentUser');
        }
    }
}

/**
 * Atualiza saudação baseada na hora
 */
function updateLoginGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Bom dia! ☀️';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Boa tarde! 🌤️';
    } else {
        greeting = 'Boa noite! 🌙';
    }
    
    const greetingEl = document.getElementById('loginGreeting');
    if (greetingEl) {
        greetingEl.textContent = `${greeting} Faça login para continuar.`;
    }
}

/**
 * Toggle mostrar/ocultar senha
 */
function initializePasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = toggleBtn.querySelector('.material-icons');
            if (icon) {
                icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
            }
        });
    }
}

/**
 * Validação em tempo real
 */
function initializeLoginValidation() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const usernameFeedback = document.getElementById('usernameFeedback');
    const passwordFeedback = document.getElementById('passwordFeedback');

    if (usernameInput && usernameFeedback) {
        usernameInput.addEventListener('input', () => {
            const value = usernameInput.value.trim();
            if (value.length === 0) {
                usernameInput.classList.remove('valid', 'invalid');
                usernameFeedback.classList.remove('show');
            } else if (value.length < 3) {
                usernameInput.classList.remove('valid');
                usernameInput.classList.add('invalid');
                usernameFeedback.textContent = 'Mínimo 3 caracteres';
                usernameFeedback.className = 'input-feedback show error';
            } else {
                usernameInput.classList.remove('invalid');
                usernameInput.classList.add('valid');
                usernameFeedback.classList.remove('show');
            }
        });
    }

    if (passwordInput && passwordFeedback) {
        passwordInput.addEventListener('input', () => {
            const value = passwordInput.value;
            if (value.length === 0) {
                passwordInput.classList.remove('valid', 'invalid');
                passwordFeedback.classList.remove('show');
            } else if (value.length < 3) {
                passwordInput.classList.remove('valid');
                passwordInput.classList.add('invalid');
                passwordFeedback.textContent = 'Mínimo 3 caracteres';
                passwordFeedback.className = 'input-feedback show error';
            } else {
                passwordInput.classList.remove('invalid');
                passwordInput.classList.add('valid');
                passwordFeedback.classList.remove('show');
            }
        });
    }
}

/**
 * Bloqueia login após tentativas
 */
function blockLogin(seconds = 30) {
    window.isLoginBlocked = true;
    const loginForm = document.getElementById('loginForm');
    const loginBlocked = document.getElementById('loginBlocked');
    const countdownEl = document.getElementById('blockCountdown');
    
    if (loginForm) loginForm.style.display = 'none';
    if (loginBlocked) loginBlocked.style.display = 'block';
    
    let remaining = seconds;
    if (countdownEl) countdownEl.textContent = remaining;
    
    if (window.blockTimer) clearInterval(window.blockTimer);
    
    window.blockTimer = setInterval(() => {
        remaining--;
        if (countdownEl) countdownEl.textContent = remaining;
        
        if (remaining <= 0) {
            clearInterval(window.blockTimer);
            window.blockTimer = null;
            window.isLoginBlocked = false;
            if (loginBlocked) loginBlocked.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        }
    }, 1000);
}

/**
 * Esqueci minha senha
 */
function initializeForgotPassword() {
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showToast === 'function') {
                showToast('Entre em contato com o administrador para redefinir sua senha.', 'info');
            }
        });
    }
}

/**
 * Lembrar de mim
 */
function checkRememberedUser() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        try {
            const { username } = JSON.parse(remembered);
            const usernameInput = document.getElementById('loginUsername');
            const rememberCheckbox = document.getElementById('rememberMe');
            if (usernameInput) usernameInput.value = username;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        } catch (e) {
            if (typeof safeError === 'function') {
                safeError('Erro ao carregar usuário lembrado:', e);
            } else {
                console.error('Erro ao carregar usuário lembrado:', e);
            }
        }
    }
}

/**
 * Atualiza UI de bloqueio
 * CORRIGIDO: Memory leak - intervalo agora é limpo corretamente
 */
function updateBlockUI(username) {
    // Limpar intervalo anterior se existir
    if (window.blockIntervalRef) {
        clearInterval(window.blockIntervalRef);
        window.blockIntervalRef = null;
    }
    
    const loginForm = document.getElementById('loginForm');
    const loginBlocked = document.getElementById('loginBlocked');
    const countdownEl = document.getElementById('blockCountdown');
    const loginError = document.getElementById('loginError');
    
    // Verificar se authManager existe antes de usar
    if (typeof authManager === 'undefined' || !authManager) {
        if (loginError) {
            loginError.textContent = 'Sistema de autenticação não disponível';
            loginError.classList.add('show');
        }
        return;
    }
    
    if (authManager.isUserBlocked(username)) {
        const remaining = authManager.getBlockTimeRemaining(username);
        if (loginForm) loginForm.style.display = 'none';
        if (loginBlocked) loginBlocked.style.display = 'block';
        if (countdownEl) countdownEl.textContent = remaining;
        
        // Atualizar contador - armazenar referência para poder limpar depois
        window.blockIntervalRef = setInterval(() => {
            const timeLeft = authManager.getBlockTimeRemaining(username);
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                if (window.blockIntervalRef) {
                    clearInterval(window.blockIntervalRef);
                    window.blockIntervalRef = null;
                }
                if (loginBlocked) loginBlocked.style.display = 'none';
                if (loginForm) loginForm.style.display = 'block';
            }
        }, 1000);
    } else {
        const remainingAttempts = authManager.getRemainingAttempts(username);
        if (loginError) {
            loginError.textContent = `Credenciais inválidas. ${remainingAttempts} tentativa(s) restante(s).`;
            loginError.classList.add('show');
        }
    }
}

/**
 * Handler de login usando AuthManager
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Verificar se authManager existe
    if (typeof authManager === 'undefined' || !authManager) {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = 'Sistema de autenticação não disponível. Recarregue a página.';
            loginError.classList.add('show');
        }
        if (typeof safeError === 'function') {
            safeError('authManager não está disponível');
        }
        return;
    }
    
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe')?.checked;
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    
    if (!usernameInput || !passwordInput || !loginBtn) return;
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        if (loginError) {
            loginError.textContent = 'Preencha todos os campos';
            loginError.classList.add('show');
        }
        return;
    }
    
    // Garantir que authManager está inicializado
    if (authManager.init && !authManager.initialized) {
        try {
            await authManager.init();
        } catch (error) {
            if (loginError) {
                loginError.textContent = 'Erro ao inicializar sistema de autenticação';
                loginError.classList.add('show');
            }
            if (typeof safeError === 'function') {
                safeError('Erro ao inicializar authManager:', error);
            }
            return;
        }
    }
    
    // Verificar se está bloqueado (usar variável global)
    if (window.isLoginBlocked || (authManager.isUserBlocked && authManager.isUserBlocked(username))) {
        updateBlockUI(username);
        return;
    }
    
    // Mostrar loading
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    if (loginError) loginError.classList.remove('show');
    
    try {
        // Simular pequeno delay para UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Autenticar usando AuthManager
        const user = await authManager.authenticate(username, password);
        
        // Login bem-sucedido
        window.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        if (loginError) loginError.classList.remove('show');
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        // Mostrar app
        if (typeof showApp === 'function') {
            showApp();
        }
        
        // Log de atividade
        if (typeof logActivity === 'function') {
            logActivity('Login', `${user.name} fez login`, 'add');
        }
        
        if (typeof addAuditLog === 'function') {
            addAuditLog('login', 'session', user.id, `${user.name} fez login`);
        }
        
    } catch (error) {
        // Login falhou
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        // Atualizar UI de bloqueio se necessário
        updateBlockUI(username);
        
        if (typeof safeError === 'function') {
            safeError('Erro no login:', error);
        } else {
            console.error('Erro no login:', error);
        }
    }
}

/**
 * Logout
 */
function handleLogout() {
    window.currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Limpar intervalos
    if (window.blockTimer) {
        clearInterval(window.blockTimer);
        window.blockTimer = null;
    }
    if (window.blockIntervalRef) {
        clearInterval(window.blockIntervalRef);
        window.blockIntervalRef = null;
    }
    
    // Mostrar tela de login
    const loginOverlay = document.getElementById('loginOverlay');
    const appContainer = document.querySelector('.app-container');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    
    // Limpar formulário
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    // Limpar erros
    const loginError = document.getElementById('loginError');
    if (loginError) loginError.classList.remove('show');
}

// Exportar funções
if (typeof window !== 'undefined') {
    window.checkAuth = checkAuth;
    window.updateLoginGreeting = updateLoginGreeting;
    window.initializePasswordToggle = initializePasswordToggle;
    window.initializeLoginValidation = initializeLoginValidation;
    window.initializeForgotPassword = initializeForgotPassword;
    window.checkRememberedUser = checkRememberedUser;
    window.handleLogin = handleLogin;
    window.handleLogout = handleLogout;
}

