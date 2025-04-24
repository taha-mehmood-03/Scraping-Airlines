// providers/Providers.tsx
"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const navigate = React.useCallback(
    (url: string, options?: object) => {
      router.push(url, options as any);
    },
    [router]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={navigate}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
