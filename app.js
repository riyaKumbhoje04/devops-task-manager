
const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Collect default Node.js metrics
client.collectDefaultMetrics();

// Create HTTP request counter
const httpRequestCounter = new client.Counter({
    name: 'task_manager_http_requests_total',
    help: 'Total HTTP requests received'
});

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Count incoming requests
app.use((req, res, next) => {
    httpRequestCounter.inc();
    next();
});

// In-memory tasks
let tasks = [
    { id: 1, text: 'Complete DevOps Assignment' },
    { id: 2, text: 'Build Docker Image' }
];

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// API: Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// API: Add a task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: 'Task content is required'
        });
    }

    const newTask = {
        id: Date.now(),
        text: text.trim()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// API: Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
