import React, { useEffect, useState } from "react";
import {
    LogBox,
    StatusBar
} from "react-native";
import { ApplicationProvider, IconRegistry, Layout, Spinner } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import "./polyfill/textEncoding";
import { initialise as initialiseButtercup } from "./services/buttercup";
import { initialise as initialiseLinking } from "./services/linking";
import { initialise as initialiseIconCache } from "./services/iconCache";
import { initialise as initialiseConfig } from "./services/config";
import { initialise as initialiseActivity } from "./services/activity";
import { initialise as initialiseAutoLock } from "./services/autoLock";
import { initialise as initialiseOTPs } from "./services/otpAll";
import { AppNavigator } from "./components/navigation/RootNavigator";
import { BusyStatus } from "./components/notifications/BusyStatus";
import { Toaster } from "./components/notifications/Toaster";
import { useAppearance } from "./hooks/appearance";

async function initialise() {
    LogBox.ignoreLogs([
        "new NativeEventEmitter",
        "EventEmitter.removeListener",
        "RCTBridge required dispatch_sync",
        "VirtualizedLists should never be nested"
    ]);
    await initialiseButtercup();
    await initialiseLinking();
    await initialiseConfig();
    await initialiseOTPs();
    initialiseIconCache();
    initialiseActivity();
    initialiseAutoLock();
}

export function StandardApp() {
    const isDarkMode = useAppearance() === "dark";
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
            <>
                <BusyStatus />
                <Toaster />
            </>
        </ApplicationProvider>
    );
}
