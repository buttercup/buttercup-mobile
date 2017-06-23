import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchivePage.js";
import onStateChange from "./shared/stateChanges.js";
import { linkArchiveManagerToStore } from "./shared/archiveChanges.js";

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

const { dispatch, getState } = store;
store.subscribe(() => onStateChange(store, dispatch));
linkArchiveManagerToStore(store);

export default store;

export { dispatch, getState };
