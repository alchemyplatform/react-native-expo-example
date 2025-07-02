import "node-libs-react-native/globals.js";
import "react-native-get-random-values";

import { alchemy, sepolia } from "@account-kit/infra";
import {
  AlchemyAccountProvider,
  createConfig,
} from "@account-kit/react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

const config = createConfig({
  chain: sepolia,
  transport: alchemy({ apiKey: process.env.EXPO_PUBLIC_API_KEY! }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AlchemyAccountProvider config={config} queryClient={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AlchemyAccountProvider>
    </ThemeProvider>
  );
}
