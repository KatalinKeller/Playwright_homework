import { test, expect } from '@playwright/test';
import { createTask, deleteTask, expectTaskShape, Task } from './helpers/tasks';
test.describe('PUT /tasks/{id} - update a task', () => {
    let task: Task;
    test.beforeEach(async ({ request }) => {
        task = await createTask(request, { title: 'Task to update', status: 'todo' });
    });
    test.afterEach(async ({ request }) => {
        await deleteTask(request, task.id);
    });
    test('updates the task (200) and persists the change', async ({ request }) => {
        const changes = { title: 'Updated title', description: 'Updated', status: 'done' as const };
        const response = await request.put(`/tasks/${task.id}`, { data: changes });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expectTaskShape(body);
        expect(body).toMatchObject({ id: task.id, ...changes });
        expect(body.createdAt).toBe(task.createdAt); // nem változhat
        expect(body.updatedAt >= task.updatedAt).toBeTruthy(); // nem lehet régebbi
        // Perzisztencia: egy új GET is a módosított adatot adja
        const check = await request.get(`/tasks/${task.id}`);
        expect(await check.json()).toMatchObject(changes);
    });
    test('returns 404 for a non-existing id', async ({ request }) => {
        const response = await request.put('/tasks/999999', { data: { title: 'Nope' } });
        expect(response.status()).toBe(404);
    });
    test('returns 400 for an invalid payload and keeps the original data', async ({ request }) => {
        const response = await request.put(`/tasks/${task.id}`, { data: { title: '' } });
        expect(response.status()).toBe(400);
        // A hibás kérés nem ronthatta el a meglévő adatot
        const check = await request.get(`/tasks/${task.id}`);
        expect(await check.json()).toEqual(task);
    });
});