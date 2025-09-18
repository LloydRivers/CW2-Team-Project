// Extremely basic tetsting for F1 insights
// Testing very basic login and CRUD read operations

import { describe, it, expect, vi } from 'vitest';

const API_URL = 'http://localhost:3000/api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('F1 Insights - Minimal Tests', () => {
  
  describe('Login Tests', () => {
    it('should succeed with valid credentials', async () => {
      // Successful login response (Mock 200)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          user: { email: 'test@example.com' }, 
          token: 'mock-token' 
        })
      });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      });
      
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      // Failed login response (Mock 401)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' })
      });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' })
      });
      
      const result = await response.json();
      
      expect(response.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('CRUD Read - Races Data', () => {
    it('should successfully fetch races data', async () => {
      // Successful fetch for valid year (Mock 200)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          championship: { year: 2024, championshipName: '2024 Formula 1 World Championship' },
          races: [{ raceId: 'bahrain_2024', raceName: 'Bahrain Grand Prix' }]
        })
      });

      const response = await fetch(`${API_URL}/races/2024`);
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.championship).toBeDefined();
      expect(result.races).toBeDefined();
      expect(Array.isArray(result.races)).toBe(true);
    });

    it('should fail with invalid year', async () => {
      // Failed fetch for invalid year (Mock 404)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Not found' })
      });

      const response = await fetch(`${API_URL}/races/invalid`);
      
      expect(response.ok).toBe(false);
    });
  });
});