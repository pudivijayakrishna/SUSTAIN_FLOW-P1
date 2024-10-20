import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { useAuth } from "../context/auth";
import config from "../config.js";

const Profile = () => {
  const imageURL =
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("abc");
  const [email, setEmail] = useState("abc@gmail.com");
  const [type, setType] = useState("User");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [justVerify, setJustVerify] = useState(false);

  const [isValidPhone, setIsValidPhone] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole, LogOut } = useAuth();
  const [apiKey, setApiKey] = useState("");

  const validatePhoneNumber = (input) => {
    if (input) {
      const value = input.replace(/\D/g, "");
      const isValid = /^\d{10}$/.test(value);
      setIsValidPhone(isValid);
    } else {
      setIsValidPhone(false); // Set to false if input is undefined
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
      body1: {
        fontWeight: "600",
      },
    },
  });

  const UpdateProfile = async () => {
    setJustVerify(true);
    if (name === "" || address === "" || !isValidPhone || location === "") {
      return;
    }
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      await axios.post(
        (config.BACKEND_API || "http://localhost:8000") + "/update-profile",
        {
          name,
          username: userName,
          email,
          role: type,
          contact: phoneNumber,
          address,
          location,
        },
        { headers }
      );
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getProfile = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const result = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") + "/profile",
        { headers }
      );
      const { user } = result.data;
      setName(user.name);
      setEmail(user.email);
      setUserName(user.username);
      setType(user.role);
      setPhoneNumber(user.contact);
      setAddress(user.address);
      setLocation(user.location);
      validatePhoneNumber(user.contact);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (
      !(
        window.localStorage.getItem("token") &&
        window.localStorage.getItem("role")
      )
    ) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole("");
      navigate("/");
    }
  }, [navigate, setIsLoggedIn, setRole]);

  useEffect(() => {
    getProfile();
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, [getProfile]);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        };

        const response = await fetch(
          (config.BACKEND_API || "http://localhost:8000") + "/getTomTomApiKey",
          { headers }
        );
        const data = await response.json();
        setApiKey(data.apiKey.trim());
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey && window.tt) {
      const initializeTomTomSearchBox = () => {
        var options = {
          searchOptions: {
            key: apiKey,
            language: "en-GB",
            limit: 5,
            placeholder: "Search for Nearby Location",
          },
          autocompleteOptions: {
            key: apiKey,
            language: "en-GB",
          },
        };

        options.container = "#searchBoxContainer";

        var ttSearchBox = new window.tt.plugins.SearchBox(
          window.tt.services,
          options
        );

        ttSearchBox.on("tomtom.searchbox.resultselected", function (data) {
          const newLocation =
            `${data.data.result.position.lat},${data.data.result.position.lng}`;
          setLocation(newLocation);
        });

        var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
        const container = document.getElementById("searchBoxContainer");
        if (container) {
          container.appendChild(searchBoxHTML);
        }
      };

      initializeTomTomSearchBox();
    }
  }, [apiKey]);

  return (
    <div
      data-aos="fade-up"
      style={{ margin: "2em", fontFamily: "Quicksand", fontWeight: "600" }}
    >
        <ThemeProvider theme={theme}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
              <Card
                sx={{
                  maxWidth: "100%",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <CardMedia
                  component="img"
                  alt="profile"
                  height="100"
                  image={imageURL}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    YOU
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {email}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    +91 {phoneNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} style={{ marginLeft: "0.1em" }}>
                    <Grid item xs={10} style={{ marginTop: "1em" }}>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        Profile
                      </Typography>
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "1em" }}>
                      <TextField
                        id="standard-helperText-1"
                        label="First Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        fullWidth
                        autoComplete="off"
                        error={justVerify && name === ""}
                        helperText={
                          justVerify &&
                          (name === ""
                            ? "Please enter a valid name containing only letters."
                            : "")
                        }
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-4"
                        label="Username"
                        value={userName}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        id="outlined-read-only-input-5"
                        label="Email"
                        value={email}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-4"
                        label="Type"
                        value={type}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-1"
                        label="Address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        fullWidth
                        autoComplete="off"
                        error={justVerify && address === ""}
                        helperText={
                          justVerify &&
                          (address === "" ? "address cnnnot be empty." : "")
                        }
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="standard-helperText-8"
                        label="Phone No."
                        value={phoneNumber}
                        onChange={(e) => {
                          validatePhoneNumber(e.target.value);
                          setPhoneNumber(e.target.value);
                        }}
                        fullWidth
                        autoComplete="off"
                        error={!isValidPhone && justVerify}
                        helperText={
                          justVerify &&
                          (!isValidPhone
                            ? "Please enter a 10-digit number."
                            : "")
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      style={{ marginTop: "0.4em" }}
                      id="searchBoxContainer"
                    >

                      Location
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      style={{ marginTop: "0.4em" }}
                      id="searchBoxContainer"
                    ></Grid>

                    <Grid></Grid>

                    <Grid item xs={10} style={{ marginTop: "0.4em" }}>
                      <TextField
                        id="location"
                        label="Location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        error={justVerify && location === ""}
                        helperText={
                          justVerify &&
                          (location === "" ? "Please select your location" : "")
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <div style={{ textAlign: "center", marginTop: "1em" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={UpdateProfile}
                      style={{ marginTop: "1em", backgroundColor: "#2A386B" }}
                      sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
                    >
                      {!loading ? "UPDATE" : "Updating..."}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            style={{ marginTop: "5em" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
              style={{ textAlign: "center" }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={LogOut}
                style={{ marginTop: "1em" }}
                sx={{ fontFamily: "Quicksand", fontWeight: "bold" }}
              >

                Logout  
                <LogoutIcon />
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
  );

};export default Profile;