const express = require('express');
const sessions = require('express-session');
const Joi = require('joi')
const { init, addTask, getTasks, getTaskByID, updateTask, deleteTask } = require('./db.js');

const app = express();
const port = process.env.port || 3000;

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "secretsarecool5783457489758923765",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

const taskSchema = Joi.object().keys({
    name: Joi.string().length(32),
    description: Joi.string()
})

// Simulated unencrypted username/password DB
let users = [{username: Jerrr, password: myPassword}, {username: brokeJT, password: ILikeToast2000}];

app.get('/', (req, res) => {
    res.send("Todolist API");
})

app.post('/login', (req, res) => {
    let userInfo = users.find(user => user.username === req.body.username);
    if (!userInfo || userInfo.password !== req.body.password) {
        res.sendStatus(401);
    } else {
        let session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
    }
});

app.get('/tasks', (req, res) => {
    // Get tasks from DB, whose descriptions contain filterString if it's included as a parameter
    getTasks(req.query.filterString)
        .then((tasks) => {
            tasks = tasks.map((task) => ({
                id: task._id,
                name: task.name,
                description: task.description,
                user: task.user
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
                description: task.description,
                user: task.user
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
    if (!req.session.userid) {
        res.status(401).send("You need to be logged in!");
        return
    }
    task.user = req.session.userid;
    addTask(task)
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

app.put('/tasks/:id', (req, res) => {
    const task = req.body;

    const result = taskSchema.validate(task);
    if(result.error) {
        console.log(result.error);
        res.sendStatus(400);
        return
    }
    getTaskByID(req.params.id)
        .then((task) => {
            if (task.user === req.session.userid) {
                updateTask(req.params.id, req.body)
                    .then(() => res.sendStatus(200))
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    })
            } else {
                res.status(401).send("You need to be logged in!");
            }
        })
        .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
});

app.delete('/tasks/:id', (req, res) => {
    getTaskByID(req.params.id)
        .then((task) => {
            if (task.user === req.session.userid) {
                deleteTask(req.params.id)
                    .then(() => res.sendStatus(200))
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    })
            } else {
                res.status(401).send("You need to be logged in!");
            }
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
});

// Initialize DB connection and start the server
init().then(() => {
    app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
})