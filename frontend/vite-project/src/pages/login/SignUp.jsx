import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { userExists } from "../../redux/reducers/auth.js";
import Typography from "@mui/material/Typography";
import { Avatar, Button, IconButton, Stack, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { VisuallyHiddenInput } from "../../components/styles/StylesComponents.jsx";
import { useFileHandler } from "6pp";
import { server } from "../../constants/config.js";

const SignUp = ({ toggleLogin }) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const profile = useFileHandler("single");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isResending, setIsReSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();

  // Step 1: Signup (backend automatically sends OTP)
  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing up...");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("userName", userName);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("email", email);
      formData.append("bio", bio);
      if (profile.file) formData.append("profile", profile.file);

      const { data } = await axios.post(
        `${server}/api/v1/auth/signup`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        setUserId(data.data.userId);
        setOtpSent(true);
        toast.success(
          data.message || "Signup successful! OTP sent to your email.",
          { id: toastId }
        );
      } else {
        toast.error(data.message || "Signup failed", { id: toastId });
      }
    } catch (error) {
      console.log("error-->", error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Sending OTP...");
    setIsReSending(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/auth/resendOTP`,
        { userId, email },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message || "OTP sent successfully", { id: toastId });
      } else {
        toast.error(data.message || "Could not re-send OTP", { id: toastId });
      }
    } catch (error) {
      console.error("error-->", error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsReSending(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("Please enter the OTP");

    const toastId = toast.loading("Verifying OTP...");
    setIsVerifying(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/auth/verifyOTP`,
        { userId, otp },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(userExists(data.user));
        toast.success("Account verified successfully!", { id: toastId });
        toggleLogin(); // redirect to login
      } else {
        toast.error(data.message || "Invalid OTP", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Verification failed", {
        id: toastId,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Typography variant="h5" marginBottom={"1rem"}>
        {otpSent ? "Verify OTP" : "Sign Up"}
      </Typography>

      <form
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={otpSent ? handleVerifyOtp : handleSignUp}
      >
        {!otpSent ? (
          <>
            {/* Avatar */}
            <Stack
              sx={{
                position: "relative",
                width: "8rem",
                margin: "auto",
              }}
            >
              <Avatar
                sx={{
                  width: "8rem",
                  height: "8rem",
                  objectFit: "contain",
                }}
                src={profile.preview}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                }}
                component="label"
              >
                <>
                  <CameraAltIcon />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={profile.changeHandler}
                  />
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

            {/* Inputs */}
            <Stack display={"flex"} width={"100%"} flexDirection={"row"}>
              <TextField
                label="Fullname"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                margin="normal"
                sx={{ paddingRight: "1rem" }}
              />
              <TextField
                label="Username"
                variant="outlined"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
              />
            </Stack>

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Bio"
              variant="outlined"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <Button
              variant="contained"
              sx={{ marginTop: "0.5rem" }}
              disabled={isLoading}
              fullWidth
              type="submit"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>

            <Typography textAlign={"center"} marginTop={"0.5rem"}>
              OR
            </Typography>

            <Button onClick={toggleLogin}>Login Instead</Button>
          </>
        ) : (
          <>
            {/* OTP Verification Screen */}
            <TextField
              label="Enter OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
            />

            <Button
              variant="contained"
              sx={{ marginTop: "0.5rem" }}
              disabled={isVerifying}
              fullWidth
              type="submit"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              onClick={() => setOtpSent(false)}
              sx={{ marginTop: "0.5rem" }}
            >
              Back to Sign Up
            </Button>
            <Button
              onClick={handleResendOTP}
              disabled={isResending}
              sx={{ marginTop: "0.5rem" }}
            >
              Re-Send OTP
            </Button>
          </>
        )}
      </form>
    </>
  );
};

export default SignUp;
