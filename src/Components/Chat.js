// src/Components/Chat.js
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Messages from "./Messages";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";
import { BiHash } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { Picker } from "emoji-mart";
import { RiImageAddLine } from "react-icons/ri";
import FileUpload from "./FileUpload";

import {
  db,
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc
} from "../Firebase/Firebase";


const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  chat: { position: "relative", height: "calc(100vh - 200px)", paddingLeft: "10px", paddingBottom: "5px", paddingTop: "5px" },
  footer: { paddingRight: "15px", paddingLeft: "15px", paddingTop: "10px" },
  message: { width: "100%", color: "white" },
  roomName: { border: "1px solid #0000004a", borderLeft: 0, borderRight: 0, padding: "15px", display: "flex", color: "#e5e5e5" },
  roomNameText: { marginBlockEnd: 0, marginBlockStart: 0, paddingLeft: "5px" },
  iconDesign: { fontSize: "1.5em", color: "#e5e5e5" },
  footerContent: { display: "flex", backgroundColor: "#303753", borderRadius: "5px", alignItems: "center" },
  inputFile: { display: "none" },
}));

function Chat() {
  const classes = useStyles();
  const params = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [file, setFileName] = useState(null);

  useEffect(() => {
    if (params.id) {
      const channelRef = doc(db, "channels", params.id);
      const unsubChannel = onSnapshot(channelRef, (snapshot) => {
        const data = snapshot.data();
        if (data) setChannelName(data.channelName);
      });

      const messagesRef = collection(db, "channels", params.id, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      const unsubMessages = onSnapshot(q, (snapshot) => {
        setAllMessages(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      });

      return () => {
        unsubChannel();
        unsubMessages();
      };
    }
  }, [params.id]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!userNewMsg || !params.id) return;

    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (!userData) return;

    const messagesRef = collection(db, "channels", params.id, "messages");
    const obj = {
      text: userNewMsg,
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
      postImg: null,
    };

    try {
      await addDoc(messagesRef, obj);
      setUserNewMsg("");
      setEmojiBtn(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addEmoji = (e) => setUserNewMsg(userNewMsg + e.native);
  const openModal = () => setModalState(!modalState);
  const handelFileUpload = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0]);
      openModal();
    }
    e.target.value = null;
  };

  return (
    <div className={classes.root}>
      {modalState && <FileUpload setState={openModal} file={file} />}
      <Grid item xs={12} className={classes.roomName}>
        <BiHash className={classes.iconDesign} />
        <h3 className={classes.roomNameText}>{channelName}</h3>
      </Grid>
      <Grid item xs={12} className={classes.chat}>
        <ScrollableFeed>
          {allMessages.map((message) => (
            <Messages key={message.id} values={message.data} msgId={message.id} />
          ))}
        </ScrollableFeed>
      </Grid>
      <div className={classes.footer}>
        <Grid item xs={12} className={classes.footerContent}>
          <input accept="image/*" className={classes.inputFile} id="icon-button-file" type="file" onChange={handelFileUpload} />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <RiImageAddLine style={{ color: "#b9bbbe" }} />
            </IconButton>
          </label>

          <IconButton color="primary" component="button" onClick={() => setEmojiBtn(!emojiBtn)}>
            <GrEmoji style={{ color: "#b9bbbe" }} />
          </IconButton>
          {emojiBtn && <Picker onSelect={addEmoji} theme="dark" />}

          <form autoComplete="off" style={{ width: "100%", display: "flex" }} onSubmit={sendMsg}>
            <TextField
              className={classes.message}
              required
              id="outlined-basic"
              label="Enter Message"
              variant="outlined"
              multiline
              rows={1}
              value={userNewMsg}
              onChange={(e) => setUserNewMsg(e.target.value)}
            />
            <IconButton type="submit">
              <FiSend style={{ color: "#b9bbbe" }} />
            </IconButton>
          </form>
        </Grid>
      </div>
    </div>
  );
}

export default Chat;
