import messageModel from "../Models/messageModel.js";

export const createMessage = async (req,res) => {
    console.log(req.body);
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const responsive = await message.save();
    res.status(200).json(responsive);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
};
export const getMessage = async(req,res)=>{
    const {chatId} = req.params 
    try {
        const message = await messageModel.find({chatId})
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error)
    }
}
