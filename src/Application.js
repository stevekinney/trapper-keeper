import React, { Component } from "react";
import "./Application.css";

import { Storage } from "aws-amplify";

class Application extends Component {
  state = {
    files: []
  };

  componentDidMount() {
    Storage.list("").then(files => {
      console.log({ files });
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.files[0];
    const { name } = file;

    console.log(file, name);
  };

  render() {
    return (
      <div className="Application">
        <form className="NewItem" onSubmit={this.handleSubmit}>
          <input type="file" ref={input => (this.fileInput = input)} />
          <input className="full-width" type="submit" />
        </form>
        <section className="Application-images" />
      </div>
    );
  }
}

export default Application;
