import React, { useCallback, useMemo } from "react";
import { AppStateStatus } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { useState as useHookState } from "@hookstate/core";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";
import { AutofillProvider } from "./contexts/autofill";
import { VaultProvider } from "./contexts/vault";
import { useAppStateDebouncedCallback } from "./hooks/app";
import { navigate } from "./state/navigation";
import { CURRENT_SOURCE } from "./state/vault";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

function _App(props: AppProps = {}) {
    const isAutofill: boolean = useMemo(() => [1, true].indexOf(props.isContextAutoFill) > -1, [props]);
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const handleCoverScreen = useCallback((appState: AppStateStatus) => {
        if (isAutofill) return;
        if (appState === "inactive" || appState === "background") {
            navigate("Cover");
        }
    }, [isAutofill]);
    useAppStateDebouncedCallback(handleCoverScreen);
    return (
        <VaultProvider sourceID={currentSourceState.get()}>
            <AutofillProvider autofillURLs={props.serviceIdentifiers || []} isAutofill={isAutofill}>
                {isAutofill && (
                    <AutofillApp />
                ) || (
                    <StandardApp />
                )}
            </AutofillProvider>
        </VaultProvider>
    );
}

export const App = gestureHandlerRootHOC(_App);
