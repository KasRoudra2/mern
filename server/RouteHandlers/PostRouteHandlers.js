import mongoose from "mongoose";
import PostModel from "../Models/PostModel.js";

const ServePosts = async (req, res) =>{
    try {
        const posts = await PostModel.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
    
};

const ServePost = async (req, res) =>{
    const ut = req.params.ut;
    try {
        const post = await PostModel.findOne({ ut });
        if (!post) return res.status(203).json({ messsage: "404 Not Found" });
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
};

const CreatePost = async (req, res) =>{
    const body = req.body;
    const user = body.author.replace(" ", "-");
    const title = body.title.replace(" ", "-");
    const ut = user+title;
    const post = { ...body, ut: ut };
    try {
        const newPost = new PostModel(post);
        const existingut = await PostModel.findOne({ ut });
        if(existingut) return res.status(203).json({ message: "Title for this user is already used!" });
        await newPost.save();
        res.status(201).json({newpost: newPost, message: "Post created!"});
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }

};

const LikeHandler = async (req, res) =>{
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(203).json({ messsage: "404 Not Found" });
    try { 
    	const post = await PostModel.findById(id);
    	const index = post.likes.findIndex((id) => id ===String(req.userId));
        if (index === -1) {
            post.likes.push(req.userId);
            res.status(201).json({ message: "Liked!" })
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
            res.status(201).json({ message: "Disliked!" })
        }
    	const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
};


const UpdatePost = async (req, res) =>{
    const id = req.params.id;
    const body = req.body;
    const user = body.author.replace(" ", "-");
    const title = body.title.replace(" ", "-");
    const ut = user+title;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(203).json({ messsage: "404 Not Found" });
    try {
        const existingut = await PostModel.findOne({ ut });
        if(existingut) return res.status(203).json({ message: "Title for this user is already used!" });
        const updatedPost = {...body, _id: id, ut: ut};
	await PostModel.findByIdAndUpdate(id, updatedPost, { new: true });
        res.status(201).json({updatedPost: updatedPost, message: "Updated!"});
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
};

const DeletePost = async (req, res) =>{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(203).json({ messsage: "404 Not Found" });
    try {
        await PostModel.findByIdAndRemove(id);
        res.json({ messsage: "Post deleted"});
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
};




export { ServePosts, 
    ServePost, 
    CreatePost, 
    UpdatePost,  
    LikeHandler,
    DeletePost,
}; 