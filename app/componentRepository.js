import { DatePicker } from 'antd';
import PropTypes from "prop-types";
import Grid from "./componentsRepo/antdRepo/Grid";
import Block from "./componentsRepo/antdRepo/Block";
import Button from "./componentsRepo/antdRepo/Button";

const antd = {
  datePicker: {
    comp: DatePicker,
    props: {

    }
  },
  button: {
    comp: Button
  },
  grid: {
    comp: Grid
  },
  block: {
    comp: Block
  }
};

export default {
  antd
}
