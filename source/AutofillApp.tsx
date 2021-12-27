import React from "react";
import {
    StatusBar,
    useColorScheme
} from "react-native";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import "./polyfill/textEncoding";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { AppNavigator } from "./components/navigation/autofill/AutofillHomeNavigator";
import { BusyStatus } from "./components/notifications/BusyStatus";
import { Toaster } from "./components/notifications/Toaster";
import { ErrorBoundary } from "./components/ErrorBoundary";

interface AutoFillAppProps {
    urls: Array<string>;
}

export function AutofillApp(props: AutoFillAppProps) {
    const isDarkMode = useColorScheme() === "dark";
    return (
        <ApplicationProvider {...eva} theme={isDarkMode ? eva.dark : eva.light}>
            <ErrorBoundary>
                <IconRegistry icons={EvaIconsPack} />
                <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
                <AppNavigator eva={eva} />
                <>
                    <BusyStatus />
                    <Toaster />
                </>
            </ErrorBoundary>
        </ApplicationProvider>
    )
}
