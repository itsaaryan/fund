import React, { Component } from "react";
import {
  Card,
  Grid,
  Image,
  Segment,
  Header,
  Table,
  Button,
} from "semantic-ui-react";
import Layout from "../components/layout";
import Project from "../ethereum/project";
import web3 from "../ethereum/web3";
import firebase from "../config/firebase";
import ContributeForm from "../components/ContributeForm";
import { Link } from "react-router-dom";

export default class CurrentProject extends Component {
  state = {
    requests: [],
    address: "0x0",
    minimumContribution: "",
    balance: "",
    requestCount: 0,
    contributorCount: 0,
    owner: "",
    data: {},
  };

  componentDidMount = async () => {
    console.log(this.props);
    const address = this.props.match.params.address;
    const project = Project(address);
    const summary = await project.methods.getSummary().call();
    const db = await firebase.firestore();
    const snapshot = await db.collection("projects").doc(address).get();
    const data = snapshot.data();
    this.setState({
      address: address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      contributorCount: summary[3],
      owner: summary[4],
      data: data,
    });
    const requestCount = await project.methods.getRequestCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((ele, index) => project.methods.requests(index).call())
    );
    this.setState({ requests });
  };

  renderCards = () => {
    const {
      address,
      minimumContribution,
      balance,
      requestCount,
      contributorCount,
      owner,
    } = this.state;
    const items = [
      {
        header: "Contract",
        meta: address,
        description: "This is the contract Id.",
        style: { overflowWrap: "break-word", minWidth: "48%" },
      },
      {
        header: "Owner",
        meta: owner,
        description: "The Project is owned by this user.",
        style: { overflowWrap: "break-word", minWidth: "48%" },
      },
      {
        header: "Minimum Contribution",
        meta: `${minimumContribution} wei`,
        description:
          "You must contribute this much wei to become a contributor.",
        style: { minWidth: "48%" },
      },
      {
        header: "Request Count",
        meta: requestCount,
        description:
          "Pending requests,the request should be approved by the contributors",
        style: { minWidth: "48%" },
      },
      {
        header: "Contributors Count",
        meta: contributorCount,
        description: "Currently this many contributors have contributed.",
        style: { minWidth: "48%" },
      },
      {
        header: "Balance",
        meta: `${web3.utils.fromWei(balance, "ether")} ether`,
        description: "The campaign has this much money left to spend.",
        style: { minWidth: "48%" },
      },
    ];
    return <Card.Group items={items} />;
  };

  render() {
    const {
      address,
      minimumContribution,
      balance,
      requestCount,
      contributorCount,
      owner,
      data,
    } = this.state;
    console.log(this.props);
    return (
      <Layout>
        <Header as="h1">{data?.projectName}</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Segment placeholder>
                <Image.Group>
                  {data?.images?.map((img) => (
                    <Image
                      style={{ width: "200px", height: "200px" }}
                      src={img}
                    />
                  ))}
                </Image.Group>
              </Segment>
              <Card style={{ width: "100%" }}>
                <Card.Content>
                  <Card.Header>Project Description</Card.Header>
                  <Card.Description>
                    {data?.projectDescription}
                  </Card.Description>
                </Card.Content>
              </Card>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm
                address={address}
                minimumContribution={minimumContribution}
              />
              <Card style={{ width: "100%" }}>
                <Card.Content>
                  <Card.Header>Requests</Card.Header>
                  <Card.Description>
                    <Table>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>ID</Table.HeaderCell>
                          <Table.HeaderCell>Description</Table.HeaderCell>
                          <Table.HeaderCell>Amount (ether)</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {this.state?.requests?.map((request, index) => (
                          <Table.Row>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{request.description}</Table.Cell>
                            <Table.Cell>
                              {web3.utils.fromWei(request.value, "ether")}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                    <Link to={`/projects/${address}/requests`}>
                      <Button primary>View Requests</Button>
                    </Link>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}
