import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Select, MenuItem, Box } from "@mui/material";
import axios from "axios";
import config from "../config.js";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const defaultTheme = createTheme();

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidPassword(e.target.value.length >= 8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      username === "" ||
      email === "" ||
      name === "" ||
      !validPassword ||
      password !== repassword ||
      role === ""
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${config.BACKEND_API}/signup`, {
        username,
        email,
        name,
        password,
        role,
      });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setIsAlert(true);
      console.error("Error: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="my-glass-effect">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="sm">
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
            <Typography component="h1" variant="h5">
              Create A New Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth label="Password" type="password" value={password} onChange={handlePasswordChange} />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem value="compostAgency">Compost Agency</MenuItem>
                <MenuItem value="ngo">NGO</MenuItem>
                <MenuItem value="donor">Donor</MenuItem>
              </Select>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {!loading ? "Sign Up" : "Signing Up..."}
              </Button>
              {isAlert && (
                <Alert severity="error">
                  User Already Exists!
                </Alert>
              )}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
