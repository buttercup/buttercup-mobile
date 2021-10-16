import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import EventEmitter from "eventemitter3";

const events = new EventEmitter();
let __focused: string = null,
    __focusedTitle: string = "";

export function useFocusedTab(): [string, string] {
    const [focused, setFocused] = useState(__focused);
    const [title, setTitle] = useState(__focusedTitle);
    useEffect(() => {
        const cb = ([newFocused, newTitle]) => {
            setFocused(newFocused);
            setTitle(newTitle);
        };
        events.on("focused", cb);
        cb([__focused, __focusedTitle]);
        return () => {
            events.off("focused", cb);
        };
    }, []);
    return [focused, title];
}

export function useTabFocusState(slug: string, title: string) {
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && __focused !== slug) {
            __focused = slug;
            __focusedTitle = title;
        } else if (!isFocused && __focused === slug) {
            __focused = null;
            __focusedTitle = "";
        }
        events.emit("focused", [__focused, __focusedTitle]);
    }, [isFocused]);
}
