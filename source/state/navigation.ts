let __rootNavigationElement: any = null;

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

export function navigateBackToRoot() {
    if (__rootNavigationElement) {
        while (__rootNavigationElement.canGoBack()) {
            try {
                __rootNavigationElement.goBack();
            } catch (err) {}
        }
    }
}

export function rootNavigationRef(newNode: any) {
    __rootNavigationElement = newNode;
}
