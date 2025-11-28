import React from "react";
import Button from "@material-ui/core/Button";
import { FcGoogle } from "react-icons/fc";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import loginImg from "../Assets/login.png";
import Typography from "@material-ui/core/Typography";
import { auth, provider, signInWithPopup } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { boxShadow: "0 0 15px rgb(7 15 63 / 33%)", backgroundColor: "#171c30", color: "white" },
  paper: { marginTop: theme.spacing(10), display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "25px", paddingTop: "35px" },
  mainImg: { width: "100%", height: "auto" },
  submit: { margin: theme.spacing(3, 0, 2), color: "#d9d9d9" },
}));

function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // ✅ modular
      const user = result.user;
      console.log("Signed in:", user);
      localStorage.setItem("userDetails", JSON.stringify(user));
      history.push("/"); // redirect to home after login
    } catch (err) {
      console.error("Error signing in:", err.message);
      alert("Google Sign In failed. Make sure your Firebase auth and authorized domains are correct.");
    }
  };

  return (
    <Container component="div" maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <img src={loginImg} className={classes.mainImg} alt="signup img" />
        <Typography variant="h4" style={{ paddingTop: "15px" }}>
          Sign In To Chatify
        </Typography>
        <Button variant="outlined" className={classes.submit} startIcon={<FcGoogle />} onClick={login}>
          Sign In With Google
        </Button>
      </div>
    </Container>
  );
}

export default SignUp;
