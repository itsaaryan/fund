import "./App.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./pages/Home";
import MyProjects from "./pages/MyProjects";
import NewProject from "./pages/NewProject";
import CurrentProject from "./pages/CurrentProject";
import CurrentProjectRequests from "./pages/CurrentProjectRequests";
import Messages from "./pages/Messages";
import ProjectDiscussion from "./pages/Project-discussion";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/projects" exact component={MyProjects} />
          <Route path="/projects/new" exact component={NewProject} />
          <Route path="/projects/:address" exact component={CurrentProject} />
          <Route
            path="/projects/:address/requests"
            exact
            component={CurrentProjectRequests}
          />
          <Route path="/messages" exact component={Messages} />
          <Route
            path="/project-discussion"
            exact
            component={ProjectDiscussion}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
