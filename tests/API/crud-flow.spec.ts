import { test, expect } from '@playwright/test';

test('task lifecycle: create -> read -> update -> delete', async ({ request }) => {
 // CREATE
 const created = await request.post('/tasks', {
 data: { title: 'Lifecycle task', description: 'demo', status: 'todo' },
 });
 expect(created.status()).toBe(201);
 const task = await created.json();
 // READ
 const read = await request.get(`/tasks/${task.id}`);
 expect(read.status()).toBe(200);
 expect(await read.json()).toEqual(task);
 // UPDATE
 const updated = await request.put(`/tasks/${task.id}`, {
 data: { title: 'Lifecycle task (done)', description: 'demo', status: 'done' },
 });
 expect(updated.status()).toBe(200);
 expect((await updated.json()).status).toBe('done');
 // DELETE
 const deleted = await request.delete(`/tasks/${task.id}`);
 expect(deleted.status()).toBe(204);
 // VERIFY: no longer exists
 const after = await request.get(`/tasks/${task.id}`);
 expect(after.status()).toBe(404);
});