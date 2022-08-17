const express = require('express');
const crypto = require("crypto");
const Joi = require('joi')
const { init, addTask, getTasks, getTaskByID, updateTask, deleteTask } = require('./db.js');

const app = express();
const port = process.env.port || 3000;

const taskSchema = Joi.object().keys({
    name: Joi.string().length(32),
    description: Joi.string()
})

app.get('/', (req, res) => {
    res.send("Todolist API");
})

app.get('/tasks', (req, res) => {
    // Get tasks from DB
    getTasks()
        .then((tasks) => {
            tasks = tasks.map((task) => ({
                id: task._id,
                name: task.name,
                description: task.description
            }));

            res.json(tasks);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get('/tasks/:id', (req, res) => {
    getTaskByID(req.params.id)
        .then((task) => {
            let mappedTask = {
                id: task._id,
                name: task.name,
                description: task.description
            }

            res.json(mappedTask);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post('/tasks', (req, res) => {
    const task = req.body;

    const result = taskSchema.validate(task);
    if(result.error) {
        console.log(result.error);
        res.sendStatus(400);
        return
    }

    addTask(task)
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.put('/tasks/:id', (req, res) => {
    updateTask(req.params.id, req.body)
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.delete('/tasks/:id', (req, res) => {
    deleteTask(req.params.id)
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

// Initialize DB connection and start the server
init().then(() => {
    app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
})