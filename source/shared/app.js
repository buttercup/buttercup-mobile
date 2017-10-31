import { dispatch } from "../store.js";
import { resetState } from "../actions/app.js";

export function resetAppState() {
    dispatch(resetState());
}
