import React, { Component } from "react";
import { Grid, Image } from "semantic-ui-react";
import DisPlayChats from "../components/Chats";
import Layout from "../components/layout";
import Nochats from "../components/Nochats";
import firebase from "../config/firebase";
import web3 from "../ethereum/web3";

export default class messages extends Component {
  state = {
    allProjects: [],
    currProject: {},
    chats: [],
    allChats: [],
    lastChatmsg: "",
  };

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts[0]) {
      let allProjects = new Array();
      const db = firebase.firestore();
      const snapshot = await db
        .collection("projects")
        .orderBy("createdAt", "desc")
        .where("owner", "==", accounts[0])
        .get();
      await snapshot.forEach((doc) => {
        allProjects.push(doc.data());
      });
      this.setState({ allProjects });
    } else {
      alert("You must be signed in to metask first");
    }
  };

  handleRight = async (project) => {
    this.setState({ currProject: project });
  };

  render() {
    console.log(this.state.allProjects);
    return (
      <Layout>
        <div
          style={{
            background: "lightgray",
            height: "80vh",
            padding: "0px",
            overflow: "hidden",
            borderRadius: "5px",
            boxShadow: "0px 0px 0px 4px  lightgray",
          }}
        >
          <Grid style={{ width: "100%", height: "100%", margin: "0px" }}>
            <Grid.Column
              width="5"
              style={{
                backgroundColor: "white",
                borderRight: "2px solid gray",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <div>
                <h2 style={{ padding: "10px" }}>Projects</h2>
              </div>
              <hr
                style={{
                  width: "100%",
                  border: "none",
                  borderTop: "2px solid gray",
                }}
              ></hr>
              <div>
                <div style={{ overflow: "auto" }}>
                  {this.state.allProjects?.map((project, index) => {
                    return (
                      <>
                        <div
                          className="sidechat"
                          key={index}
                          onClick={() => this.handleRight(project)}
                        >
                          <Image
                            src={
                              project.images.length >= 1
                                ? project.images[0]
                                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"
                            }
                            avatar
                            style={{
                              width: "50px",
                              height: "50px",
                              marginTop: "5px",
                            }}
                          ></Image>
                          <span style={{ marginLeft: "8px" }}>
                            <b>{project.projectName}</b>
                          </span>
                        </div>
                        <hr
                          style={{
                            color: "lightgray",
                            height: "1px",
                            border: "none",
                            borderTop: "1px solid lightgray",
                          }}
                        ></hr>
                      </>
                    );
                  })}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width="11" style={{ backgroundColor: "#f7f7f7" }}>
              {this.state.currProject.projectId ? (
                <DisPlayChats
                  project={this.state.currProject}
                  key={this.state.currProject.projectId}
                />
              ) : (
                <Nochats isOwner={true} />
              )}
            </Grid.Column>
          </Grid>
        </div>
      </Layout>
    );
  }
}
