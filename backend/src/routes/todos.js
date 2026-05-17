import { Router } from 'express'
import { getTodos, getTodo, createTodo, updateTodo, deleteTodo, getStats } from '../controllers/todo.controller.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get('/stats', getStats)
router.get('/', getTodos)
router.get('/:id', getTodo)
router.post('/', createTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router
