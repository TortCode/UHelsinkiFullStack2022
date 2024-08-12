const express = require('express');
const redis = require('../redis')
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const added_todos = parseInt(await redis.getAsync('added_todos')) || 0;
  await redis.setAsync('added_todos', added_todos+1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const opts = {
    runValidators: true,
    new: true
  }
  const newTodo = await Todo.findByIdAndUpdate(req.todo._id, req.body, opts)
  if (!newTodo) {
    res.sendStatus(404)
    return
  }
  res.send(newTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
