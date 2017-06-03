import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchivePage.js";

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

export default store;
