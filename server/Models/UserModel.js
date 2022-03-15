import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    picture: String,
    name: String, 
    email : String,
    password: String,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;