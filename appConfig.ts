import { Platform } from "react-native";

// .env should be at the root of the project, as per expo documentation
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return (
        process.env.EXPO_PUBLIC_API_URL_DEV_ANDROID ||
        "http://192.168.5.10:3000"
      );
    }
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_API_URL_DEV_IOS || "http://localhost:3000";
    }
  }

  const prodUrl = process.env.EXPO_PUBLIC_API_URL_PROD || "https://tripcare.co";

  console.log("[AppConfig] API Base URL:", prodUrl, "DEV:", __DEV__);

  return prodUrl;
};

export const API_BASE_URL = getApiBaseUrl();
