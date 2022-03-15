import React from 'react';
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header.js";
import FullPost from "../../components/fullPost/FullPost";
import "./Post.css";

const Post = () => {
    const { user, title } = useParams();
    const ut = user+title;
    return(
        <div>
        	<Header />
            <FullPost ut={ut} />
        </div>
    )
}

export default Post;