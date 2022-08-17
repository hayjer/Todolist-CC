# Todolist-CC
Convergence Concepts back-end excercise


## Endpoints
- POST /login
  - Submit user credentials to log in, which will allow for posting of todo-list tasks and editing/deleted your own 
    tasks
- GET /tasks/?queryString
  - Return a list of all tasks, with the optional filter queryString that will only return tasks with queryString in 
    their description
- GET /tasks/:id
  - Return the task with given ID
- POST /tasks
  - Add a new todo-list task
- PUT /tasks/:id
  - Update the task with given ID, if you are authorized
- DELETE /tasks/:id
  - Delete the task with ID, if you are authorized