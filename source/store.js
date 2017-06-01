import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchivePage.js";

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

store.dispatch({
    type: "addArchive/setURL",
    payload: "https://storage.perry.cx/remote.php/webdav"
});
store.dispatch({
    type: "addArchive/setUsername",
    payload: "pez"
});

export default store;
