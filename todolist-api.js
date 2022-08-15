const express = require('express');
const app = express();
const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/tasks', (req, res) => {
    res.send('All todo-list tasks');
});

app.get('/tasks/:id', (req, res) => {
    res.send(`Task with id ${req.params.id}`);
});

app.post('/tasks', (req, res) => {
    res.send(`Created a new task with id FAKEID`);
});

app.put('/tasks/:id', (req, res) => {
    res.send(`Updated task with id ${req.params.id}`);
});

app.delete('/tasks/:id', (req, res) => {
    res.send(`Deleted task with id ${req.params.id}`);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))