import axios from "axios";

const API = () => {
        const token = localStorage.getItem("profile")
        if (token){
            postAPI.interceptors.request.use((req)=>{
                req.headers.authorization = "Bearer "+token;
                return req;
            })
            userAPI.interceptors.request.use((req)=>{
                req.headers.authorization = "Bearer "+token;
                return req;
            })
        }
}    


const server = "https://kaspostserver.herokuapp.com/api";


const postAPI = axios.create({ baseURL: `${server}/posts`})
const userAPI = axios.create({ baseURL: `${server}/users`})


const ServePosts = async () => {
    try {
        const {data} = await postAPI.get("/");
        return data;
    } catch (error) {
        console.log(error);
    }
} 

const ServePost =  async (ut) => {
    try {
        const {data} = await postAPI.get("/"+ut);
        return data;
    } catch (error) {
        console.log(error);
    }
} 

const CreatePost = async (newPost) => { 
    API()
    try {
        const {data} = await postAPI.post("/", newPost);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const UpdatePost = async (id,updatedPost) => {
    API()
    try {
        const {data} = await postAPI.patch("/"+id, updatedPost);
        return data;
    } catch (error) {
        console.log(error);
    }
} 

const LikeHandler = async(id) => {
    API()
    try {
        const {data} = await postAPI.patch("/"+id+"/like");
        return data;
    } catch (error) {
        console.log(error);
    }
}


const DeletePost = async (id) => {
    API()
    try {
        const {data} = await postAPI.delete("/"+id);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const AuthSubmit = async(formData, isSignup) => {
    API()
    try {
        if(isSignup) {
             const {data} = await userAPI.post("/signup", formData);
             return data;
        }
        else {
             const {data} = await userAPI.post("/login", formData);
             return data;
        }
    } catch (error) {
        console.log(error);
    }
}


export {ServePosts,
    ServePost,
    CreatePost,
    UpdatePost,
    LikeHandler,
    DeletePost,
    AuthSubmit,
}    