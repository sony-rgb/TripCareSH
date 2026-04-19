declare module '@config' {
  export const BaseColor: any;
  export const BaseStyle: any;
  export const BaseSetting: any;
  export const useTheme: any;
  export const useFont: any;
  export const ThemeSupport: any;
  export const Images: any;
  export const FontSupport: any;
  export const DefaultFont: any;
  export const Typography: any;
  export const FontWeight: any;
  export const FontFamily: any;
}

declare module '@components' {
  export const AnimatedHeader: any;
  export const Header: any;
  export const SafeAreaView: any;
  export const Icon: any;
  export const Text: any;
  export const Button: any;
  export const TextInput: any;
  export const Image: any;
  export const Card: any;
  export const TourItem: any;
  export const FilterSort: any;
  export const ProfileDescription: any;
  export const ProfilePerformance: any;
  export const Tag: any;
  export const TourDay: any;
  export const PackageItem: any;
  export const RateDetail: any;
  export const CommentItem: any;
  export const HotelItem: any;
  export const CarItem: any;
  export const BusItem: any;
  export const FlightItem: any;
  export const CruiseItem: any;
  export const EventItem: any;
  export const EventCard: any;
  export const PostItem: any;
  export const PostListItem: any;
  export const ProfileAuthor: any;
  export const ProfileDetail: any;
  export const ProfileGroup: any;
  export const ProfileGroupSmall: any;
  export const BookingHistory: any;
  export const BookingTime: any;
  export const BusPlan: any;
  export const Coupon: any;
  export const HelpBlock: any;
  export const FlightPlan: any;
  export const FormOption: any;
  export const ListThumbCircle: any;
  export const ListThumbSquare: any;
  export const DatePicker: any;
  export const QuantityPicker: any;
  export const RangeSlider: any;
  export const StarRating: any;
  export const StepProgress: any;
  export const RoomType: any;
  export const HomeCity: any;
}

declare module '@screens/*' {
  const content: any;
  export = content;
}

declare module '@actions' {
  export const AuthActions: any;
  export const ApplicationActions: any;
}

declare module '@actions/*' {
  const content: any;
  export = content;
}

declare module '@data' {
  export const UserData: any;
  export const TourData: any;
  export const ReviewData: any;
  export const PackageData: any;
  export const BookingHistoryData: any;
  export const BusData: any;
  export const CarData: any;
  export const CruiseData: any;
  export const EventData: any;
  export const EventListData: any;
  export const FlightData: any;
  export const FlightBrandData: any;
  export const HotelData: any;
  export const MessagesData: any;
  export const NotificationData: any;
  export const PostData: any;
  export const PromotionData: any;
  export const CurrencyData: any;
  export const HelpBlockData: any;
  export const WorkProgressData: any;
  export const CouponsData: any;
}

declare module '@utils' {
  export const enableExperimental: () => void;
  export const scaleWithPixel: (size: number, limitScale?: number) => number;
  export const heightHeader: () => number;
  export const heightTabView: () => number;
  export const getWidthDevice: () => number;
  export const getHeightDevice: () => number;
  export const scrollEnabled: (contentWidth: number, contentHeight: number) => boolean;
  export const languageFromCode: (code: string) => string;
  export const isLanguageRTL: (code: string) => boolean;
  export const reloadLocale: (oldLanguage: string, newLanguage: string) => void;
  export const regex: any;
}

declare module 'react-native-restart' {
  const RNRestart: {
    Restart(): void;
  };
  export default RNRestart;
}

declare module 'redux-logger' {
  const logger: any;
  export default logger;
}

