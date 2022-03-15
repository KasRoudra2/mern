import React, { useState, useEffect, useRef, useContext} from "react";
import jwtDecode from "jwt-decode";
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material';
import FileBase from "react-file-base64";
import { CreatePost, UpdatePost } from "../../api/API";
import Context from "../../contexts/Context";
import "./PostForm.css";

const PostForm = () => {
    const { user, setUser, post, setPost } = useContext(Context);
    const token = localStorage.getItem("profile")
    const initPost = {
        title: '',
        author: '',
        message: '',
        tags: [''],
        selectedFile: '',

    }
    const [postData, setPostData] = useState(initPost);
    const fileRef = useRef();
    const userId = user?.id || user?.sub;
    
    useEffect(()=>{
        const allowed = ['title', 'author', 'message', 'tags', 'selectedFile'];
        if(post) {
            const filtered = Object.keys(post)
                    .filter(key => allowed.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = post[key];
                        return obj;
                    }, {});
            setPostData(filtered);

        }
    }, [post])
    const handleChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value})
    }
    const handleCreate = (e) => {
        e.preventDefault();
        setUser(jwtDecode(token));
        CreatePost({...postData, author: user.name, creator: userId, createdAt: new Date().toISOString()});
        clear();
 
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        setUser(jwtDecode(token));
        UpdatePost(post._id,{...postData, author: user.name, creator: userId});
        clear();
        setPost(null);
    }
    const clear = () => {
        setPostData(initPost);
        fileRef.current.value = ""
        setPost(null);
    }
    if(!user) return null;
    return(
        <Container xs={8} md={6} sm={4} spacing={4}>
            <Typography variant="h4" align="center" gutterBottom >Form</Typography>
                <Paper className="paper" >
                    <Box component="form" autoComplete="off" noValidate className="form" onSubmit= {post ? handleUpdate : handleCreate }>
                        <Typography className="form-title" variant="h6" gutterBottom>{post ? `Editing "${post.title}"` : 'Creating a Memory'}</Typography>
                        <TextField className="inputs" name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={handleChange} />
                        <TextField className="inputs" name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={handleChange} />
                        <TextField className="inputs" name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                        <div className="fileInput"><FileBase ref={fileRef} type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}  /></div>
                        <Button className="buttonSubmit" variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
                    </Box>
                </Paper>
        </Container>
    )
};

export default PostForm;