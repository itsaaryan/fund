import "./App.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./pages/Home";
import MyProjects from "./pages/MyProjects";
import NewProject from "./pages/NewProject";
import CurrentProject from "./pages/CurrentProject";
import CurrentProjectRequests from "./pages/CurrentProjectRequests";
import Messages from "./pages/Messages";
import ProjectDiscussion from "./pages/Project-discussion";
import { useState, useEffect } from "react";
import MetaMaskGuide from "./pages/MetaMaskGuide";

function App() {
  const [isMetamaskPresent, setisMetamaskPresent] = useState(true);
  useEffect(async () => {
    if (
      typeof window.ethereum == "undefined" &&
      typeof window.web3 == "undefined"
    ) {
      setisMetamaskPresent(false);
    } else {
      setisMetamaskPresent(true);
    }
    return () => {
      //
    };
  }, [window.ethereum, window.web3]);
  return (
    <div className="App">
      {isMetamaskPresent ? (
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
      ) : (
        <MetaMaskGuide />
      )}
    </div>
  );
}

export default App;
