import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from "lodash";
import { Button, Select } from 'antd';
import PropTypes from "prop-types";
import * as utils from "../utils";

const Option = Select.Option;

class SettingsPanel extends Component {

  state = {editNodeProps: {}};
  initialStates = {};

  componentDidMount() {
    this.setState({...this.initialStates})
  }

  componentWillReceiveProps(newProps) {
    if(newProps.editNodeId !== this.props.editNodeId) {
      this.editNode = this.getEditNode(newProps)
    }else {
      return;
    }

    let props = this.getEditNodeProps(newProps);
    if(!_.isEmpty(props)) {
      this.setState({
        editNodeProps: props
      });
    }
  }

  onValueChange = (prop, value, id) => {
    this.setState({
      editNodeProps: {
        ...this.state.editNodeProps,
        [prop]: value
      }
    });
    // this.props.dispatch({type: "updateNode", data: {prop, value, id}});
  };

  onActionChange = (prop, key, actionType) => {
    let propConfig = _.clone(this.state.editNodeProps[prop]) || {};
    propConfig[key] = actionType;
    this.setState({
      editNodeProps: {
        ...this.state.editNodeProps,
        [prop]: propConfig
      }
    });
  };

  dispatchChange = () => {
    this.props.dispatch({type: "updateNode", data: {props: this.state.editNodeProps, id: this.editNodeId}});
  };


  renderSettings = () => {
    // config component props from redux store.
    const props = this.getEditNodeProps(this.props);
    if(_.isEmpty(props)) {
      return null;
    }
    let propNodes = [];
    _.each(props, (v, k) => {
      propNodes.push(
        this.getPropComponent(k)
      )
    });
    return propNodes;
  };

  getPropComponent = (propKey) => {
    if(this.npropsSpecs[propKey].type === PropTypes.func) {
      return (
        <div key={propKey}>
          <span>actionType: </span>
          <Select defaultValue="" onChange={(value)=>this.onActionChange(propKey, "actionType", value)}>
            <Option value="dispatch">dispatch</Option>
          </Select>
          <span>action: </span>
          <Select defaultValue="" onChange={(value)=>this.onActionChange(propKey, "action",value)}>
            <Option value="showWarning">showWarning</Option>
          </Select>
        </div>
      )
    }
    return (
      <div key={propKey}>
        <span>{propKey}</span><input type="text" onChange={(e)=>{this.onValueChange(propKey, e.target.value, this.editNode.id)}} value={this.state.editNodeProps[propKey]} />
      </div>
    )
  };

  getEditNode = (props) => {
    let {nodes, editNodeId} = props;
    if(!editNodeId) {
      return null;
    }
    return utils.findNode(nodes, editNodeId);
  };

  getEditNodeProps = (props) => {
    if(!this.editNode && this.editNode !== -1) {
      this.editNode = this.getEditNode(props);
    }
    let editNode = this.editNode;
    if(!editNode) {
      return {};
    }
    this.editNodeId = editNode.id;
    let nprops = editNode.props;
    const propNodes = [];
    let initialStates = {};
    for(let prop in nprops) {
      if (nprops.hasOwnProperty(prop)) {
        initialStates[prop] = nprops[prop].value;
      }
    }
    this.npropsSpecs = nprops;
    return initialStates;
  };

  render() {
    return (
      <div>
        <div>Settings panel</div>
        {this.renderSettings()}
        <Button onClick={this.dispatchChange}>dispatch</Button>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    nodes: state.componentTrees.nodes,
    editNodeId: state.componentTrees.editNodeId
  }
};

export default connect(mapStateToProps)(SettingsPanel);
