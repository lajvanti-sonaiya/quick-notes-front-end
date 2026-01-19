"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import SocketProvider from "./socket/SocketProvider";
import './globals.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
<style>
</style>
      </head>
      <body>
        <AppRouterCacheProvider>
         
            <Provider store={store}>
               <SocketProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </SocketProvider>
            </Provider>
          
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
