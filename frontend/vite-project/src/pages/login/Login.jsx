import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { userExists } from "../../redux/reducers/auth.js";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Button, Paper, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { server } from "../../constants/config.js";
import SignUp from "./SignUp.jsx";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleSubmit = async (e) => {
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
        `${server}/api/v1/auth/login`,
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
      console.log(error);
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Container
        component={"main"}
        maxWidth={"xs"}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            padding: 4,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: 4,
                  margin: "1rem",
                }}
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                />

                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                />

                <Button
                  type="submit"
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  variant="text"
                  fullWidth
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  SignUp Instead
                </Button>
              </form>
            </>
          ) : (
            <SignUp toggleLogin={toggleLogin} />
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
