import { dispatch } from "../store.js";
import { navigateToRoot } from "../actions/navigation.js";

export function backToRoot() {
    dispatch(navigateToRoot());
}
