// Gyakorló Task Management REST API (memóriában tárolja az adatokat)
// Indítás: node server.js -> http://localhost:3000
const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.API_TOKEN || 'secret-token';
const STATUSES = ['todo', 'in_progress', 'done'];
let tasks = {}; // { "1": { id: 1, title: ..., ... } }
let nextId = 1;
// --- Hitelesítés: minden kéréshez kell az "Authorization: Bearer <token>" fejléc ---
app.use((req, res, next) => {
 if (req.headers.authorization !== `Bearer ${API_TOKEN}`) {
 return res.status(401).json({ error: 'Unauthorized' });
 }
 next();
});
// --- Bemenet ellenőrzése (validáció) ---
function validate(body) {
 if (!body || typeof body !== 'object') return 'Body must be a JSON object';
 if (typeof body.title !== 'string' || body.title.trim() === '') return 'title is required';
 if (body.title.length > 100) return 'title must be at most 100 characters';
 if (body.description !== undefined && typeof body.description !== 'string')
 return 'description must be a string';
 if (body.status !== undefined && !STATUSES.includes(body.status))
 return `status must be one of: ${STATUSES.join(', ')}`;
 return null;
}
// POST /tasks - új feladat létrehozása
app.post('/tasks', (req, res) => {
 const error = validate(req.body);
 if (error) return res.status(400).json({ error });
 const now = new Date().toISOString();
 const task = {
 id: nextId++,
 title: req.body.title,
 description: req.body.description ?? '',
 status: req.body.status ?? 'todo',
 createdAt: now,
 updatedAt: now,
 };
 tasks[task.id] = task;
 res.status(201).location(`/tasks/${task.id}`).json(task);
});
// GET /tasks - az összes feladat (a feladat nem kéri, de hasznos a gyakorláshoz)
app.get('/tasks', (req, res) => {
 res.status(200).json(Object.values(tasks));
});
// GET /tasks/:id - egy feladat lekérése azonosító alapján
app.get('/tasks/:id', (req, res) => {
 const task = tasks[req.params.id];
 if (!task) return res.status(404).json({ error: 'Task not found' });
 res.status(200).json(task);
});
// PUT /tasks/:id - feladat teljes frissítése
app.put('/tasks/:id', (req, res) => {
 const task = tasks[req.params.id];
 if (!task) return res.status(404).json({ error: 'Task not found' });
 const error = validate(req.body);
 if (error) return res.status(400).json({ error });
 const updated = {
 ...task,
 title: req.body.title,
 description: req.body.description ?? '',
 status: req.body.status ?? 'todo',
 updatedAt: new Date().toISOString(),
 };
 tasks[task.id] = updated;
 res.status(200).json(updated);
});
// DELETE /tasks/:id - feladat törlése
app.delete('/tasks/:id', (req, res) => {
 if (!tasks[req.params.id]) return res.status(404).json({ error: 'Task not found' });
 delete tasks[req.params.id];
 res.status(204).send();
});
// Hibás JSON törzs esetén is 400-at adunk (nem 500-at)
app.use((err, req, res, next) => {
 if (err.type === 'entity.parse.failed') {
 return res.status(400).json({ error: 'Invalid JSON' });
 }
 res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
 console.log(`Task API listening on http://localhost:${PORT}`);
});