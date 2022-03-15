import React, { useEffect, useContext, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Context from "../../contexts/Context";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(Context); 
  
  const activeStyle = {
    fontWeight: 700,
  };
  const logout = useCallback(() => {
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/");
  }, [navigate, setUser])
  useEffect(() => {
    if (user) {
      if (user.exp * 1000 < new Date().getTime()) logout();
    }
  }, [user, location, logout]);
  return (
    <Box>
      <AppBar position="relative">
        <Toolbar>
          <NavLink
            className="navlink"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            to="/"
          >
            Home
          </NavLink>
           { !user && (<NavLink
            className="navlink"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            to="/auth"
          >
            Auth
          </NavLink>
           )}
          { user?.picture && (
            <Avatar sx={{display:"flex",marginLeft:"auto", right:"-10%", alignItems:"baseline"}} alt={user.name} src= {user.picture} />
          )}
          <Box display="flex" alignItems="baseline" sx={{ right: "10px", marginLeft: "auto" }}>
          { user ? <Box display="flex" alignItems="baseline" sx={{ right: "10px", marginLeft: "auto" }} >
          <Typography sx={{ marginRight: "16px", fontWeight: 800, color: "#abfeee" }} >
            {user?.name}
          </Typography>
          <Button onClick={logout} variant="contained" color="secondary" sx={{textTransform: "none",  fontSize:"16px"}}>Logout</Button></Box> :
          <Button onClick={()=>{navigate("/auth")}} variant="contained" color="secondary" sx={{textTransform: "none",  fontSize:"16px"}}>Sign In</Button>
          }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
