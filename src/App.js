import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import './App.css';

class App extends Component {
  state = {
    files: []
  };

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.files[0];
    const { name } = file;

    console.log(file, name);
  };

  render() {
    return (
      <div className="App">
        <form className="NewItem" onSubmit={this.handleSubmit}>
          <input
            type="file"
            ref={input => this.fileInput = input}
          />
          <input className="full-width" type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
