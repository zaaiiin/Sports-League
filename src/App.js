import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";
import Leaderboard from "./pages/Leaderboard";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={Schedule} />
            <Route path="/Schedule" component={Schedule} />
            <Route path="/Leaderboard" component={Leaderboard} />

            <Route path="*">
              <ErrorPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
