import chatModel from "../Models/chatModel.js"

export const createChat = async(req,res)=>{
    const {firstId, secondId} = req.body
    try {
        const chat  = await chatModel.findOne({
            members : {$all: [firstId,secondId]}
        })
        if(chat){
            return res.status(200).json(chat)
        }
        const newChat = new chatModel({
            members : [firstId,secondId]
        })
        const response = await newChat.save()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const findUserChats = async(req,res)=>{
    const id = req.params.id
    try {
        const chats = await chatModel.find({
            members: {$in:[id]}
        })
        res.status(200).json(chats)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findChats = async(req,res)=>{
    const {firstId,secondId} = req.params
    try {
        const chats = await chatModel.find({
            members: {$in:[firstId,secondId]}
        })
        res.status(200).json(chats)
    } catch (error) {
        res.status(500).json(error)
    }
}