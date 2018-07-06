// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import componentTrees from './componentTrees';
import componentActivities from './componentActivities';

const rootReducer = combineReducers({
  componentTrees,
  componentActivities,
  counter,
  router
});

export default rootReducer;
