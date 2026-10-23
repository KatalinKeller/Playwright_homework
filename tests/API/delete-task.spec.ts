import { test, expect } from '@playwright/test';
import { createTask } from './helpers/tasks';
test.describe('DELETE /tasks/{id} - delete a task', () => {
    test('deletes the task (204) and it is gone afterwards', async ({ request }) => {
        const task = await createTask(request, { title: 'Task to delete' });
        const response = await request.delete(`/tasks/${task.id}`);
        expect(response.status()).toBe(204);
        expect(await response.text()).toBe(''); // 204: nincs törzs
        const check = await request.get(`/tasks/${task.id}`);
        expect(check.status()).toBe(404);
    });
    test('deleting the same task twice returns 404 the second time', async ({ request }) => {
        const task = await createTask(request);
        await request.delete(`/tasks/${task.id}`);
        const response = await request.delete(`/tasks/${task.id}`);
        expect(response.status()).toBe(404);
    });
    test('returns 404 for a non-existing id', async ({ request }) => {
        const response = await request.delete('/tasks/999999');
        expect(response.status()).toBe(404);
    });
    test('deleting one task does not affect another', async ({ request }) => {
        const toDelete = await createTask(request);
        const toKeep = await createTask(request);
        await request.delete(`/tasks/${toDelete.id}`);
        const check = await request.get(`/tasks/${toKeep.id}`);
        expect(check.status()).toBe(200);
        await request.delete(`/tasks/${toKeep.id}`); // takarítás
    });
});