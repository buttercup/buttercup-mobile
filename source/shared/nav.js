import { dispatch } from "../store.js";
import { navigateBack, navigateToLockPage, navigateToRoot } from "../actions/navigation.js";

let __lockPageShown = false;

export function backToRoot() {
    dispatch(navigateToRoot());
}

export function hideLockPage() {
    if (__lockPageShown) {
        dispatch(navigateBack());
        __lockPageShown = false;
    }
}

export function showLockPage() {
    dispatch(navigateToLockPage());
    __lockPageShown = true;
}
