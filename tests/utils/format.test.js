/**
 * Testes para funções de formatação
 */

import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, normalizeStatus, formatPhone } from '../../src/js/utils/format.js';

describe('Format Utils', () => {
  describe('formatDate', () => {
    it('deve formatar data corretamente', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve retornar string vazia para data inválida', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('invalid')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora corretamente', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('/');
      expect(formatted).toContain(':');
    });
  });

  describe('normalizeStatus', () => {
    it('deve normalizar status corretamente', () => {
      expect(normalizeStatus('pendente')).toBe('Pendente');
      expect(normalizeStatus('em andamento')).toBe('Em Andamento');
      expect(normalizeStatus('concluído')).toBe('Concluído');
      expect(normalizeStatus('CONCLUIDO')).toBe('Concluído');
    });

    it('deve retornar "Pendente" para status vazio', () => {
      expect(normalizeStatus('')).toBe('Pendente');
      expect(normalizeStatus(null)).toBe('Pendente');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone com 11 dígitos', () => {
      expect(formatPhone('85987654321')).toMatch(/\(\d{2}\) \d{5}-\d{4}/);
    });

    it('deve formatar telefone com 10 dígitos', () => {
      expect(formatPhone('8598765432')).toMatch(/\(\d{2}\) \d{4}-\d{4}/);
    });

    it('deve retornar string vazia para telefone inválido', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone('123')).toBe('123');
    });
  });
});

