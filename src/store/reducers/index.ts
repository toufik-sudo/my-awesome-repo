import { combineReducers } from 'redux';
import generalReducer from './generalReducer';
import landingReducer from './landingReducer';
import languageReducer from './languageReducer';
import modalReducer from './modalReducer';
import launchReducer from './lauchReducer';
import wallReducer from './wallReducer';
import userDeclarationReducer from './userDeclarationReducer';
import onboardingReducer from './onboardingReducer';

export default combineReducers({
  languageReducer,
  generalReducer,
  landingReducer,
  modalReducer,
  launchReducer,
  wallReducer,
  userDeclarationReducer,
  onboardingReducer
});
