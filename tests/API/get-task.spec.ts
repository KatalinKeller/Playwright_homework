import { test, expect } from '@playwright/test';
import { createTask, deleteTask, expectTaskShape, Task } from './helpers/tasks';
test.describe('GET /tasks/{id} - retrieve a task by ID', () => {
    let task: Task;
    // Előkészítés: minden teszt saját feladatot kap
    test.beforeEach(async ({ request }) => {
        task = await createTask(request, { title: 'Task to read' });
    });
    test.afterEach(async ({ request }) => {
        await deleteTask(request, task.id);
    });
    test('returns the task (200)', async ({ request }) => {
        const response = await request.get(`/tasks/${task.id}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expectTaskShape(body);
        expect(body).toEqual(task);
    });
    test('returns 404 for a non-existing id', async ({ request }) => {
        const response = await request.get('/tasks/999999');
        expect(response.status()).toBe(404);
        expect(await response.json()).toEqual({ error: 'Task not found' });
    });
    test('returns 404 for an invalid id format', async ({ request }) => {
        const response = await request.get('/tasks/abc');
        expect(response.status()).toBe(404);
    });
});