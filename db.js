//Database helpers sourced from www.sohamkamani.com/

// import the `MongoClient` object from the library
const { MongoClient, ObjectId } = require('mongodb')

// define the connection string. If you're running your DB
// on your laptop, this would most likely be its address
const connectionUrl = 'mongodb://localhost:27017'

// Define the DB name. We will call ours `store`
const dbName = 'todolist'

// Create a singleton variable `db`
let db

// The init function returns a promise, which, once resolved,
// assigns the mongodb connection to the `db` variable
const init = () =>
    MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
        db = client.db(dbName);
    })

// Take the item as an argument and insert it into the "tasks" collection
const addTask = (task) => {
    const collection = db.collection('tasks');
    return collection.insertOne(task)
}

// get all items from the "tasks" collection
const getTasks = (filterString) => {
    const collection = db.collection('tasks');
    let queryDocument;
    if (!filterString) {
        queryDocument = {};
    } else {
        queryDocument = {description: {$regex: filterString}}
    }
    return collection.find(queryDocument).toArray()
}

// get item with 'id' from "tasks" collection
const getTaskByID = (id) => {
    const collection = db.collection('tasks');
    return collection.findOne({_id: ObjectId(id)})
}

// take the id and the replacement task, and update the name and description with the new fields
const updateTask = (id, task) => {
    const collection = db.collection('tasks');
    return collection.updateOne({ _id: ObjectId(id) },
        { $set: { "name": task.name, "description": task.description, } })
}

// delete the task with the given id
const deleteTask = (id) => {
    const collection = db.collection('tasks');
    return collection.deleteOne({_id: ObjectId(id)})
}

// export the required functions so that we can use them elsewhere
module.exports = { init, addTask, getTasks, getTaskByID, updateTask, deleteTask }