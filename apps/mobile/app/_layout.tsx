import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 60 * 24 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="car/[slug]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="spotlight/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="compare/index" options={{ presentation: "modal" }} />
      </Stack>
    </QueryClientProvider>
  );
}