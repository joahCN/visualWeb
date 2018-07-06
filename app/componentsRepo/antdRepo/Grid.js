import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from "prop-types";
import _ from "lodash";
import {dropWrapper} from "../../dropWapper";

class Cell extends React.Component {

  render() {
    const {col, isOver, canDrop, connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        <Col className={isOver ? "dragOver" : ""} span={col} >col {col} {this.props.children}</Col>
      </div>
    )
  }
}

export default class Grid extends React.Component {
  static propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    children: PropTypes.array
  };

  static defaultProps = {
    row: 4,
    col: 4,
    children: []
  };

  renderGrid() {
    let {row, col} = this.props;
    row = parseInt(row, 10);
    col = parseInt(col, 10);
    const rowNodes = [];
    let colNodes = [];
    let CellComp;
    let children = null;
    let cid="";
    for(let i = 0; i<row; i++) {
      for(let j =0;j<col; j++) {
        CellComp = dropWrapper(Cell);
        cid = `c${i}${j}`;
        children = this.getChildren(cid);
        colNodes.push(<CellComp col={24/col} id={Date.now()} pid={this.props.id} cid={cid} >{children}</CellComp>);
      }
      rowNodes.push(React.createElement(Row, {span: 24/row}, colNodes));
      colNodes = [];
    }
    return rowNodes;
  }

  getChildren(id) {
    const children = this.props.children;
    const childs = React.Children.toArray(children);
    // if(childs && childs.length) {
    //   return childs[0];
    // }
    // return null;

    return _.filter(childs, (child) => {
      return child.type.cid === id;
    })
  }

  render() {
    return (
      <div style={{backgroundColor: "green"}}>
        {this.renderGrid()}
      </div>
    )
  }

}
