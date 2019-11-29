import { combineReducers } from "redux";
import { APP_MASTER_RESET } from "../actions/types.js";
import archives from "./archives.js";
import archiveContents from "./archiveContents.js";
import autofill from "./autofill.js";
// import nav from "./nav.js";
import addArchive from "./addArchive.js";
import remoteExplorer from "./remoteExplorer.js";
import entry from "./entry.js";
import app from "./app.js";
import dropbox from "./dropbox.js";
import browser from "./browser.js";
import googleDrive from "./googleDrive.js";

const appReducer = combineReducers({
    addArchive,
    app,
    archiveContents,
    archives,
    autofill,
    browser,
    dropbox,
    entry,
    googleDrive,
    // nav,
    remoteExplorer
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_RESET) {
        // reset global state
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
