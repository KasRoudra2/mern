import React from 'react';
import Header from "../../components/header/Header.js";
import PostForm from "../../components/postForm/PostForm";
import Posts from "../../components/posts/Posts";
import "./Home.css";

const Home = () => {
    return (
    <div>
    <Header />
        <div className='home-div'>
            <Posts />
            <PostForm />
        </div>
        </div>
    )
}

export default Home;