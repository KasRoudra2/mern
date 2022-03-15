import React,{ useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
//import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from "moment";
import { LikeHandler, ServePost, DeletePost } from "../../api/API";
import Context from "../../contexts/Context";
import "./FullPost.css";

const FullPost = ({ut}) => {
  const { user } = useContext(Context);
    const GlobalData = useContext(Context);
    const [ post, setPost] = useState();
    const navigate = useNavigate();
    const id =  post ? post._id : null;
    useEffect(()=>{
        async function getPost() {
            const data = await ServePost(ut);
            setPost(data);
        }
        getPost()
     }, [ut])
    const likeHandler = () => {
      LikeHandler(id);
    }
    const deleteHandler = () => {
      DeletePost(id);
      navigate("/");

    }
    const edit = () => {
        setPost(post);
        GlobalData.setPost(post);
        navigate("/");
    }
    const Likes = () => {
      if (post.likes.length > 0) {
        return post.likes.find((like) => like === (user?.sub || user?.id))
          ? (
            <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
          ) : (
            <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
          );
      }
    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };
    if(post){
    return (
        <Card className="card">
        <CardMedia className="media" image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} 
                    title={post.title} />
        <Grid className="overlay">
        <Typography variant="h6">{post.author}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </Grid>
       <div className="overlay2">
        <Button style={{ color: 'white' }} size="small" onClick={edit}><MoreHorizIcon fontSize="default" /></Button>
      </div>
      <div className="details">
        <Typography className="tags" variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>
      <Typography className="title" gutterBottom variant="h5" component="h2">{post.title}</Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
      </CardContent>
        <Grid className="read-more" container>
        <Link className="read-more rlinks" to="/" >Go Back</Link>
        </Grid>
      <CardActions className="cardActions">
        <Button size="small" color="primary" onClick={likeHandler}>
        <Likes />
        </Button>
        <Button size="small" color="primary" onClick={deleteHandler}><DeleteIcon fontSize="small" /> Delete</Button>
      </CardActions>
    </Card>
    )
  }
  return null;  
}

export default FullPost;