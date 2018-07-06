/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import {Row, Col} from "antd";
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import ComponentsPanel from './components/ComponentsPanel';
import SettingsPanel from './components/SettingsPanel';


export default () => (
  <App>
    <Row>
      <Col span={6}>
        <ComponentsPanel />
      </Col>
      <Col span={12}>
        <Switch>
          <Route path="/counter" component={CounterPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Col>
      <Col span={6}>
        <SettingsPanel />
      </Col>
    </Row>
  </App>
);
