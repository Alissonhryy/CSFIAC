/**
 * UI Controls - Sistema de Níveis de Animação e Controles de Interface
 */

// Sistema de Níveis de Animação
const MotionLevel = {
    NONE: 0,
    NORMAL: 1,
    FULL: 2
};

/**
 * Define o nível de animação do sistema
 * @param {number} level - 0 (none), 1 (normal), 2 (full)
 */
function setMotionLevel(level) {
    if (level < 0 || level > 2) {
        console.warn('Nível de animação inválido. Use 0, 1 ou 2.');
        return;
    }
    
    document.documentElement.style.setProperty('--motion-level', level);
    localStorage.setItem('motionLevel', level);
    
    // Aplicar preferência do usuário
    if (level === MotionLevel.NONE) {
        document.documentElement.classList.add('motion-reduced');
    } else {
        document.documentElement.classList.remove('motion-reduced');
    }
}

/**
 * Obtém o nível de animação atual
 * @returns {number}
 */
function getMotionLevel() {
    const stored = localStorage.getItem('motionLevel');
    if (stored !== null) {
        return parseInt(stored, 10);
    }
    
    // Verificar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return MotionLevel.NONE;
    }
    
    // Padrão: NORMAL
    return MotionLevel.NORMAL;
}

/**
 * Inicializa o sistema de níveis de animação
 */
function initMotionLevel() {
    const level = getMotionLevel();
    setMotionLevel(level);
}

// Inicializar ao carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionLevel);
} else {
    initMotionLevel();
}

// Exportar para uso global
window.MotionLevel = MotionLevel;
window.setMotionLevel = setMotionLevel;
window.getMotionLevel = getMotionLevel;

