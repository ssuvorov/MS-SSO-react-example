import React from "react";
import AuthProvider from "./AuthProvider";

import "./App.css";

const Json = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>;

function App(props) {
    return (
        <div>
            <section>
                <h1>
                    Welcome to the Microsoft Authentication Library For
                    Javascript - React Quickstart
                </h1>
                {props.account && (
                    <button onClick={props.onSignOut}>Sign Out</button>
                )}
                {props.error && <p className="error">Error: {props.error}</p>}
            </section>
            <section className="data">
                {props.account && (
                    <div className="data-account">
                        <h2>Session Account Data</h2>
                        <Json data={props.account} />
                    </div>
                )}
            </section>
        </div>
    );
}

export default AuthProvider(App);
