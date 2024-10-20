import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/auth";
import axios from "axios";
import config from "../config.js";

const defaultTheme = createTheme();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const { setIsLoggedIn, setRole } = useAuth();
  const [isAlert, setIsAlert] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);
    setValidPassword(input.length >= 8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailUsername === "" || password === "" || !validPassword) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.BACKEND_API}/create-session`,
        {
          emailUsername,
          password,
        }
      );
      const { token, role } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("role", JSON.stringify(role));
      setIsLoggedIn(true);
      setRole(role);
      navigate("/");
    } catch (error) {
      setIsAlert(true);
      console.error("Error: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="my-glass-effect">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "2em",
              padding: "3em",
            }}
          >
            <Avatar sx={{ m: 1 }} style={{ backgroundColor: "#25396F" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}>
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
              <TextField
                required
                fullWidth
                label="Username / Email Address"
                value={emailUsername}
                onChange={(e) => setEmailUsername(e.target.value)}
                autoComplete="off"
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordofLogin}
                autoComplete="off"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {!loading ? "Sign In" : "Signing In..."}
              </Button>
              {isAlert && (
                <Alert severity="error" style={{ fontFamily: "Quicksand", fontWeight: "600" }}>
                  Invalid Email and/or Password
                </Alert>
              )}
              <Typography sx={{ mt: 2 }}>
                <Link to="/register" style={{ textDecoration: "none", color: "#25396F" }}>
                  Register as a new user
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
