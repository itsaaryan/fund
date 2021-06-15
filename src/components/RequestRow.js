import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Project from "../ethereum/project";
import { withRouter } from "react-router-dom";
import firebase from "../config/firebase";

class RequestRow extends Component {
  state = {
    errorMessage: "",
    loadingapprove: false,
    loadingfinalize: false,
  };

  onApprove = async (e) => {
    e.preventDefault();
    this.setState({ loadingapprove: true, errorMessage: "" });
    const project = await Project(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await project.methods.approveRequest(this.props.id - 1).send({
        from: accounts[0],
      });
      this.props.history.replace(`/projects/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      alert(err.message);
    }
    this.setState({ loadingapprove: false });
  };

  onFinalize = async (e) => {
    e.preventDefault();
    this.setState({ loadingfinalize: true, errorMessage: "" });
    const project = await Project(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await project.methods.finalizeRequest(this.props.id - 1).send({
        from: accounts[0],
      });
      const db = firebase.firestore();
      const snapshot = await db
        .collection("projects")
        .doc(this.props.address)
        .get();
      const getData = snapshot.data();
      await db
        .collection("projects")
        .doc(this.props.address)
        .update({
          balance:
            parseFloat(getData.balance) -
            parseFloat(web3.utils.fromWei(this.props.requests.value, "ether")),
        });
      this.props.history.replace(`/projects/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      alert(err.message);
    }
    this.setState({ loadingfinalize: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, requests, address, contributorCount } = this.props;
    const readyToFinalize = requests.approvalCount > contributorCount / 2;
    return (
      <Row
        disabled={requests.complete}
        positive={readyToFinalize && !requests.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{requests.description}</Cell>
        <Cell>{web3.utils.fromWei(requests.value, "ether")}</Cell>
        <Cell>{requests.recipient}</Cell>
        <Cell>
          {requests.approvalCount}/{contributorCount}
        </Cell>

        <Cell>
          {!requests.complete && (
            <Button
              loading={this.state.loadingapprove}
              basic
              color="green"
              onClick={(e) => this.onApprove(e)}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {!requests.complete && (
            <Button
              loading={this.state.loadingfinalize}
              basic
              color="teal"
              onClick={(e) => this.onFinalize(e)}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default withRouter(RequestRow);
