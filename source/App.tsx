import React, { useCallback, useMemo, useState } from "react";
import { AppStateStatus } from "react-native";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";
import { useAppStateDebouncedCallback } from "./hooks/app";
import { navigate, navigateBack } from "./state/navigation";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

export function App(props: AppProps = {}) {
    const isAutofill: boolean = useMemo(() => props.isContextAutoFill === 1, [props]);
    const [covering, setCovering] = useState(false);
    const handleCoverScreen = useCallback((appState: AppStateStatus) => {
        if (isAutofill) return;
        if (appState === "active") {
            if (!covering) return;
            setCovering(false);
            navigateBack();
        } else if (appState === "inactive" || appState === "background") {
            if (covering) return;
            setCovering(true);
            navigate("Cover");
        }
    }, [covering, isAutofill]);
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
