import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import MyHome from "./components/MyHome";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <MyHome />
      </Fragment>
    );
  }
}

export default App;