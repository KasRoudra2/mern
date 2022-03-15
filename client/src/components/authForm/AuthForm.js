import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import GoogleLogin from "react-google-login";
import GoogleIcon from '@mui/icons-material/Google';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AuthSubmit } from "../../api/API";
import Loading from "../loading/Loading";
import FileBase from "react-file-base64";
import Context from "../../contexts/Context";
import "./AuthForm.css";

const AuthForm = () => {
    const [ didMount, setDidMount ] = useState(false); 
    const [ formData, setFormData ] = useState();
    const [ showPassword, setShowPassword ] = useState(false);
    const [ disable, setDisable] = useState(false);
    const [ confirm, setConfirm ] = useState(false);
    const [ password, setPassword ] = useState();
    const [ confirmPassword, setConfirmPassword ] = useState();
    const [ message, setMessage ] = useState();
    const { setUser } = useContext(Context);
    const navigate = useNavigate();
    const formRef = useRef();
    const [ isSignup, setIsSignup ] = useState(false);
    const success = () => {
        setTimeout(() => {
          navigate("/");
        }, 1000)
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (e.target.name==="password") setPassword(e.target.value);
    }
    const handleConfirm = (e) => {
        setConfirmPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await AuthSubmit(formData, isSignup);
        if (response) {
           setMessage(response.message);
           const token = response.token;
           if(token){
               localStorage.setItem("profile", token);
               setUser(jwtDecode(token));
           }
        }
    }
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleSwich = () => {
      setIsSignup(!isSignup);
      formRef.current.reset();
    };
    const onSuccess = async (res) => {
         const token = res?.tokenId;
         if (token) {
            localStorage.setItem("profile", token);
            setMessage("Login successful!");
            setUser(jwtDecode(token));
         }
    }
    const onFailure = (error) => {
        console.log(error);
        setMessage(error.error);
    }
    useEffect(() => {
        if (isSignup && password && confirmPassword){
          if (password!==confirmPassword) {
              setConfirm(false);
          } else {
              setConfirm(true);
          }
        }
        else {
            setConfirm(true)
        }
    }, [isSignup, password, confirmPassword])
    useEffect(()=>{
        if(formData){
            const isEmpty = Object.values(formData).some(x => x === '')
            if(isEmpty){
                setDisable(true)
            }
            else {
                setDisable(false)
            }
        }
        else {
            setDisable(false)
        }
    }, [formData])
    useEffect(()=>{
      setTimeout(() => setMessage(null), 3000);
    }, [message])
    useEffect(() => {
      setDidMount(true);
      return () => setDidMount(false);
    }, [])
    if(!didMount) return <Loading />;
    return(
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            { isSignup ? "Sign up" : "Sign In" }
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} ref={formRef}>
            <Grid container spacing={2}>
              { isSignup && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  autoComplete="new-password"
                  InputProps={{endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleShowPassword}>
                         {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>)}}
                  onChange={handleChange}
                />
              </Grid>
              { isSignup && ( 
                <>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'} 
                  id="confirmPassword"
                  autoComplete="new-password"
                  InputProps={{endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleShowPassword}>
                         {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>)}}
                  onChange={handleConfirm}
                />
                </Grid>
                  <div className="fileInput"><FileBase type="file" multiple={false} onDone={({ base64 }) => setFormData({ ...formData, selectedFile: base64 })}  /></div>
              </>
              )}
              {!confirm && (<Grid item xs={12}>
                  <Alert severity="warning">Passwords do not match!</Alert>
              </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={ (!message && confirm && !disable) ? false : true }
            >
              { isSignup ? "Sign up" : "Sign In" }
            </Button>
            <Grid item xs={12}>
            <GoogleLogin 
            clientId="288765187686-7me72sdja2ppll9rhj8fl4faevaigbsp.apps.googleusercontent.com"
            render={((renderProps)=>(
              <Button onClick={renderProps.onClick} disabled={renderProps.disabled} variant="contained" fullWidth><GoogleIcon />&nbsp;Google Sign In</Button>
            ))}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
            />
            </Grid>
            {message && (
            <Grid item xs={12}>
              {(message === "Signup successful!" || message === "Login successful!") ? (
                <Alert severity="success">{message} {success()} </Alert>
              ) : (
                <Alert severity="error">{message}</Alert>
              )}
            </Grid>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={handleSwich} sx={{textTransform: "none",  fontSize:"16px"}}>
                  { isSignup ? 
                  "Already have an account? Sign in":
                  "Don't have an account? Sign Up"
                  }
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    )
};

export default AuthForm;