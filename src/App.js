import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";

import AuthProvider from "./AuthProvider";
import { getAccount } from './auth-utils';
import "./App.css";

import PublicPage from "./containers/Public";
const ProtectedPage = React.lazy(() => import("./containers/Protected.js"));

const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (!getAccount()) {
          return null;
        } else {
          return children;
        }
      }}
    />
  );
};

const Json = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>;

function App(props) {
  return (
    <Router>
      <section>
        <nav>
          <div style={{ float: "right" }}>
            {props.account && (
              <button onClick={props.onSignOut}>Sign Out</button>
            )}
          </div>
          <ul>
            <li>
              <Link to={"/"}>Root</Link>
            </li>
            <li>
              <Link to={"/public"}>Public</Link>
            </li>
            <li>
              <Link to={"/protected"}>Protected</Link>
            </li>
          </ul>
        </nav>
        {props.error && <p className="error">Error: {props.error}</p>}
      </section>
      <Switch>
        <Route exact path="/" render={() => "Root"} />
        <Route exact path="/public" component={PublicPage} />
        <ProtectedRoute exact path="/protected">
          <React.Suspense fallback="...">
            <ProtectedPage />
          </React.Suspense>
        </ProtectedRoute>
      </Switch>
      <section className="data">
        {props.account && (
          <div className="data-account">
            <h2>Session Account Data</h2>
            <Json data={props.account} />
          </div>
        )}
      </section>
    </Router>
  );
}

export default AuthProvider(App);
