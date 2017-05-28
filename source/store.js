import { createStore } from "redux";
import reducer from "./reducers/index.js";
import { onArchiveTypeSelected } from "./actions/AddArchive.js";

const store = createStore(reducer);

export default store;
