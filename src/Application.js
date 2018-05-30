import React, { Component } from 'react';
import './Application.css';

import { Storage } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

class S3Image extends Component {
  state = { src: null };

  async componentDidMount() {
    const { s3key } = this.props;
    const src = await Storage.get(s3key, { level: 'private', expires: 10 });
    this.setState({ src });
  }

  handleRemove = () => {
    this.props.onRemove &&
    Storage.remove(this.props.s3key, { level: 'private' }).then(() => this.props.onRemove(this.props.s3key));
  };

  render() {
    const { src } = this.state;
    if (!src) return null;
    return (
      <article>
        <img src={src} />
        <button onClick={this.handleRemove}>Remove</button>
      </article>
    )
  }
}

class Application extends Component {
  state = {
    files: []
  };

  async componentDidMount() {
    const files = await Storage.list('', { level: 'private' });
    this.setState({ files });
  }

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.files[0];
    const { name } = file;

    Storage.put(name, file, { level: 'private' }).then(response => {
      console.log('Storage.put', { response });
      this.setState({ files: [...this.state.files, response ] })
    })
  };

  handleRemove = key => {
    console.log(key);
    const files = this.state.files.filter(file => file.key !== key);
    this.setState({ files });
  }

  render() {
    return (
      <div className="Application">
        <form className="NewItem" onSubmit={this.handleSubmit}>
          <input
            type="file"
            ref={input => this.fileInput = input}
          />
          <input className="full-width" type="submit" />
        </form>
        <section className="Application-images">
          { this.state.files.map(file => (
            <S3Image s3key={file.key} key={file.key} onRemove={this.handleRemove} />
          )) }
        </section>
      </div>
    );
  }
}

export default withAuthenticator(Application);
