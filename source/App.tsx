import React, { useCallback, useMemo } from "react";
import { AppStateStatus } from "react-native";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";
import { useAppStateDebouncedCallback } from "./hooks/app";
import { navigate } from "./state/navigation";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

export function App(props: AppProps = {}) {
    const isAutofill: boolean = useMemo(() => props.isContextAutoFill === 1, [props]);
    const handleCoverScreen = useCallback((appState: AppStateStatus) => {
        if (isAutofill) return;
        if (appState === "inactive" || appState === "background") {
            navigate("Cover");
        }
    }, [isAutofill]);
    useAppStateDebouncedCallback(handleCoverScreen);
    if (isAutofill) {
        return (
            <AutofillApp
                urls={props.serviceIdentifiers || []}
            />
        );
    }
    return <StandardApp />;
}
