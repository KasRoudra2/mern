import React, {useEffect, useState, useContext} from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ServePosts } from "../../api/API";
import Post from "./post/Post";
import Loading from "../loading/Loading";
import Context from "../../contexts/Context";
import "./Posts.css";



const Posts = () => {
  const [ didMount, setDidMount ] = useState(false); 
  const [ posts, setPosts] = useState();
  const { user } =useContext(Context)
  useEffect(() => {
    const getPosts = async () => {
      const data = await ServePosts();
      setPosts(data);
    }
    getPosts();
  });
  
   useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, [])
  useEffect(() => {
      console.log()
  }, [user]);
  
   if(didMount && posts){
    return(
      <Grid container>
        <Container align="center">
          <Typography variant="h4" gutterBottom mb={5}>Posts</Typography>
          </Container>
          <Grid container alignItems="stretch" spacing={3}>
             {posts.map((post) => (
                <Grid key={post._id} item xs={24} sm={12} md={12}>
                  <Post data={post}/>
                </Grid>
             ))}
          </Grid>
      </Grid>
    )
  }
  return <Loading />;
}

export default Posts;