import React, { Component } from "react";
import { Button, Card, Form, Input, Message } from "semantic-ui-react";
import Project from "../ethereum/project";
import web3 from "../ethereum/web3";
import firebase from "../config/firebase";
import { withRouter } from "react-router-dom";

class ContributeForm extends Component {
  state = {
    loading: false,
    errorMessage: "",
    contribution: "",
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const address = this.props.address;
    this.setState({ loading: true, errorMessage: "" });
    const project = await Project(address);
    try {
      const accounts = await web3.eth.getAccounts();
      await project.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, "ether"),
      });
      const db = firebase.firestore();
      const snapshot = await db.collection("projects").doc(address).get();
      const getData = snapshot.data();
      await db
        .collection("projects")
        .doc(address)
        .update({
          balance:
            parseFloat(getData.balance) + parseFloat(this.state.contribution),
        });
      await db
        .collection("projects")
        .doc(address)
        .collection("contributors")
        .add({
          address: accounts[0],
          contribution: parseFloat(this.state.contribution),
        });
      await db
        .collection("users")
        .doc(accounts[0])
        .collection("contributedProjects")
        .add({
          address: address,
          contribution: this.state.contribution,
        });
      this.props.history.push(`/projects/${address}`);
      this.setState({ contribution: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Card style={{ width: "100%" }}>
        <Card.Content>
          <Card.Header>Contribute!</Card.Header>
          <Card.Meta>
            You must contribute{" "}
            <b>
              atleast{" "}
              {web3.utils.fromWei(this.props.minimumContribution, "ether")}
            </b>{" "}
            ethers to be a contributor.
          </Card.Meta>
          <Card.Description>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Amount to Contibute</label>
                <Input
                  value={this.state.contribution}
                  onChange={(e) =>
                    this.setState({ contribution: e.target.value })
                  }
                  label="ether"
                  labelPosition="right"
                ></Input>
              </Form.Field>
              <Message
                error
                header="Oops!!"
                content={this.state.errorMessage}
              />
              <Button primary type="submit" loading={this.state.loading}>
                Contribute!
              </Button>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(ContributeForm);
