import React, { Component } from 'react';
import PropTypes from "prop-types";
import { DragSource } from 'react-dnd';
import _ from 'lodash';
import { Tag } from 'antd';
import {repos} from '../componentsRepo/index';
import {DRAG_TYPES} from '../core/dragType';

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */

function componentWrap(CompNode) {

  // get default props from SPEC defined at componentRepository;
  let generatorDefaultProps = (props) => {
    const categories = props.category.replace("-", ".");
    const comp = props.type;
    const repo = _.get(repos, categories);
    // let compConfig = compsRepo.antd[compType];
    let propsSpec = repo[comp].propTypes;
    const defaultPropsValue = repo[comp].defaultProps;
    let compProps = {};
    _.each(propsSpec, (v, k)=>{
      compProps[k] = {
        type: v,
        value: v === PropTypes.func ? {} : (defaultPropsValue[k] || "")
      };
    });
    return compProps;
  };

  const cardSource = {
    canDrag(props) {
      // You can disallow drag based on props
      return true//props.isReady;
    },

    isDragging(props, monitor) {
      // If your component gets unmounted while dragged
      // (like a card in Kanban board dragged between lists)
      // you can implement something like this to keep its
      // appearance dragged:
      return monitor.getItem().id === props.id;
    },

    beginDrag(props) {
      // Return the data describing the dragged item
      const item = {
        type: props.type,
        id: Date.now(),
        props: {
          ...generatorDefaultProps(props)
        }
      };
      return item;
    },

    endDrag(props, monitor) {
      if (!monitor.didDrop()) {
        // You can check whether the drop was successful
        // or if the drag ended but nobody handled the drop
        return;
      }

      // When dropped on a compatible target, do something.
      // Read the original dragged item from getItem():
      // const item = monitor.getItem();

      // You may also read the drop result from the drop target
      // that handled the drop, if it returned an object from
      // its drop() method.
      const dropResult = monitor.getDropResult();

      return dropResult;
    }
  };

  class Comp extends Component {

    render() {
      const {isDragging, connectDragSource} = this.props;
      return connectDragSource(<span>{this.props.type}</span>);
    }

  }

  return DragSource(DRAG_TYPES, cardSource, (connect, monitor) => ({
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  }))(Comp);

}

export default class ComponentsPanel extends Component {


  constructor(props, context) {
    super(props, context);
    const ROOT_NAME = "repos";

    this.repos = this.renderRepos(repos, ROOT_NAME);
  }

  renderComponentTree = (comps, category) => {
    if(_.isEmpty(comps)) {
      return null;
    }

    return _.map(comps, (comp)=>{
      const CompLabel = componentWrap(comp.name);
      return <div><Tag><CompLabel category={category} type={comp.name} /></Tag></div>
    });

  };

  renderRepos = (repos, parentCategory) =>{
    let nodes = [];
    _.each(repos, (comps, category) => {
      nodes = nodes.concat(this.renderComponentTree(comps, category));
    });
    return (
      <div>
        {nodes}
      </div>
    );
  };

  render() {
    let repos = this.repos;
    return (
      <div>
        {repos}
      </div>
    );
  }
}
