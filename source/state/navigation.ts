import { NavigationContainerRef } from "@react-navigation/native";

let __rootNavigationElement: NavigationContainerRef = null;

export function navigate(target: string, props?: { [key: string]: any }) {
    if (__rootNavigationElement) {
        __rootNavigationElement.navigate(target, props);
    }
}

export function navigateBack() {
    if (__rootNavigationElement) {
        __rootNavigationElement.goBack();
    }
}

export function rootNavigationRef(newNode: NavigationContainerRef) {
    __rootNavigationElement = newNode;
}
