// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { Button, Alert } from 'antd';
import _ from 'lodash';
import PropTypes from "prop-types";
import styles from './Home.css';
import compsRepo from '../componentRepository';
import {repos} from '../componentsRepo/index';
import {DRAG_TYPES} from '../core/dragType';

type Props = {};

const Types = {
  CHESSPIECE: 'card'
};

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const chessSquareTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return true;
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    // const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();

    props.dispatch({type: 'add', item});

    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);
    console.log("dropped: " + JSON.stringify(item));

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

function wrapDisplayedComponent(item, dispatch, children) {

  return class DisplayedComp extends React.Component {
    state = {
      isFocused: false
    };

    static cid = item.cid;

    onMouseEnter = (e) => {
      this.setState({
        isFocused: true
      });
      e.stopPropagation();
      return false;
    };

    onMouseLeave = (e) => {
      this.setState({
        isFocused: false
      });
      e.stopPropagation();
      return false;
    };

    onShowSettings = () => {
      dispatch({
        type: 'settings',
        data: {
          id: item.id
        }
      })
    };

    getCompProps = (propsConfig) => {
      let props = {};
      _.each(propsConfig, (v, k)=>{
        props[k] = v.value;
      });
      return props;
    };

    getOtherProps = (props) => {
      return _.omit(props, ["type", "props", "children"]);
    };

    render() {
      let Comp = repos.antd[item.type]; // retrive Component from componentRepository.
      // let itemProps = item.props || compConfig.comp.propTypes;
      // let props = this.getCompProps(itemProps); // retrive Component Props from item node which stored in redux store.
      let props = {};
      if(item.props && !_.isEmpty(item.props)) {
        const compChangeableProps = item.props;
        props = {...this.getCompProps(compChangeableProps), ...this.getOtherProps(item)};
      } else {
        props = this.getCompProps(Comp.propTypes);
      }
      // props.id = item.id;
      // let Comp = compConfig.comp || item.type;

      return (
        <div key={item.id} onDoubleClick={this.onMouseEnter} className="displayedCompShow">
          <div className={this.state.isFocused ? "displayedCompOps" : "hide"}>
            <Button onClick={this.onShowSettings}>settings {item.type}</Button>
            <Button>删除</Button>
            <Button onClick={this.onMouseLeave}>hide</Button>
          </div>
          <Comp {...props} dispatchAction={dispatch}>{children}</Comp>
        </div>
      )
    }
  }


}

class Home extends Component<Props> {
  props: Props;

  renderNodes() {
    // const children = this.props.nodes.children;
    // return children.map((node)=>{
    //   // const compConfig = compsRepo.antd[node.type];
    //   const WrappedComp = wrapDisplayedComponent(node, this.props.dispatch);
    //   return <WrappedComp />;
    // });

    return this._renderNodes(this.props.nodes);
  }

  _renderNodes = (node) => {
    let children = node.children;
    let WrappedComp;
    if(!children || !children.length) {
      WrappedComp = wrapDisplayedComponent(node, this.props.dispatch);
      return <WrappedComp />;
    }
    let comps = [];
    _.each(children, (node)=>{
      WrappedComp = this._renderNodes(node);
      comps.push(WrappedComp);
    });
    WrappedComp = wrapDisplayedComponent(node, this.props.dispatch, comps);

    return <WrappedComp />;
  };

  hideWarning = () => {
    this.props.dispatch({type: "hideWarning"});
  };

  showWarning = () => {
    if(this.props.isShowWarning) {
      return (
        <Alert
          message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
          type="warning"
          closable
          onClose={this.hideWarning}
        />
      )
    }
  };

  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        <div className="container" data-tid="container">
          <Link to="/counter">to Counter</Link>
          {this.renderNodes()}
        </div>
        {this.showWarning()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    nodes: state.componentTrees.nodes,
    isShowWarning: state.componentActivities.isShowWarning
  }
);

export default connect(mapStateToProps)(DropTarget(DRAG_TYPES, chessSquareTarget, (connectDND, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connectDND.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))(Home));
