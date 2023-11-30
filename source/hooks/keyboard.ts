import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useKeyboardSize(): number {
    const [keyboardSize, setKeyboardSize] = useState(0);
    useEffect(() => {
        const showListener = Keyboard.addListener("keyboardDidShow", e => {
            setKeyboardSize(e.endCoordinates.height);
        });
        const hideListener = Keyboard.addListener("keyboardDidHide", e => {
            setKeyboardSize(e.endCoordinates.height);
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);
    return keyboardSize;
}
