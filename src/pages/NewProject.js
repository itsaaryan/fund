import React, { Component } from "react";
import {
  Button,
  Form,
  Icon,
  Input,
  Message,
  Segment,
  TextArea,
  Header,
  Image,
} from "semantic-ui-react";
import Layout from "../components/layout";
import { withRouter } from "react-router-dom";
import web3 from "../ethereum/web3";
import factory from "../ethereum/factory";
import firebase from "../config/firebase";

class NewProject extends Component {
  state = {
    minimumContribution: "",
    projectName: "",
    projectDescription: "",
    CreationDate: "",
    errorMessage: "",
    loading: false,
    images: [],
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createProject(this.state.minimumContribution).send({
        from: accounts[0],
      });
      const allProjects = await factory.methods.getDeployedProjects().call();
      const ProjectContractId = allProjects[allProjects.length - 1];
      const db = await firebase.firestore();
      await db.collection("projects").doc(ProjectContractId).set({
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        owner: accounts[0],
        createdAt: new Date(),
        projectId: ProjectContractId,
        images: this.state.images,
        balance: 0,
      });
      await db
        .collection("chats")
        .doc(ProjectContractId)
        .collection("chatmessages")
        .add({
          message:
            "Congratulations!!! On createing a new project.This is a chat group created for all the contributors and owner,to discuss the progress.",
          timeStamp: new Date(),
          sender: "none",
        });
      this.props.history.push("/projects");
    } catch (err) {
      this.setState({
        errorMessage: err.message,
      });
    }
    this.setState({ loading: false });
  };

  addImage = (e) => {
    if (e.target.files[0]) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", "fund-it");
      data.append("cloud_name", "aaryancloud");

      fetch("https://api.cloudinary.com/v1_1/aaryancloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url);
          this.setState({ images: [...this.state.images, data.url] });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <Layout>
        <h1>New Project!</h1>
        <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
          <Form.Field>
            <Segment placeholder>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                {this.state.images?.map((img) => (
                  <Image src={img} width="100px" height="100px" wrapped />
                ))}
                <label htmlFor="img">
                  <input
                    type="file"
                    id="img"
                    name="img"
                    style={{ display: "none" }}
                    onChange={this.addImage}
                  ></input>
                  <Image
                    src="https://static.thenounproject.com/png/396915-200.png"
                    width="100px"
                    height="100px"
                    wrapped
                    style={{
                      cursor: "pointer",
                      border: "2px solid black",
                      borderRadius: "5px",
                    }}
                  />
                </label>
              </div>
            </Segment>
            <label for="projectName">Project Name</label>
            <Input
              id="projectName"
              label={{ icon: "asterisk" }}
              labelPosition="right corner"
              value={this.state.projectName}
              onChange={(e) => this.handleChange(e)}
            ></Input>
            <br /> <br />
            <label for="projectDescription">Project Description</label>
            <TextArea
              id="projectDescription"
              value={this.state.projectDescription}
              onChange={(e) => this.handleChange(e)}
            ></TextArea>
            <br /> <br />
            <label for="minimumContribution">Minimum Contribution</label>
            <Input
              id="minimumContribution"
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(e) => this.handleChange(e)}
            ></Input>
            <br /> <br />
          </Form.Field>
          <Message error header="Oops!!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default withRouter(NewProject);
