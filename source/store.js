import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchivePage.js";
import { linkArchiveManagerToStore } from "./shared/archiveChanges.js";

const store = createStore(reducer, applyMiddleware(thunk));

const { dispatch, getState } = store;
linkArchiveManagerToStore(store);

export default store;

export { dispatch, getState };
