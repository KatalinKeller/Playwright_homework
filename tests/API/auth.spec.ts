import { test, expect } from '@playwright/test';
test.describe('Authentication', () => {
    test.describe('without a token', () => {
        // Felülírjuk a konfigurációban megadott fejléceket: nincs Authorization
        test.use({ extraHTTPHeaders: {} });
        test('POST /tasks returns 401', async ({ request }) => {
            const response = await request.post('/tasks', { data: { title: 'No token' } });
            expect(response.status()).toBe(401);
        });
        test('GET /tasks/{id} returns 401', async ({ request }) => {
            const response = await request.get('/tasks/1');
            expect(response.status()).toBe(401);
        });
    });
    test.describe('with a wrong token', () => {
        test.use({ extraHTTPHeaders: { Authorization: 'Bearer wrong-token' } });
        test('DELETE /tasks/{id} returns 401', async ({ request }) => {
            const response = await request.delete('/tasks/1');
            expect(response.status()).toBe(401);
            expect(await response.json()).toEqual({ error: 'Unauthorized' });
        });
    });
});