// React Native type declarations
declare module 'react-native' {
  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    onLayout?: (event: any) => void;
  }
  
  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
    numberOfLines?: number;
    onPress?: () => void;
    suppressHighlighting?: boolean;
  }
  
  export interface ImageProps {
    source?: any;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    children?: React.ReactNode;
  }
  
  export interface ScrollViewProps {
    style?: any;
    children?: React.ReactNode;
    contentContainerStyle?: any;
    scrollEnabled?: boolean;
    onContentSizeChange?: (contentWidth: number, contentHeight: number) => void;
    onScroll?: any;
    scrollEventThrottle?: number;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    nestedScrollEnabled?: boolean;
    ref?: any;
  }
  
  export interface FlatListProps<T> {
    data?: T[];
    renderItem?: (info: { item: T; index: number }) => React.ReactElement;
    keyExtractor?: (item: T, index: number) => string;
    style?: any;
    contentContainerStyle?: any;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    numColumns?: number;
    refreshControl?: React.ReactElement;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
    columnWrapperStyle?: any;
    scrollEventThrottle?: number;
    onScroll?: any;
    onContentSizeChange?: () => void;
    ref?: any;
    key?: string;
  }
  
  export interface TouchableOpacityProps {
    onPress?: (event?: any) => void;
    style?: any;
    children?: React.ReactNode;
    activeOpacity?: number;
  }
  
  export interface SwitchProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    size?: number;
    name?: string;
  }
  
  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    style?: any;
    onFocus?: () => void;
    autoCorrect?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    onSubmitEditing?: any;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search';
    multiline?: boolean;
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    selectionColor?: string;
  }
  
  export interface KeyboardAvoidingViewProps {
    behavior?: 'height' | 'position' | 'padding';
    children?: React.ReactNode;
    style?: any;
    keyboardVerticalOffset?: number;
    enabled?: boolean;
  }
  
  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    style?: any;
  }
  
  export interface RefreshControlProps {
    refreshing?: boolean;
    onRefresh?: () => void;
    colors?: string[];
    tintColor?: string;
  }
  
  export interface AnimatedProps {
    children?: React.ReactNode;
  }
  
  export interface StatusBarProps {
    barStyle?: 'default' | 'light-content' | 'dark-content';
    backgroundColor?: string;
  }
  
  export interface PlatformStatic {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    isPad?: boolean;
    select?: (config: { ios?: any; android?: any; default?: any }) => any;
  }
  
  export interface StyleSheetStatic {
    create(styles: any): any;
    absoluteFillObject: any;
    flatten: (style: any) => any;
  }
  
  export interface DimensionsStatic {
    get(dim: string): { width: number; height: number };
  }
  
  export interface PixelRatioStatic {
    get(): number;
  }
  
  export interface UIManagerStatic {
    setLayoutAnimationEnabledExperimental(enabled: boolean): void;
  }
  
  export interface LayoutAnimationStatic {
    configureNext(config: any): void;
    Presets: {
      easeInEaseOut: any;
    };
  }
  
  export interface I18nManagerStatic {
    forceRTL(forceRTL: boolean): void;
    isRTL: boolean;
  }
  
  export interface InteractionManagerStatic {
    runAfterInteractions(task: () => void): void;
  }
  
  export interface AnimatedStatic {
    Value: new (value: number) => any;
    event: (eventMapping: any[], config?: any) => any;
    add: (a: any, b: any) => any;
    diffClamp: (a: any, b: number, c: number) => any;
    View: React.ComponentType<ViewProps>;
    FlatList: React.ComponentType<FlatListProps<any>>;
    Image: React.ComponentType<ImageProps>;
  }
  
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const ImageBackground: React.ComponentType<ImageProps>;
  export const ScrollView: React.ComponentType<ScrollViewProps>;
  export const FlatList: React.ComponentType<FlatListProps<any>>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const KeyboardAvoidingView: React.ComponentType<KeyboardAvoidingViewProps>;
  export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
  export const RefreshControl: React.ComponentType<RefreshControlProps>;
  export const Animated: AnimatedStatic;
  export const StatusBar: React.ComponentType<StatusBarProps> & {
    setBackgroundColor: (color: string, animated?: boolean) => void;
    setBarStyle: (style: 'default' | 'light-content' | 'dark-content', animated?: boolean) => void;
  };
  export const Platform: PlatformStatic;
  export const StyleSheet: StyleSheetStatic;
  export const Dimensions: DimensionsStatic;
  export const PixelRatio: PixelRatioStatic;
  export const UIManager: UIManagerStatic;
  export const LayoutAnimation: LayoutAnimationStatic;
  export const I18nManager: I18nManagerStatic;
  export const InteractionManager: InteractionManagerStatic;
  export const useColorScheme: () => 'light' | 'dark';

  export interface LinkingStatic {
    openURL(url: string): Promise<void>;
    canOpenURL(url: string): Promise<boolean>;
    getInitialURL(): Promise<string | null>;
    addEventListener(type: string, handler: (event: { url: string }) => void): void;
    removeEventListener(type: string, handler: (event: { url: string }) => void): void;
  }

  export const Linking: LinkingStatic;

export interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  cancelable?: boolean;
  onDismiss?: () => void;
  userInterfaceStyle?: 'light' | 'dark';
}

export const Alert: {
  alert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ): void;
};

}

// React Navigation types
declare module '@react-navigation/stack' {
  export interface StackNavigationOptions {
    gestureEnabled?: boolean;
  }
  
  export function createStackNavigator(): any;
  export const CardStyleInterpolators: any;
}

declare module '@react-navigation/bottom-tabs' {
  export interface BottomTabNavigationOptions {
    tabBarIcon?: (props: { color: string; size?: number }) => React.ReactElement;
  }
  
  export function createBottomTabNavigator(): any;
}

// React Redux types
declare module 'react-redux' {
  export interface DefaultRootState {
    auth: {
      login: {
        success: boolean;
      };
    };
    application: {
      theme: any;
      font: any;
      force_dark: any;
      language: any;
    };
  }
  
  export function useSelector<TState = DefaultRootState, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFn?: (left: Selected, right: Selected) => boolean
  ): Selected;
  
  export function useDispatch<TDispatch = any>(): TDispatch;
  
  export const Provider: React.ComponentType<{ store: any; children: React.ReactNode }>;
} 