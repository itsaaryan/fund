import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import Project from "../ethereum/project";
import web3 from "../ethereum/web3";

class NewRequest extends Component {
  state = {
    errorMessage: "",
    loading: "",
    description: "",
    value: "",
    recipient: "",
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const project = await Project(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await project.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, "ether"),
          this.state.recipient
        )
        .send({
          from: accounts[0],
        });
      this.props.history.push(`/projects/${this.props.address}/requests`);
      this.setState({
        description: "",
        value: "",
        recipient: "",
        loading: false,
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  handleChange = (e) => {
    // console.log(e.target.id);
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              id="description"
              onChange={(e) => this.handleChange(e)}
              value={this.state.description}
            ></Input>
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Input
              label="ether"
              id="value"
              labelPosition="right"
              onChange={(e) => this.handleChange(e)}
              value={this.state.value}
            ></Input>
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              id="recipient"
              onChange={(e) => this.handleChange(e)}
              value={this.state.recipient}
            ></Input>
          </Form.Field>
          <Message error header="Oops!!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(NewRequest);
