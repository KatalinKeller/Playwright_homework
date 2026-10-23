import { test, expect } from '@playwright/test';
import { newTaskData, deleteTask, expectTaskShape } from './helpers/tasks';
test.describe('POST /tasks - create a new task', () => {
    const createdIds: number[] = [];
    // Takarítás: minden létrehozott feladatot törlünk a teszt után
    test.afterEach(async ({ request }) => {
        for (const id of createdIds.splice(0)) await deleteTask(request, id);
    });
    test('creates a task with valid data (201)', async ({ request }) => {
        const data = newTaskData();
        const response = await request.post('/tasks', { data });
        expect(response.status()).toBe(201);
        expect(response.headers()['content-type']).toContain('application/json');
        const body = await response.json();
        createdIds.push(body.id);
        expectTaskShape(body);
        expect(body).toMatchObject(data);
        expect(response.headers()['location']).toBe(`/tasks/${body.id}`);
    });
    test('applies default values for optional fields', async ({ request }) => {
        const response = await request.post('/tasks', { data: { title: 'Only a title' } });
        expect(response.status()).toBe(201);
        const body = await response.json();
        createdIds.push(body.id);
        expect(body.status).toBe('todo');
        expect(body.description).toBe('');
    });
    test('the created task can be read back (persistence)', async ({ request }) => {
        const created = await (await request.post('/tasks', { data: newTaskData() })).json();
        createdIds.push(created.id);
        const response = await request.get(`/tasks/${created.id}`);
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual(created);
    });
    // Adatvezérelt negatív tesztek: ugyanaz a teszt, különböző hibás bemenetekkel
    const invalidPayloads = [
        { name: 'missing title', data: { description: 'no title' } },
        { name: 'empty title', data: { title: '' } },
        { name: 'whitespace-only title', data: { title: ' ' } },
        { name: 'title is not a string', data: { title: 123 } },
        { name: 'title longer than 100 chars', data: { title: 'x'.repeat(101) } },
        { name: 'invalid status value', data: { title: 'Bad status', status: 'finished' } },
    ];
    for (const { name, data } of invalidPayloads) {
        test(`rejects invalid payload: ${name} (400)`, async ({ request }) => {
            const response = await request.post('/tasks', { data });
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body.error).toEqual(expect.any(String));
        });
    }
    test('rejects malformed JSON (400)', async ({ request }) => {
        const response = await request.post('/tasks', {
            headers: { 'Content-Type': 'application/json' },
            data: '{"title": ',
        });
        expect(response.status()).toBe(400);
    });
    test('boundary: title with exactly 100 chars is accepted (201)', async ({ request }) => {
        const response = await request.post('/tasks', { data: { title: 'x'.repeat(100) } });
        expect(response.status()).toBe(201);
        createdIds.push((await response.json()).id);
    });
});