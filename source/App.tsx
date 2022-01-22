import React, { useCallback, useMemo } from "react";
import { AppStateStatus } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";
import { AutofillProvider } from "./contexts/autofill";
import { useAppStateDebouncedCallback } from "./hooks/app";
import { navigate } from "./state/navigation";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

function _App(props: AppProps = {}) {
    const isAutofill: boolean = useMemo(() => [1, true].indexOf(props.isContextAutoFill) > -1, [props]);
    const handleCoverScreen = useCallback((appState: AppStateStatus) => {
        if (isAutofill) return;
        if (appState === "inactive" || appState === "background") {
            navigate("Cover");
        }
    }, [isAutofill]);
    useAppStateDebouncedCallback(handleCoverScreen);
    return (
        <AutofillProvider autofillURLs={props.serviceIdentifiers || []} isAutofill={isAutofill}>
            {isAutofill && (
                <AutofillApp />
            ) || (
                <StandardApp />
            )}
        </AutofillProvider>
    );
}

export const App = gestureHandlerRootHOC(_App);
