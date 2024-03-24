import expess from "express"
import { findUser, getUser, loginUser, registerUser } from "../Controller/userController.js"
const router =  expess.Router()
router.post('/register', registerUser)
router.post('/login',loginUser)
router.get('/find/:id',findUser)
router.get('/',getUser)
export default router