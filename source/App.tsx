import React, { useCallback, useMemo } from "react";
import { AppStateStatus } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { useSingleState } from "react-obstate";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";
import { AutofillProvider } from "./contexts/autofill";
import { VaultProvider } from "./contexts/vault";
import { useAppStateDebouncedCallback } from "./hooks/app";
import { navigate } from "./state/navigation";
import { VAULT } from "./state/vault";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

function _App(props: AppProps = {}) {
    const isAutofill: boolean = useMemo(
        () => [1, true].indexOf(props.isContextAutoFill) > -1,
        [props]
    );
    const [currentSource] = useSingleState(VAULT, "currentSource");
    const handleCoverScreen = useCallback(
        (appState: AppStateStatus) => {
            if (isAutofill) return;
            if (appState === "inactive" || appState === "background") {
                navigate("Cover");
            }
        },
        [isAutofill]
    );
    useAppStateDebouncedCallback(handleCoverScreen);
    return (
        <VaultProvider sourceID={currentSource}>
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
