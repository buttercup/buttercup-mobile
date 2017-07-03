import { Alert } from "react-native";

export function handleError(message, error) {
    // alert(`Error: ${message}\n\n${error.message}`);
    setTimeout(() => {
        Alert.alert(
            `Error: ${message}`,
            typeof error === "string" ?
                error :
                error.message,
            [
                { text: "OK", onPress: () => {} }
            ],
            { cancelable: false }
        );
    }, 0);
}
