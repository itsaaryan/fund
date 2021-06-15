import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { withRouter, Router } from "react-router-dom";

class Header extends Component {
  state = { activeItem: "home", account: "" };

  componentDidMount = async () => {
    const path = this.props.location.pathname;
    let activeItem = "none";
    if (path === "/") {
      activeItem = "home";
    } else if (path === "/projects") {
      activeItem = "My Projects";
    } else if (path === "/projects/new") {
      activeItem = "New Project";
    } else if (path === "/messages") {
      activeItem = "Messages";
    } else if (path === "/project-discussion") {
      activeItem = "Project Discussions";
    }
    this.setState({ activeItem });
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  };

  handleItemClick = async (e, { name }) => {
    this.setState({ activeItem: name });
    if (name === "home") await this.props.history.push("/");
    else if (name === "My Projects") await this.props.history.push("/projects");
    else if (name === "New Project")
      await this.props.history.push("/projects/new");
    else if (name === "Messages") await this.props.history.push("/messages");
    else if (name === "Project Discussions")
      await this.props.history.push("/project-discussion");
  };

  render() {
    const activeItem = this.state.activeItem;
    console.log(this.props);
    return (
      <Menu pointing secondary style={{ marginTop: "3%", marginBottom: "3%" }}>
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="My Projects"
          active={activeItem === "My Projects"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="New Project"
          active={activeItem === "New Project"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="Messages"
          active={activeItem === "Messages"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="Project Discussions"
          active={activeItem === "Project Discussions"}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position="right">
          <span style={{ marginTop: "10px" }}>
            <em>
              <small>{`Metamask Account - ${this.state.account}`}</small>
            </em>
          </span>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(Header);
