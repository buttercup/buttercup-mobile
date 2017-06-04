import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchivePage.js";
import onStateChange from "./shared/stateChanges.js";

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

const { dispatch } = store;
store.subscribe(() => onStateChange(store, dispatch));

export default store;

export { dispatch };
