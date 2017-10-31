import { dispatch, getState } from "../store.js";
import { navigateBack, navigateToLockPage, navigateToRoot } from "../actions/navigation.js";
import { isRoot } from "../selectors/nav.js";

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

/**
 * Navigates back a page if not on main screen
 * @returns {Boolean} True if navigation possible, false otherwise
 */
export function navigateBackIfPossible() {
    const state = getState();
    if (isRoot(state) === false) {
        dispatch(navigateBack());
        return true;
    }
    return false;
}

export function showLockPage() {
    dispatch(navigateToLockPage());
    __lockPageShown = true;
}
