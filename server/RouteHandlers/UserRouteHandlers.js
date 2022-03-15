import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

const secret = process.env.secret || "any";

const ServeUsers = async (req, res) =>{
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
    
};

const ServeUser = async (req, res) =>{
    const email = req.params.email;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(203).json({ messsage: "404 Not Found" });
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
    }
};

const SignUp = async(req, res) => {
    const { firstName, lastName, selectedFile, email, password } = req.body;
    const name = firstName+" "+lastName;
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(203).json({ message: "User already exists!" });
    try {
        const newUser = await UserModel.create({ firstName: firstName, lastName: lastName, picture: selectedFile, name: name, email: email, password: hashedPassword });
        const user = JSON.parse(JSON.stringify(newUser));
        const token = jwt.sign({name: name, email: email, picture: selectedFile, user: user._id }, secret, { expiresIn: "1h" } )
        const final = {token: token , message: "Signup successful!" };
        res.status(200).json(final);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }

}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) return res.status(203).json({ message: "User do not exists!" });
        const user = JSON.parse(JSON.stringify(existingUser));
        const isCorrect = await bcrypt.compare(password, user.password)
        if (isCorrect) {
            const token = jwt.sign({ name: user.name, email: email, picture: user.picture, id: user._id }, secret, { expiresIn: "1h" } )
            const final = { token: token , message: "Login successful!" };
            res.status(200).json(final);
        }
        else {
            res.status(203).json({ message: "Invalid credentials!" });
        }
    
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}


const DeleteUser = async (req, res) =>{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ messsage: "404 Not Found" });
    try {
        await UserModel.findByIdAndRemove(id);
        res.status(200).json({ messsage: "User deleted"});
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
        console.log(error);
    }
};



export { 
    ServeUsers,
    ServeUser,
    SignUp,
    Login,
    DeleteUser,
}
