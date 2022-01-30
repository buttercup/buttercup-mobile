import Toast from "react-native-toast-message";

const TOP_OFFSET = 42;

export function notifyError(title: string, message: string) {
    Toast.show({
        type: "error",
        position: "top",
        text1: title,
        text2: message,
        topOffset: TOP_OFFSET,
        visibilityTime: 10000
    });
}

export function notifySuccess(title: string, message: string) {
    Toast.show({
        type: "success",
        position: "top",
        text1: title,
        text2: message,
        topOffset: TOP_OFFSET
    });
}

export function notifyWarning(title: string, message: string) {
    Toast.show({
        type: "warning",
        position: "top",
        text1: title,
        text2: message,
        topOffset: TOP_OFFSET
    });
}
