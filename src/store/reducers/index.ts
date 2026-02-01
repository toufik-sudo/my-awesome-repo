// -----------------------------------------------------------------------------
// Root Reducer
// Combines all reducers into the root reducer
// -----------------------------------------------------------------------------

import { combineReducers } from 'redux';
import languageReducer from './languageReducer';
import generalReducer from './generalReducer';
import modalReducer from './modalReducer';
import landingReducer from './landingReducer';
import launchReducer from './launchReducer';
import onboardingReducer from './onboardingReducer';
import userDeclarationReducer from './userDeclarationReducer';
import wallReducer from '@/features/wall/store/wallReducer';
import declarationsReducer from '@/features/declarations/store/declarationsReducer';

const rootReducer = combineReducers({
  languageReducer,
  generalReducer,
  modalReducer,
  landingReducer,
  launchReducer,
  onboardingReducer,
  userDeclarationReducer,
  wallReducer,
  declarations: declarationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
