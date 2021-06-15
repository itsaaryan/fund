import React, { Component } from "react";
import { Card, Segment, Table } from "semantic-ui-react";
import Layout from "../components/layout";
import NewRequest from "../components/RequestForm";
import RequestRow from "../components/RequestRow";
import Project from "../ethereum/project";
import web3 from "../ethereum/web3";

export default class RequestPage extends Component {
  state = {
    address: "0x0",
    contributorCount: 0,
    requests: [],
    requestCount: 0,
    isOwner: false,
  };

  async componentDidMount() {
    const address = this.props.match.params.address;
    const project = await Project(address);
    const accounts = await web3.eth.getAccounts();
    const curruser = accounts[0];
    const requestCount = await project.methods.getRequestCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((ele, index) => project.methods.requests(index).call())
    );
    const owner = await project.methods.owner().call();
    const contributorCount = await project.methods.contributorCount().call();
    const isOwner = owner === curruser;
    this.setState({
      address: address,
      contributorCount,
      requests,
      requestCount,
      isOwner,
    });
  }

  renderRows() {
    return this.state?.requests?.map((req, index) => {
      return (
        <RequestRow
          requests={req}
          key={index}
          address={this.state.address}
          id={index + 1}
          contributorCount={this.state.contributorCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, Body, HeaderCell } = Table;
    return (
      <Layout>
        {this.state.isOwner && (
          <Card style={{ width: "100%" }}>
            <Card.Content>
              <Card.Header>Create a Request</Card.Header>
              <Card.Meta>
                Request can only be finalized when more than 50% of contributors
                approve it.
              </Card.Meta>
              <Card.Description>
                <NewRequest address={this.state.address} />
              </Card.Description>
            </Card.Content>
          </Card>
        )}
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>
          Found{" "}
          <b>{this.state.requestCount == "" ? 0 : this.state.requestCount}</b>{" "}
          requests.
        </div>
      </Layout>
    );
  }
}
