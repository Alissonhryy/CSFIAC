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

/**
 * Verifica autenticação salva
 */
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            window.currentUser = JSON.parse(savedUser);
            showApp();
        } catch (e) {
            safeError('Erro ao carregar usuário salvo:', e);
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
            safeError('Erro ao carregar usuário lembrado:', e);
        }
    }
}

/**
 * Atualiza UI de bloqueio
 */
function updateBlockUI(username) {
    const loginForm = document.getElementById('loginForm');
    const loginBlocked = document.getElementById('loginBlocked');
    const countdownEl = document.getElementById('blockCountdown');
    const loginError = document.getElementById('loginError');
    
    if (authManager.isUserBlocked(username)) {
        const remaining = authManager.getBlockTimeRemaining(username);
        if (loginForm) loginForm.style.display = 'none';
        if (loginBlocked) loginBlocked.style.display = 'block';
        if (countdownEl) countdownEl.textContent = remaining;
        
        // Atualizar contador
        const blockInterval = setInterval(() => {
            const timeLeft = authManager.getBlockTimeRemaining(username);
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(blockInterval);
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
    
    // Verificar se está bloqueado (usar variável global)
    if (window.isLoginBlocked || authManager.isUserBlocked(username)) {
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
        
        // Verificar se precisa alterar senha
        if (user.mustChangePassword || user.isDefaultPassword) {
            if (loginError) loginError.classList.remove('show');
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Mostrar modal de alteração de senha obrigatória
            showPasswordChangeModal(user);
            return;
        }
        
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
        
        safeError('Erro no login:', error);
    }
}

/**
 * Mostra modal para alteração obrigatória de senha
 * @param {Object} user - Dados do usuário
 */
function showPasswordChangeModal(user) {
    // Criar modal se não existir
    let modal = document.getElementById('passwordChangeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'passwordChangeModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>Alteração de Senha Obrigatória</h2>
                </div>
                <div class="modal-body">
                    <p style="color: var(--warning); margin-bottom: 1.5rem;">
                        ${user.isDefaultPassword 
                            ? '⚠️ Você está usando uma senha padrão. Por segurança, é obrigatório alterá-la agora.' 
                            : '⚠️ Você precisa alterar sua senha para continuar.'}
                    </p>
                    <form id="passwordChangeForm">
                        <div class="form-group">
                            <label for="currentPasswordChange">Senha Atual</label>
                            <input type="password" id="currentPasswordChange" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="newPasswordChange">Nova Senha</label>
                            <input type="password" id="newPasswordChange" class="form-input" required>
                            <div id="passwordStrengthIndicator" style="margin-top: 0.5rem;"></div>
                            <div id="passwordErrors" style="margin-top: 0.5rem; color: var(--danger); font-size: 0.875rem;"></div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPasswordChange">Confirmar Nova Senha</label>
                            <input type="password" id="confirmPasswordChange" class="form-input" required>
                            <div id="passwordMatchIndicator" style="margin-top: 0.5rem;"></div>
                        </div>
                        <div id="passwordChangeError" class="error-message" style="display: none; margin-bottom: 1rem;"></div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary" id="submitPasswordChange">Alterar Senha</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Adicionar validação em tempo real se validador estiver disponível
        if (typeof window !== 'undefined' && window.passwordValidator) {
            const newPasswordInput = document.getElementById('newPasswordChange');
            const confirmPasswordInput = document.getElementById('confirmPasswordChange');
            const strengthIndicator = document.getElementById('passwordStrengthIndicator');
            const errorsDiv = document.getElementById('passwordErrors');
            const matchIndicator = document.getElementById('passwordMatchIndicator');
            
            if (newPasswordInput) {
                newPasswordInput.addEventListener('input', () => {
                    const password = newPasswordInput.value;
                    if (password) {
                        const validation = window.passwordValidator.validatePasswordStrength(password);
                        const strength = window.passwordValidator.calculatePasswordStrength(password);
                        const strengthMsg = window.passwordValidator.getPasswordStrengthMessage(strength);
                        
                        // Mostrar força da senha
                        strengthIndicator.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span>Força: <strong>${strengthMsg}</strong></span>
                                <div style="flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
                                    <div style="height: 100%; width: ${strength}%; background: ${strength < 50 ? 'var(--danger)' : strength < 70 ? 'var(--warning)' : 'var(--success)'};"></div>
                                </div>
                            </div>
                        `;
                        
                        // Mostrar erros
                        if (!validation.valid) {
                            errorsDiv.innerHTML = validation.errors.map(err => `• ${err}`).join('<br>');
                            errorsDiv.style.display = 'block';
                        } else {
                            errorsDiv.style.display = 'none';
                        }
                    } else {
                        strengthIndicator.innerHTML = '';
                        errorsDiv.style.display = 'none';
                    }
                });
            }
            
            // Verificar correspondência de senhas
            if (confirmPasswordInput && newPasswordInput) {
                confirmPasswordInput.addEventListener('input', () => {
                    const match = confirmPasswordInput.value === newPasswordInput.value;
                    if (confirmPasswordInput.value) {
                        matchIndicator.innerHTML = match 
                            ? '<span style="color: var(--success);">✓ Senhas coincidem</span>' 
                            : '<span style="color: var(--danger);">✗ Senhas não coincidem</span>';
                        matchIndicator.style.display = 'block';
                    } else {
                        matchIndicator.style.display = 'none';
                    }
                });
            }
        }
        
        // Handler do formulário
        const form = document.getElementById('passwordChangeForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handlePasswordChange(user.username);
            });
        }
    }
    
    modal.style.display = 'flex';
}

/**
 * Handler para alteração de senha
 * @param {string} username - Nome de usuário
 */
async function handlePasswordChange(username) {
    const currentPassword = document.getElementById('currentPasswordChange').value;
    const newPassword = document.getElementById('newPasswordChange').value;
    const confirmPassword = document.getElementById('confirmPasswordChange').value;
    const errorDiv = document.getElementById('passwordChangeError');
    const submitBtn = document.getElementById('submitPasswordChange');
    
    // Validações básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
        errorDiv.textContent = 'Preencha todos os campos';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'As senhas não coincidem';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Validar força da senha
    if (typeof window !== 'undefined' && window.passwordValidator) {
        const validation = window.passwordValidator.validatePasswordStrength(newPassword);
        if (!validation.valid) {
            errorDiv.innerHTML = `Senha inválida:<br>${validation.errors.map(err => `• ${err}`).join('<br>')}`;
            errorDiv.style.display = 'block';
            return;
        }
    }
    
    // Desabilitar botão durante processamento
    submitBtn.disabled = true;
    submitBtn.textContent = 'Alterando...';
    errorDiv.style.display = 'none';
    
    try {
        await authManager.changePassword(username, currentPassword, newPassword);
        
        // Senha alterada com sucesso
        if (typeof showToast === 'function') {
            showToast('Senha alterada com sucesso!', 'success');
        }
        
        // Fechar modal
        const modal = document.getElementById('passwordChangeModal');
        if (modal) modal.style.display = 'none';
        
        // Fazer login novamente automaticamente
        const user = await authManager.authenticate(username, newPassword);
        window.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (typeof showApp === 'function') {
            showApp();
        }
        
    } catch (error) {
        errorDiv.textContent = error.message || 'Erro ao alterar senha';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Alterar Senha';
    }
}

/**
 * Logout
 */
function handleLogout() {
    window.currentUser = null;
    localStorage.removeItem('currentUser');
    
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

