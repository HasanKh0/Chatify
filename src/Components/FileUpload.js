// src/Components/FileUpload.js
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import {
  db,
  collection,
  doc,
  addDoc,
  Timestamp,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../Firebase/Firebase";

const useStyles = makeStyles(() => ({
  displayImage: { height: "105px", width: "180px" },
  imageName: { paddingLeft: "15px", fontSize: "1.3em" },
  imageDiv: { marginLeft: "16px", marginRight: "16px", marginTop: "-33px" },
}));

function FileUpload({ setState, file }) {
  const params = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressBar, setProgressBar] = useState({ display: "none" });
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
    setState();
  };

  const sendMsg = async (downloadURL) => {
    if (!params.id) return;
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (!userData) return;

    const messagesRef = collection(db, "channels", params.id, "messages");
    const obj = {
      text: message,
      timestamp: Timestamp.now(),
      userImg: userData.photoURL,
      userName: userData.displayName,
      uid: userData.uid,
      likeCount: 0,
      likes: {},
      fireCount: 0,
      fire: {},
      heartCount: 0,
      heart: {},
      postImg: downloadURL,
    };

    try {
      await addDoc(messagesRef, obj);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const fileObj = URL.createObjectURL(file);

  const handleUpload = (e) => {
    e.preventDefault();
    setProgressBar({ display: "block" });
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          sendMsg(url);
          handleClose();
        });
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className={classes.imageDiv}>
        <img src={fileObj} alt={file.name} className={classes.displayImage} />
        <Typography className={classes.imageName}>{file.name}</Typography>
      </div>

      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleUpload}>
          <TextField
            id="outlined-basic"
            label="Add A Message"
            fullWidth
            margin="normal"
            variant="outlined"
            style={{ backgroundColor: "rgb(45, 45, 73)", borderRadius: "5px" }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>

        <div style={progressBar}>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2">{Math.round(progress)}%</Typography>
            </Box>
          </Box>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} style={{ color: "white" }}>Cancel</Button>
        <Button onClick={handleUpload} color="primary" autoFocus variant="contained">Upload</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FileUpload;
