import React from 'react';

export default class Block extends React.Component {

  render() {
    return (
      <div style={{width: "100%", height: "100%", backgroundColor: "yellow"}}>I am root {this.props.children}</div>
    )
  }
}
