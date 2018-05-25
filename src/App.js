import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import './App.css';

import { S3Image } from 'aws-amplify-react';

class Image extends Component {
  state = { src: null };

  componentDidMount() {
    Storage.get(this.props.s3key).then((src) => {
      this.setState({ src });
    })
  }

  removeImage = () => {
    const key = this.props.s3key;
    Storage.remove(this.props.s3key).then((() => this.props.onRemove(key)));
  };

  render() {
    const { src } = this.state;
    if (src === null) return null;
    return (
      <article>
        <a href={src}>
          <img src={src} />
        </a>
        <button className="full-width" onClick={this.removeImage}>Remove</button>
      </article>
    )
  }
}

class App extends Component {
  state = {
    files: []
  };

  componentDidMount() {
    Storage.list('').then(files => {
      this.setState({ files });
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.files[0];
    const { name } = file;

    Storage.put(name, file).then((response) => {
      this.setState({ files: [...this.state.files, response] });
    }).catch(console.error);
  };

  handleRemove = (key) => {
    console.log('REMOVING', key);
    this.setState({ files: this.state.files.filter((file) => file.key !== key) });
  }

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
        <section className="App-images">
          { this.state.files.map(({key}) => <Image s3key={key} key={key} onRemove={this.handleRemove} />) }
        </section>
      </div>
    );
  }
}

export default App;
