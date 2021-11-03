import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useDebouncedCallback } from "use-debounce";

export function useAppState(): AppStateStatus {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    const handleStateChange = useCallback(nextAppState => {
        if (nextAppState !== appState) {
            setAppState(nextAppState);
        }
    }, [appState]);
    useEffect(() => {
        AppState.addEventListener("change", handleStateChange);
        return () => {
            AppState.removeEventListener("change", handleStateChange);
        };
    }, [handleStateChange]);
    return appState;
}

export function useAppStateDebouncedCallback(callback: (appState: AppStateStatus) => void) {
    const [lastCalledState, setLastCalledState] = useState<AppStateStatus>(null);
    const cb = useDebouncedCallback(callback, 250, {
        leading: true,
        trailing: true,
        maxWait: 500
    });
    const appState = useAppState();
    useEffect(() => {
        if (lastCalledState === appState) return;
        setLastCalledState(appState);
        cb(appState);
    }, [appState, cb, lastCalledState]);
}
