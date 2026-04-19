import * as actionTypes from '../actions/actionTypes';

interface ApplicationState {
  theme: any;
  font: any;
  force_dark: any;
  language: any;
}

const initialState: ApplicationState = {
  theme: null,
  font: null,
  force_dark: null,
  language: null,
};

export default (state: ApplicationState = initialState, action: any = {}): ApplicationState => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case actionTypes.CHANGE_FONT:
      return {
        ...state,
        font: action.font,
      };
    case actionTypes.FORCE_APPEARANCE:
      return {
        ...state,
        force_dark: action.force_dark,
      };
    case actionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
}; 