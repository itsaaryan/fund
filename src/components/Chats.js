import React, { Component } from "react";
import { Divider, Input, Loader } from "semantic-ui-react";
import firebase from "../config/firebase";
import web3 from "../ethereum/web3";

const senderDesign = {
  position: "relative",
  fontSize: "16px",
  padding: "10px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  width: "fit-content",
  marginBottom: "23px",
  maxWidth: "60%",
  boxShadow: "0 0 0 1px lightgray",
};

const receiverDesign = {
  position: "relative",
  fontSize: "16px",
  padding: "10px",
  backgroundColor: "rgba(0, 128, 128,.6)",
  borderRadius: "10px",
  width: "fit-content",
  marginBottom: "23px",
  marginLeft: "auto",
  color: "white",
  maxWidth: "60%",
  boxShadow: "0 0 0 1px lightgray",
};

export default class Chats extends Component {
  state = {
    chats: [],
    loading: false,
    message: "",
    accounts: [],
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    const db = firebase.firestore();
    await db
      .collection("chats")
      .doc(this.props.projectId)
      .collection("chatmessages")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) =>
        this.setState({ chats: snapshot.docs.map((doc) => doc.data()) })
      );
    this.setState({ loading: false, accounts });
  };

  sendMessage = async () => {
    if (this.state.accounts[0]) {
      const db = firebase.firestore();
      await db
        .collection("chats")
        .doc(this.props.projectId)
        .collection("chatmessages")
        .add({
          sender: this.state.accounts[0],
          message: this.state.message,
          timeStamp: new Date(),
        });
      this.setState({ message: "" });
    } else {
      alert("You need to signin to metamask account");
    }
  };

  render() {
    return this.state.loading ? (
      <Loader active />
    ) : (
      <div>
        <div>
          <h3>Chat Name</h3>
        </div>
        <hr></hr>
        <div
          style={{
            height: "450px",
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "auto",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "10px",
          }}
        >
          {this.state.chats?.map((chat, index) => {
            return (
              <p
                key={index}
                style={
                  this.state.accounts[0] !== chat.sender
                    ? senderDesign
                    : receiverDesign
                }
              >
                {chat.sender !== "none" && (
                  <>
                    <small>
                      <b
                        style={{
                          color: "lightgray",
                          fontSize: "10px",
                          float: "left",
                          marginBottom: "3px",
                        }}
                      >
                        {chat.sender}
                      </b>
                    </small>
                    <br></br>
                  </>
                )}
                <span style={{ float: "left" }}>{chat.message}</span>
                <br></br>
                <small
                  style={{
                    float: "right",
                    color: "lightgray",
                    fontSize: "10px",
                  }}
                >
                  {new Date(chat.timeStamp?.toDate()).toUTCString()}
                </small>
              </p>
            );
          })}
        </div>
        <div
          style={{
            height: "50px",
            position: "relative",
            bottom: "0",
            left: "0",
            right: "0",
          }}
        >
          <Input
            value={this.state.message}
            action={{
              color: "teal",
              labelPosition: "right",
              icon: "send",
              content: "Send",
              onClick: () => this.sendMessage(),
            }}
            onChange={(e) => this.setState({ message: e.target.value })}
            style={{ width: "100%" }}
            placeholder="Enter text..."
          />
        </div>
      </div>
    );
  }
}
