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
    currProject: "",
    chats: [],
    allChats: [],
    lastChatmsg: "",
  };

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts[0]) {
      const db = firebase.firestore();
      const snapshot = await db
        .collection("users")
        .doc(accounts[0])
        .collection("contributedProjects")
        .get();
      await snapshot.forEach(async (doc) => {
        const projectId = doc.data();
        console.log(projectId);
        const document = await db
          .collection("projects")
          .doc(projectId.address)
          .get();
        this.setState({
          allProjects: [...this.state.allProjects, document.data()],
        });
      });
    } else {
      alert("You must be signed in to metask first");
    }
  };

  handleRight = async (projectId) => {
    this.setState({ currProject: projectId });
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
                      <div
                        key={index}
                        style={{
                          padding: "0 10px",
                          cursor: "pointer",
                          marginTop: "20px",
                        }}
                        onClick={() => this.handleRight(project.projectId)}
                      >
                        <Image
                          src={
                            project.images.length >= 1
                              ? project.images[0]
                              : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"
                          }
                          avatar
                          style={{ width: "40px", height: "40px" }}
                        ></Image>
                        <span>
                          <b>{project.projectName}</b>
                          <br></br>
                          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                          &nbsp;
                          <small
                            style={{
                              textOverflow: "ellipsis",
                            }}
                          >
                            {project.projectId}
                          </small>
                        </span>
                        <hr></hr>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width="11" style={{ backgroundColor: "#f7f7f7" }}>
              {this.state.currProject ? (
                <DisPlayChats
                  projectId={this.state.currProject}
                  key={this.state.currProject}
                />
              ) : (
                <Nochats />
              )}
            </Grid.Column>
          </Grid>
        </div>
      </Layout>
    );
  }
}
