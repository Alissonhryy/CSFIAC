/**
 * Testes para funções de segurança
 */

import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeHtmlAttribute, validateInput } from '../../src/js/utils/security.js';

describe('Security Utils', () => {
  describe('escapeHtml', () => {
    it('deve escapar caracteres HTML perigosos', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });

    it('deve retornar string vazia para null/undefined', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('deve preservar texto seguro', () => {
      expect(escapeHtml('Texto normal')).toBe('Texto normal');
    });
  });

  describe('escapeHtmlAttribute', () => {
    it('deve escapar caracteres para atributos HTML', () => {
      expect(escapeHtmlAttribute('value"onclick="alert(1)')).toContain('&quot;');
      expect(escapeHtmlAttribute("value'onclick='alert(1)")).toContain('&#x27;');
    });
  });

  describe('validateInput', () => {
    it('deve validar e sanitizar strings', () => {
      const result = validateInput('<script>alert("xss")</script>', 'string');
      expect(result).not.toContain('<script>');
    });

    it('deve validar números', () => {
      expect(validateInput('123', 'number')).toBe(123);
      expect(validateInput('abc', 'number')).toBe(0);
    });

    it('deve validar emails', () => {
      expect(validateInput('test@example.com', 'email')).toBe('test@example.com');
      expect(validateInput('invalid-email', 'email')).toBe('');
    });

    it('deve validar URLs', () => {
      expect(validateInput('https://example.com', 'url')).toBe('https://example.com');
      expect(validateInput('not-a-url', 'url')).toBe('');
    });
  });
});

