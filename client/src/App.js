import React, { useState,useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Home from './pages/home/Home';
import Post from "./pages/post/Post";
import Auth from "./pages/auth/Auth";
import Redirect from "./pages/redirect/Redirect";
import { Provider } from "./contexts/Context";
import "./App.css";

function App() {
	const  token = localStorage.getItem("profile");
    const [ user, setUser ] = useState();
	const [ post, setPost ] = useState();
	useEffect(() => {
	if(token){
		setUser(jwtDecode(token));
		}
	}, [token]);
    const value = { post, setPost, user, setUser }
    return (
        <Provider value={value}>
			<BrowserRouter basename="/">
				<Routes>
					<Route path="/" element={<Home />} />
					{ user ? (<Route path="/auth" element={<Redirect />} />) : (<Route path="/auth" element={<Auth />}/>)}
					<Route path="/:user/:title" element={<Post />} />
					<Route path="/redirect" element={<Redirect />} />
				</Routes>
			</BrowserRouter>
        </Provider>
     );
}

export default App;
