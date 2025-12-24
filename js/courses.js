// /js/courses.js
import { AppState, StorageRepository } from './core/state.js';
import { Logger } from './core/config.js';

// Gerenciar campos do card
let cardFields = [];

export function loadCardFields() {
    try {
        cardFields = StorageRepository.getItem('cardFields', []);
        if (cardFields.length === 0) {
            // Campos padrão se não houver configuração
            cardFields = [
                { id: 'cidade', name: 'Cidade', key: 'cidade', icon: 'location_on', enabled: true, order: 1 },
                { id: 'instrutor', name: 'Instrutor', key: 'instrutor', icon: 'person', enabled: true, order: 2 },
                { id: 'alunos', name: 'Alunos', key: 'alunos', icon: 'groups', enabled: true, order: 3 },
                { id: 'periodo', name: 'Período', key: 'periodo', icon: 'event', enabled: true, order: 4 }
            ];
            saveCardFields();
        }
    } catch (error) {
        Logger.error('Erro ao carregar campos do card:', error);
        cardFields = [];
    }
}

export function saveCardFields() {
    try {
        StorageRepository.setItem('cardFields', cardFields);
        
        // Disparar atualização de todos os cards
        updateAllCourseCards();
        
        Logger.log('Campos do card salvos e cards atualizados');
    } catch (error) {
        Logger.error('Erro ao salvar campos do card:', error);
    }
}

export function getEnabledCardFields() {
    return cardFields
        .filter(f => f.enabled)
        .sort((a, b) => a.order - b.order);
}

export function updateCardField(fieldId, updates) {
    const field = cardFields.find(f => f.id === fieldId);
    if (field) {
        Object.assign(field, updates);
        saveCardFields();
        return true;
    }
    return false;
}

export function toggleCardFieldEnabled(fieldId, enabled) {
    const field = cardFields.find(f => f.id === fieldId);
    if (field) {
        field.enabled = enabled;
        saveCardFields();
        return true;
    }
    return false;
}

export function reorderCardFields(fieldId, newOrder) {
    const field = cardFields.find(f => f.id === fieldId);
    if (field) {
        field.order = newOrder;
        saveCardFields();
        return true;
    }
    return false;
}

// Função para renderizar campos do card dinamicamente
export function renderCardFields(course) {
    const enabledFields = getEnabledCardFields();
    
    if (enabledFields.length === 0) {
        return '';
    }
    
    // Buscar instrutores globalmente se disponível
    const instrutores = window.instrutores || [];
    
    return enabledFields.map(field => {
        const value = getCardFieldValue(course, field, instrutores);
        if (value === null || value === undefined || value === '') {
            return '';
        }
        
        // Se o valor já contém HTML (como botões WhatsApp), retornar direto
        if (typeof value === 'object' && value.html) {
            return `
                <div class="course-info-item" data-field-key="${field.key}">
                    <span class="material-icons">${field.icon || 'info'}</span>
                    ${value.html}
                </div>
            `;
        }
        
        return `
            <div class="course-info-item" data-field-key="${field.key}">
                <span class="material-icons">${field.icon || 'info'}</span>
                <span>${value}</span>
            </div>
        `;
    }).join('');
}

// Função auxiliar para obter valor do campo
function getCardFieldValue(course, field, instrutores = []) {
    const key = field.key;
    
    // Campos especiais
    if (key === 'periodo') {
        if (course.inicio && course.fim) {
            const inicio = formatDate(course.inicio);
            const fim = formatDate(course.fim);
            return `${inicio} - ${fim}`;
        }
        if (course.inicio) {
            return formatDate(course.inicio);
        }
        if (course.fim) {
            return formatDate(course.fim);
        }
        return null;
    }
    
    if (key === 'cargaHoraria') {
        return course.cargaHoraria ? `${course.cargaHoraria}H` : null;
    }
    
    if (key === 'alunos') {
        return course.alunos ? `${course.alunos} concludentes` : null;
    }
    
    if (key === 'cidade') {
        const cidade = course.cidade || 'Local não definido';
        const local = course.local ? ` - ${course.local}` : '';
        return `${cidade}${local}`;
    }
    
    if (key === 'instrutor') {
        const instrutor = course.instrutor || 'Instrutor não definido';
        // Verificar se tem WhatsApp
        const inst = instrutores.find(i => i.nome === course.instrutor);
        if (inst && inst.telefone) {
            const phone = inst.telefone.replace(/\D/g, '');
            return {
                html: `${instrutor} <button class="btn-whatsapp-mini" onclick="event.stopPropagation(); openWhatsApp('${phone}')" title="WhatsApp"><span class="material-icons">chat</span></button>`
            };
        }
        return instrutor;
    }
    
    if (key === 'telefone' && course.telefone) {
        const phone = course.telefone.replace(/\D/g, '');
        return {
            html: `${course.telefone} <button class="btn-whatsapp-mini" onclick="event.stopPropagation(); openWhatsApp('${phone}')" title="WhatsApp"><span class="material-icons">chat</span></button>`
        };
    }
    
    // Campos diretos
    return course[key] || null;
}

// Função para formatar data (deve estar disponível globalmente)
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
}

// Atualizar todos os cards de cursos
export function updateAllCourseCards() {
    // Verificar se estamos na página de cursos
    const coursesPage = document.getElementById('coursesPage');
    if (!coursesPage || !coursesPage.classList.contains('active')) {
        return;
    }
    
    // Disparar re-renderização
    if (typeof window.renderCoursesByLote === 'function') {
        Logger.log('Atualizando todos os cards de cursos...');
        window.renderCoursesByLote();
    } else if (typeof window.renderCourses === 'function') {
        Logger.log('Atualizando todos os cards de cursos...');
        window.renderCourses();
    }
}

// Função para substituir campos fixos por campos dinâmicos no card
export function enhanceCourseCardHTML(cardHTML, course) {
    // Encontrar a seção de course-info e substituir por campos dinâmicos
    const enabledFields = getEnabledCardFields();
    const dynamicFields = renderCardFields(course);
    
    // Se houver campos dinâmicos, substituir a seção course-info
    if (dynamicFields && enabledFields.length > 0) {
        // Remover campos fixos antigos e adicionar dinâmicos
        cardHTML = cardHTML.replace(
            /<div class="course-info">[\s\S]*?<\/div>/g,
            `<div class="course-info">${dynamicFields}</div>`
        );
    }
    
    return cardHTML;
}

// Inicializar quando o módulo for carregado
loadCardFields();

// Exportar para uso global
window.cardFields = cardFields;
window.loadCardFields = loadCardFields;
window.saveCardFields = saveCardFields;
window.getEnabledCardFields = getEnabledCardFields;
window.updateCardField = updateCardField;
window.toggleCardFieldEnabled = toggleCardFieldEnabled;
window.reorderCardFields = reorderCardFields;
window.renderCardFields = renderCardFields;
window.updateAllCourseCards = updateAllCourseCards;

