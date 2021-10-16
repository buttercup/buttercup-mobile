import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import EventEmitter from "eventemitter3";

const events = new EventEmitter();
let __focused: string = null;

export function useFocusedTab(): string {
    const [focused, setFocused] = useState(__focused);
    useEffect(() => {
        const cb = newFocused => {
            setFocused(newFocused);
        };
        events.on("focused", cb);
        return () => {
            events.off("focused", cb);
        };
    }, []);
    return focused;
}

export function useTabFocusState(focused: string) {
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && __focused !== focused) {
            __focused = focused;
        } else if (!isFocused && __focused === focused) {
            __focused = null;
        }
        events.emit("focused", __focused);
    }, [isFocused]);
}
