import {
  Platform,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
} from 'react-native';
import RNRestart from 'react-native-restart';

const scaleValue = PixelRatio.get() / 2;

export * as regex from './regex';

export const enableExperimental = (): void => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const scaleWithPixel = (size: number, limitScale: number = 1.2): number => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};

export const heightHeader = (): number => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const landscape = width > height;

  if (Platform.OS === 'android') return 45;
  if ((Platform as any).isPad) return 65;

  switch (height) {
    case 812:
    case 844:
    case 896:
    case 926:
      return landscape ? 45 : 88;
    case 852:
    case 932:
      return landscape ? 45 : 104;
    default:
      return landscape ? 45 : 65;
  }
};

export const heightTabView = (): number => {
  const height = Dimensions.get('window').height;
  let size = height - heightHeader();
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      size -= 30;
      break;
    default:
      break;
  }

  return size;
};

export const getWidthDevice = (): number => {
  return Dimensions.get('window').width;
};

export const getHeightDevice = (): number => {
  return Dimensions.get('window').height;
};

export const scrollEnabled = (contentWidth: number, contentHeight: number): boolean => {
  return contentHeight > Dimensions.get('window').height - heightHeader();
};

export const languageFromCode = (code: string): string => {
  switch (code) {
    case 'en':
      return 'English';
    case 'vi':
      return 'Vietnamese';
    case 'ar':
      return 'Arabic';
    case 'da':
      return 'Danish';
    case 'de':
      return 'German';
    case 'el':
      return 'Greek';
    case 'fr':
      return 'French';
    case 'he':
      return 'Hebrew';
    case 'id':
      return 'Indonesian';
    case 'ja':
      return 'Japanese';
    case 'ko':
      return 'Korean';
    case 'lo':
      return 'Lao';
    case 'nl':
      return 'Dutch';
    case 'zh':
      return 'Chinese';
    case 'fa':
      return 'Iran';
    case 'km':
      return 'Cambodian';
    default:
      return 'Unknown';
  }
};

export const isLanguageRTL = (code: string): boolean => {
  switch (code) {
    case 'ar':
    case 'he':
      return true;
    default:
      return false;
  }
};

export const reloadLocale = (oldLanguage: string, newLanguage: string): void => {
  const oldStyle = isLanguageRTL(oldLanguage);
  const newStyle = isLanguageRTL(newLanguage);
  if (oldStyle != newStyle) {
    I18nManager.forceRTL(newStyle);
    RNRestart.Restart();
  }
}; 