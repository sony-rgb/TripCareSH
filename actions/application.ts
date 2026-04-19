import * as actionTypes from './actionTypes';

interface ThemeAction {
  type: string;
  theme: any;
}

interface FontAction {
  type: string;
  font: any;
}

interface ForceThemeAction {
  type: string;
  force_dark: any;
}

interface LanguageAction {
  type: string;
  language: any;
}

const changeTheme = (theme: any): ThemeAction => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme,
  };
};

const changeFont = (font: any): FontAction => {
  return {
    type: actionTypes.CHANGE_FONT,
    font,
  };
};

const forceTheme = (force_dark: any): ForceThemeAction => {
  return {
    type: actionTypes.FORCE_APPEARANCE,
    force_dark,
  };
};

const changeLanguge = (language: any): LanguageAction => {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language,
  };
};

export const onChangeTheme = (theme: any) => (dispatch: any) => {
  dispatch(changeTheme(theme));
};

export const onForceTheme = (mode: any) => (dispatch: any) => {
  dispatch(forceTheme(mode));
};

export const onChangeFont = (font: any) => (dispatch: any) => {
  dispatch(changeFont(font));
};

export const onChangeLanguage = (language: any) => (dispatch: any) => {
  dispatch(changeLanguge(language));
}; 