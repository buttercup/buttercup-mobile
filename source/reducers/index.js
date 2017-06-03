import { combineReducers } from "redux";
import archives from "./archives.js";
import routes from "./routes.js";
import addArchive from "./addArchive.js";
import remoteExplorer from "./remoteExplorer.js";

const rootReducer = combineReducers({
    addArchive,
    archives,
    remoteExplorer,
    routes
});

export default rootReducer;
