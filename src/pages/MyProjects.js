import React, { Component } from "react";
import web3 from "../ethereum/web3";
import firebase from "../config/firebase";
import Layout from "../components/layout";
import { Card, Grid, Image, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class index extends Component {
  state = {
    allProjects: [],
  };
  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();

    let allProjects = new Array();
    if (accounts.length >= 1) {
      const db = await firebase.firestore();

      const snapshot = await db
        .collection("projects")
        .orderBy("createdAt", "desc")
        .where("owner", "==", accounts[0])
        .get();
      await snapshot.forEach((doc) => {
        allProjects.push(doc.data());
      });
    }
    this.setState({ allProjects });
  };

  renderTableBody = () => {
    const newarr = [...this.state.allProjects];
    newarr.sort((a, b) => {
      return -(a.balance - b.balance);
    });

    return (
      <Table.Body>
        {newarr?.map((project, index) => (
          <Table.Row style={{ cursor: "pointer" }}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>
              <Link to={`/projects/${project.projectId}`}>
                {project.projectName}
              </Link>
            </Table.Cell>
            <Table.Cell>{project.balance.toFixed(7)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    );
  };

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.state?.allProjects?.map((project, index) => {
                return (
                  <Link to={`/projects/${project?.projectId}`}>
                    <Card
                      key={index}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        marginBottom: "20px",
                      }}
                    >
                      <Image.Group>
                        {project?.images?.map((img) => (
                          <Image
                            src={img}
                            style={{
                              width: "100px",
                              height: "100px",
                              margin: "5px",
                            }}
                          />
                        ))}
                      </Image.Group>

                      <Card.Content>
                        <Card.Header>{project?.projectName}</Card.Header>
                        <Card.Meta>
                          <b>Contract Id- </b> {project?.projectId}
                        </Card.Meta>
                        <Card.Meta>
                          <span className="date">
                            <b>Released On - </b>{" "}
                            {new Date(
                              project.createdAt?.toDate()
                            ).toUTCString()}
                          </span>
                        </Card.Meta>
                        <Card.Meta>
                          <b>Owner - </b> <span>{project?.owner}</span>
                        </Card.Meta>
                        <Card.Description>
                          {project.projectDescription}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </Link>
                );
              })}
            </Grid.Column>
            <Grid.Column width={6}>
              {this.state.allProjects.length > 0 && (
                <Card
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    overflow: "auto",
                  }}
                >
                  <Card.Content>
                    <Card.Header>My Most Earning Projects</Card.Header>
                    <Card.Description>
                      <Table>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Rank</Table.HeaderCell>
                            <Table.HeaderCell>Project Name</Table.HeaderCell>
                            <Table.HeaderCell>Funding (ether)</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        {this.renderTableBody()}
                      </Table>
                    </Card.Description>
                  </Card.Content>
                </Card>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.allProjects.length == 0 && (
          <h1>No projects created yet....!</h1>
        )}
      </Layout>
    );
  }
}
