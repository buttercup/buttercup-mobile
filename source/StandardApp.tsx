import React, { useEffect, useState } from "react";
import {
    LogBox,
    StatusBar,
    useColorScheme
} from "react-native";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import "./polyfill/textEncoding";
import { initialise as initialiseButtercup } from "./services/buttercup";
import { initialise as initialiseLinking } from "./services/linking";
import { ApplicationProvider, IconRegistry, Layout, Spinner } from "@ui-kitten/components";
import { AppNavigator } from "./components/navigation/HomeNavigator";
import { BusyStatus } from "./components/notifications/BusyStatus";
import { Toaster } from "./components/notifications/Toaster";

async function initialise() {
    LogBox.ignoreLogs([
        "VirtualizedLists should never be nested"
    ]);
    await initialiseButtercup();
    await initialiseLinking();
}

export function StandardApp() {
    const isDarkMode = useColorScheme() === "dark";
    const [initialised, setInitialised] = useState(false);
    useEffect(() => {
        let mounted = true;
        initialise()
            .then(() => {
                if (!mounted) return;
                setInitialised(true);
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
        return () => {
            mounted = false;
        };
    }, []);
    return (
        <ApplicationProvider {...eva} theme={isDarkMode ? eva.dark : eva.light}>
            <IconRegistry icons={EvaIconsPack} />
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {initialised && <AppNavigator eva={eva} />}
            {!initialised && (
                <Layout
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Spinner size="giant" />
                </Layout>
            )}
            <BusyStatus />
            <Toaster />
        </ApplicationProvider>
    );
}
