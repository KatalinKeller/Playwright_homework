import { APIRequestContext, expect } from '@playwright/test';
// Egy feladat alakja (TypeScript típus)
export interface Task {
 id: number;
 title: string;
 description: string;
 status: 'todo' | 'in_progress' | 'done';
 createdAt: string;
 updatedAt: string;
}
// Tesztadat-gyár: minden hívás egyedi címet ad, így a tesztek nem zavarják egymást
export function newTaskData(overrides: Partial<Task> = {}) {
 return {
 title: `Task ${Date.now()}-${Math.floor(Math.random() * 10_000)}`,
 description: 'Created by Playwright API test',
 status: 'todo' as const,
 ...overrides,
 };
}
// Előkészítő segédfüggvény: létrehoz egy feladatot, és visszaadja
export async function createTask(
 request: APIRequestContext,
 overrides: Partial<Task> = {},
): Promise<Task> {
 const response = await request.post('/tasks', { data: newTaskData(overrides) });
 expect(response.status(), 'precondition: task should be created').toBe(201);
 return response.json();
}
// Takarítás: törli a feladatot (ha már nincs meg, az sem hiba)
export async function deleteTask(request: APIRequestContext, id: number) {
 await request.delete(`/tasks/${id}`);
}
// Séma-ellenőrzés: minden mező megvan és jó típusú
export function expectTaskShape(body: unknown) {
 expect(body).toEqual({
 id: expect.any(Number),
 title: expect.any(String),
 description: expect.any(String),
 status: expect.stringMatching(/^(todo|in_progress|done)$/),
 createdAt: expect.any(String),
 updatedAt: expect.any(String),
 });
}