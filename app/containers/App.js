// @flow
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import * as React from 'react';

type Props = {
  children: React.Node
};

class App extends React.Component<Props> {
  props: Props;

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default DragDropContext(HTML5Backend)(App);
