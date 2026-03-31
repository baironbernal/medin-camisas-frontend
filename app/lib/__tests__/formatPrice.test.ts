import { describe, it, expect } from 'vitest';
import { formatCOP } from '../formatPrice';

describe('formatCOP', () => {
  it('formats a number correctly', () => {
    const result = formatCOP(50000);
    // Intl may use non-breaking space; normalize for assertion
    const normalized = result.replace(/\s/g, ' ');
    expect(normalized).toContain('50.000');
  });

  it('formats a string number correctly', () => {
    const result = formatCOP('75000');
    const normalized = result.replace(/\s/g, ' ');
    expect(normalized).toContain('75.000');
  });

  it('formats zero correctly', () => {
    const result = formatCOP(0);
    const normalized = result.replace(/\s/g, ' ');
    expect(normalized).toContain('0');
  });

  it('handles NaN input', () => {
    expect(formatCOP(NaN)).toBe('$ 0');
  });

  it('handles non-numeric string', () => {
    expect(formatCOP('not-a-number')).toBe('$ 0');
  });

  it('handles decimal values by truncating', () => {
    const result = formatCOP(12345.67);
    const normalized = result.replace(/\s/g, ' ');
    expect(normalized).toContain('12.346');
  });

  it('handles negative numbers', () => {
    const result = formatCOP(-5000);
    const normalized = result.replace(/\s/g, ' ');
    expect(normalized).toContain('5.000');
  });
});
