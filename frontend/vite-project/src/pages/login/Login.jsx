import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { userExists } from '../../redux/reducers/auth.js';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Avatar, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Paper, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { VisuallyHiddenInput } from '../../components/styles/StylesComponents.jsx';
import { useFileHandler} from '6pp'

const Login = ()=> {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  // const [gender, setGender] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  // const[profile, setProfile] = useState("")
  const profile = useFileHandler("single")
  // console.log("profile", profile)

  const toggleLogin = () =>  setIsLogin((prev) => !prev)

  const handleSubmit = async(e) =>{
        e.preventDefault();
        const toastId = toast.loading("Logging In...");
    
        setIsLoading(true);
        const config = {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        };
    
        try {
          const { data } = await axios.post(
            `http://localhost:5000/api/v1/auth/login`,
            {
              userName,
              password,
            },
            config
          );
          dispatch(userExists(data.user));
          toast.success(data.message, {
            id: toastId,
          });
        } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message || "Something Went Wrong", {
            id: toastId,
          });
        } finally {
          setIsLoading(false);
        }
  }

  const handleSignUp = async(e) =>{
    e.preventDefault();
    
    const toastId = toast.loading("Signing up...")
    setIsLoading(true)

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("fullName", fullName)
    formData.append("userName", userName)
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)
    formData.append("email", email)
    formData.append("profile", profile.file)
    console.log("form",formData)
    try {
      // const inputs = {
      //   fullName: fullName,
      //   userName: userName,
      //   password: password,
      //   confirmPassword: confirmPassword,
      //   email: email,
      //   bio: bio,
      //   profile: profile.file
      // }
      const {data} = await axios.post(`http://localhost:5000/api/v1/auth/signup`, formData, config)
      dispatch(userExists(data.user))
      toast.success(data.message, {
        id: toastId
      })
    } catch (error) {
      console.log("error-->",error)
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <Container component={"main"}
      maxWidth={"xs"}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Paper 
          elevation={4}
          sx={{
            display: 'flex',
            padding: 4,
            flexDirection: "column",
            alignItems: "center",
          }}>
          { isLogin ? (
            <>
              <Typography variant='h5'>Login</Typography>
              <form 
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: 4,
                  margin: "1rem"
                }}
                onSubmit={handleSubmit}>
                <TextField 
                  id="outlined-basic" 
                  label="Username" 
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  margin='normal'/>

                <TextField 
                  id="outlined-basic" 
                  label="Password" 
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin='normal'/>

                  <Button 
                    type='submit'
                    sx={{
                      marginTop: "1rem"
                    }}
                    variant='contained'
                    color='primary'
                    fullWidth>
                    Login
                  </Button>

                  <Typography textAlign={"center"} m={"1rem"}>OR</Typography>

                  <Button 
                    variant='text'
                    fullWidth
                    onClick={toggleLogin}
                    disabled={isLoading}>
                    SignUp Instead
                  </Button>
              </form>

            </>
          ) : (
            <>
            <Typography variant='h5'>Sign Up</Typography>
            <form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: 4,
              margin: "1rem"
            }}
             onSubmit={handleSignUp}>

              <Stack sx={{
                position: "relative",
                width: "10rem",
                margin: "auto"
              }}>
                <Avatar sx={{
                  width: "10rem",
                  height: "10rem",
                  objectFit: "contain"
                }}
                src={profile.preview}/>
                <IconButton sx={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  }}
                  component = "label">
                  <>
                  <CameraAltIcon/>
                  <VisuallyHiddenInput type='file' onChange={profile.changeHandler}/>
                  </>
                </IconButton>
              </Stack>

              {profile.error && (
                <Typography
                  m={"1rem auto"}
                  width={"fit-content"}
                  display={"block"}
                  color="error"
                  variant="caption"
                >
                  {profile.error}
                </Typography>
                )}

              <Stack 
              display={"flex"}
              width={"100%"}
              flexDirection={"row"}
              >
              <TextField 
                  id="outlined-basic" 
                  label="Fullname" 
                  variant="outlined"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  margin='normal'
                  sx={{
                    paddingRight: "1rem"
                  }}/>
              <TextField 
                  id="outlined-basic" 
                  label="Username" 
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  margin='normal'/>
              </Stack>
              
        
              <TextField 
                  id="outlined-basic" 
                  label="Password" 
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin='normal'/>
              <TextField 
                  id="outlined-basic" 
                  label="Confirm Password" 
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin='normal'/>
               <TextField 
                  id="outlined-basic" 
                  label="Bio" 
                  variant="outlined"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  margin='normal'/>
              <TextField 
                  id="outlined-basic" 
                  label="Email" 
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='normal'/>
                  
              {/* <FormControl sx={{
                margin: "0.5rem 0 0 1rem"
              }}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                defaultValue="female"
                name="radio-buttons-group"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl> */}

            <Button
              variant='contained'
              sx={{
                marginTop: "0.5rem"
              }}
              disabled={isLoading}
              fullWidth
              type='submit'>
              Sign Up
            </Button>
            
            <Typography textAlign={"center"} margin={"1rem 0 0.5rem 0"}>OR</Typography>

            <Button onClick={toggleLogin}>
              Login Instead
            </Button>
            </form>
            
            </>
          )}
        </Paper>
      </Container>
    </div>

  )
}

export default Login