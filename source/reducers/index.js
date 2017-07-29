import { combineReducers } from "redux";
import archives from "./archives.js";
import archiveContents from "./archiveContents.js";
import routes from "./routes.js";
import addArchive from "./addArchive.js";
import remoteExplorer from "./remoteExplorer.js";
import entry from "./entry.js";
import app from "./app.js";

const rootReducer = combineReducers({
    addArchive,
    app,
    archiveContents,
    archives,
    entry,
    remoteExplorer,
    routes
});

export default rootReducer;
