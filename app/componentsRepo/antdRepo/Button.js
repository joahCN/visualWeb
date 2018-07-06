import React from 'react';
import {Button as AntBtn} from "antd";
import PropTypes from "prop-types";

export default class Button extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    type: "primary",
    size: "large",
    text: "button",
    onClick: {}
  };

  onActive = () => {
    const {actionType, action} = this.props.onClick;
    const dispatchAction = this.props.dispatchAction;
    if(actionType === "dispatch") {
      dispatchAction({
        type: action
      })
    }
  };

  render(){
    const {type, size, text} = this.props;
    return (
      <AntBtn type={type} size={size} onClick={this.onActive} >{text}</AntBtn>
    )
  }
}
