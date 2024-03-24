import epress, { Router } from "express"
import { createChat, findChats, findUserChats } from "../Controller/chatController.js"

const router = epress.Router()

router.post('/',createChat)
router.get("/:id",findUserChats)
router.get("/find/:firstId/:secondId",findChats)
export default router