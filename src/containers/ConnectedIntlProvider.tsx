import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { ILanguageReducer } from '../interfaces/store/IStore';

/**
 * Exports the IntlProvider connected to redux store to use it in language switcher
 *
 * @param state
 */
function mapStateToProps(state: { languageReducer: ILanguageReducer }) {
  const {
    selectedLanguage: { value: locale },
    messages
  } = state.languageReducer;

  return { locale, messages };
}

export default connect(mapStateToProps)(IntlProvider);
