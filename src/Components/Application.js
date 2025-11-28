import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Grid } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import Rooms from "./Rooms";
import { GoSignOut } from "react-icons/go";
import { FaUserEdit } from "react-icons/fa";
import { auth, db, signOut as firebaseSignOut } from "../Firebase/Firebase"; // modular
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile";
import Fade from "@material-ui/core/Fade";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

const drawerWidth = 240;

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: { display: "flex" },
  avatarGrid: { paddingTop: 20, paddingLeft: 5, paddingBottom: 20, color: "#dcddde" },
  avatarIcon: { display: "flex", paddingLeft: 10, paddingRight: 10 },
  avatarName: { fontSize: "1em", paddingLeft: 12, paddingTop: 8 },
  avatarDisplayName: { alignSelf: "center", paddingLeft: 10, fontWeight: 600 },
  purple: { color: theme.palette.getContrastText(deepPurple[500]), backgroundColor: "#3f51b5" },
  drawer: { [theme.breakpoints.up("sm")]: { width: drawerWidth, flexShrink: 0 } },
  appBar: {
    [theme.breakpoints.up("sm")]: { width: `calc(100% - ${drawerWidth}px)`, marginLeft: drawerWidth },
    backgroundColor: "#22273b",
    color: "#dcddde",
    boxShadow: "0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05);",
  },
  menuButton: { marginRight: theme.spacing(2), [theme.breakpoints.up("sm")]: { display: "none" } },
  toolbar: theme.mixins.toolbar,
  drawerPaper: { width: drawerWidth, backgroundColor: "#171c2e", color: "white" },
  sideToolBar: {
    backgroundColor: "#171c2e",
    color: "#fff",
    lineHeight: 1.6,
    boxShadow: "0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05);",
    minHeight: 50,
  },
  sideToolBarText: { letterSpacing: "0.2em", fontWeight: 900 },
  title: { flexGrow: 1 },
}));

function Application(props) {
  const { window, uid } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = db.collection("users").doc(uid).onSnapshot((doc) => {
      if (doc.exists) {
        setUserDetails(doc.data());
        localStorage.setItem("userDetails", JSON.stringify(doc.data()));
      }
    });
    return () => unsubscribe();
  }, [uid]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleEditProfile = () => setEditProfileModal(!editProfileModal);
  const handleAlert = () => setAlert(!alert);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.clear();
      console.log("Signed out successfully");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const drawer = userDetails && (
    <div>
      <Toolbar className={classes.sideToolBar}>
        <Typography variant="h6" className={classes.sideToolBarText}>CHATIFY</Typography>
      </Toolbar>
      <Divider />
      <Grid className={classes.avatarGrid}>
        <div className={classes.avatarIcon}>
          <StyledBadge overlap="circle" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
            <Avatar alt={userDetails.name} src={userDetails.photoURL} className={classes.purple} />
          </StyledBadge>
          <Typography variant="h6" className={classes.avatarDisplayName}>{userDetails.displayName}</Typography>
        </div>
        <div>
          <Typography variant="h4" className={classes.avatarName}>{userDetails.name}</Typography>
          <Typography variant="h4" className={classes.avatarName}>{userDetails.email}</Typography>
        </div>
      </Grid>
      <Divider />
      <Rooms />
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Display Name Updated Successfully"
        key={Fade}
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />
      {editProfileModal && <EditProfile toggler={toggleEditProfile} alert={handleAlert} />}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ minHeight: 50 }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: "none", color: "#dcddde" }}>Home</Link>
          </Typography>
          <div>
            <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={toggleEditProfile}><FaUserEdit /> &nbsp; Edit Profile</MenuItem>
              <MenuItem onClick={signOut}><GoSignOut /> &nbsp; Sign Out of Chatify</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="chat rooms">
        <Hidden smUp implementation="css">
          <Drawer container={container} variant="temporary" anchor={theme.direction === "rtl" ? "right" : "left"} open={mobileOpen} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper }} ModalProps={{ keepMounted: true }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Application;
