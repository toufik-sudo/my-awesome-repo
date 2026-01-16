import { DEFAULT_LANGUAGE, FR_LABEL, FR_VALUE } from 'constants/i18n';
import { ILanguageOption } from 'interfaces/store/actions/ILanguageActions';
import { IAction, ILanguageReducer } from 'interfaces/store/IStore';
import { SET_LANGUAGE } from 'store/actions/actionTypes';

export const FR_LANGUAGE: ILanguageOption = { value: FR_VALUE, label: FR_LABEL };
export const mockIntl: (messages?: string[] | undefined) => any = (messages?: string[] | undefined) => {
  const intl: any = {
    formatMessage: (messageId: string) => `translated ${messageId}`,
    messages: {}
  };
  if (!messages || !messages.length) {
    return intl;
  }
  messages.forEach(message => {
    intl.messages[message] = 'test';
  });

  return intl;
};

export const languageStateMock: ILanguageReducer = {
  selectedLanguage: FR_LANGUAGE,
  messages: require(`../intl/languages/${FR_LANGUAGE.value}`)
};

export const setLanguageActionReturn: IAction<ILanguageOption> = {
  type: SET_LANGUAGE,
  payload: DEFAULT_LANGUAGE
};
