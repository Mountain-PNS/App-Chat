import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};
export const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json("User with then give email already exist");
    }
    if (!name || !email || !password) {
      return res.status(400).json("All fields are requied...");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Eamil must be a valid email...");
    }
    if (validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be a strong password...");
    }
    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = createToken(user.id);
    res.status(200).json({
      _id: user.id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const loginUser = async (req,res)=>{
   const {email, password} =  req.body
   try {
    let user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json('Ivalid email or password')
    }
    const isValidPassword = await bcrypt.compare(password,user.password)
    if(!isValidPassword){
        return res.status(400).json("Invalid email or password...")
    }
    const token = createToken(user.id)
    res.status(200).json({
        _id: user.id,
        name :  user.name,
        email,
        token
    })
   } catch (error) {
    console.log(error);
    res.status(500).json(error);
   }
}
export const findUser = async (req,res) =>{
    const userId = req.params.id

    try {
        const user = await userModel.findById(userId)
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
export const getUser = async (req,res) =>{
    try {
        const user = await userModel.find()
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}