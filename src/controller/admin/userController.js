const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UsersModel = require("../../schema/userSchema");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await UsersModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UsersModel({
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
      res.status(201).json({ loginid: savedUser._id, username: savedUser.email,message:'Registered Successfully' });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
};
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        message: "Login successfull",
        token: token,
        loginid: user._id,
        user,
      });
    } catch (err) {
      res.status(500).json({ error: "Error logging in",error:err });
    }
  };
  exports.getAllusersList = async(req,res)=>{
    try{
  
      const getallusers =await UsersModel.find();
      res.status(201).json({ message: "user Information  added successfully", data: getallusers });
  
    }catch(err){
      res
        .status(500)
        .json({
          err: "Failed to get information",
          details: err.message,
        });
  
    }
  
  }