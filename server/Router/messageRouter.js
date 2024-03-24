import epress, { Router } from "express"

import { createMessage, getMessage } from "../Controller/messageController.js"

const router = epress.Router()

router.post('/',createMessage)
router.get('/:chatId',getMessage)

export default router